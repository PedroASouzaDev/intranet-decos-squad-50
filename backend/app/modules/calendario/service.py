import uuid
from datetime import UTC, date, datetime, time

from fastapi import HTTPException, status
from sqlalchemy import extract, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.core.permissions import Papel, UsuarioAutenticado, pode_gerenciar_setor
from app.modules.calendario.models import Evento
from app.modules.calendario.schemas import AniversarianteResposta, EventoAtualizar, EventoCriar
from app.modules.setores.service import buscar_setor
from app.modules.usuarios.models import Usuario

PERIODO_INVALIDO = {
    "campo": "data_fim",
    "mensagem": "Data de fim deve ser posterior à data de início",
}
SETOR_OBRIGATORIO = {
    "campo": "setor_id",
    "mensagem": "Informe o setor do evento",
}


# Eventos: leitura institucional (todo autenticado vê tudo), edição escopada por setor.


def listar_eventos(
    sessao: Session,
    de: date | None = None,
    ate: date | None = None,
    setor_id: uuid.UUID | None = None,
) -> list[Evento]:
    consulta = (
        select(Evento)
        .options(selectinload(Evento.autor), selectinload(Evento.setor))
        .order_by(Evento.data_inicio, Evento.titulo)
    )
    if de is not None:
        consulta = consulta.where(Evento.data_inicio >= datetime.combine(de, time.min, tzinfo=UTC))
    if ate is not None:
        # time.max para incluir o dia inteiro de `ate`.
        consulta = consulta.where(Evento.data_inicio <= datetime.combine(ate, time.max, tzinfo=UTC))
    if setor_id is not None:
        # Filtro de conveniência da tela, não restrição de visibilidade.
        consulta = consulta.where(Evento.setor_id == setor_id)
    return list(sessao.scalars(consulta))


def buscar_evento(sessao: Session, evento_id: uuid.UUID) -> Evento:
    consulta = (
        select(Evento)
        .options(selectinload(Evento.autor), selectinload(Evento.setor))
        .where(Evento.id == evento_id)
    )
    evento = sessao.scalars(consulta).first()
    if evento is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Evento não encontrado")
    return evento


def criar_evento(sessao: Session, dados: EventoCriar, usuario: UsuarioAutenticado) -> Evento:
    _validar_periodo(dados.data_inicio, dados.data_fim)
    setor_id = _resolver_setor(dados.setor_id, usuario)
    buscar_setor(sessao, setor_id)
    evento = Evento(
        titulo=dados.titulo,
        descricao=dados.descricao,
        data_inicio=dados.data_inicio,
        data_fim=dados.data_fim,
        autor_id=usuario.id,
        setor_id=setor_id,
    )
    sessao.add(evento)
    try:
        sessao.commit()
    except IntegrityError:
        sessao.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Autor do evento não encontrado")
    return buscar_evento(sessao, evento.id)


def atualizar_evento(
    sessao: Session, evento_id: uuid.UUID, dados: EventoAtualizar, usuario: UsuarioAutenticado
) -> Evento:
    evento = buscar_evento(sessao, evento_id)
    _garantir_escopo(usuario, evento.setor_id)
    _validar_periodo(dados.data_inicio, dados.data_fim)
    evento.titulo = dados.titulo
    evento.descricao = dados.descricao
    evento.data_inicio = dados.data_inicio
    evento.data_fim = dados.data_fim
    sessao.commit()
    return buscar_evento(sessao, evento.id)


def deletar_evento(sessao: Session, evento_id: uuid.UUID, usuario: UsuarioAutenticado) -> None:
    evento = buscar_evento(sessao, evento_id)
    _garantir_escopo(usuario, evento.setor_id)
    sessao.delete(evento)
    sessao.commit()


# Aniversariantes: derivados de usuarios.data_nascimento, não são registro próprio.


def listar_aniversariantes(sessao: Session, mes: int | None = None) -> list[AniversarianteResposta]:
    mes_alvo = mes if mes is not None else date.today().month
    consulta = (
        select(Usuario)
        .options(selectinload(Usuario.setor))
        .where(
            Usuario.ativo.is_(True),
            Usuario.data_nascimento.is_not(None),
            extract("month", Usuario.data_nascimento) == mes_alvo,
        )
        .order_by(extract("day", Usuario.data_nascimento), Usuario.nome)
    )
    return [
        AniversarianteResposta(
            id=usuario.id,
            nome=usuario.nome,
            dia=usuario.data_nascimento.day,
            setor_id=usuario.setor_id,
            setor_nome=usuario.setor.nome if usuario.setor else None,
        )
        for usuario in sessao.scalars(consulta)
    ]


def _resolver_setor(setor_id: uuid.UUID | None, usuario: UsuarioAutenticado) -> uuid.UUID:
    """admin_setor cria sempre no próprio setor; superadmin escolhe."""
    if usuario.role == Papel.ADMIN_SETOR:
        if usuario.setor_id is None or (setor_id is not None and setor_id != usuario.setor_id):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Fora do seu setor")
        return usuario.setor_id
    escolhido = setor_id or usuario.setor_id
    if escolhido is None:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, SETOR_OBRIGATORIO)
    return escolhido


def _garantir_escopo(usuario: UsuarioAutenticado, setor_id: uuid.UUID) -> None:
    if not pode_gerenciar_setor(usuario, setor_id):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Fora do seu setor")


def _validar_periodo(data_inicio: datetime, data_fim: datetime | None) -> None:
    if data_fim is not None and data_fim < data_inicio:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, PERIODO_INVALIDO)
