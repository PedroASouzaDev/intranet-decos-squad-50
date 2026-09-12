# Intranet do Hospital

Sistema interno para o hospital: comunicados, calendário, documentos (POPs etc.), organização por setor e canal de dúvidas dos colaboradores.

## Language

**Setor**:
Unidade organizacional do hospital (ex: enfermagem, farmácia) que delimita o escopo de atuação de um `admin_setor` e a dono de recursos como documentos.

**Role**:
Nível de acesso do usuário:
- `comum` — consome conteúdo, sem permissão administrativa (mas pode enviar dúvidas).
- `admin_setor` — administrador **operacional**: cria e mantém conteúdo do dia a dia (avisos, documentos, eventos, ramal do próprio setor), em geral escopado ao próprio setor. **Sem acesso** às páginas de Administração (Usuários, Registro de atividades) nem à criação de setores novos.
- `superadmin` — papel de nível **sistêmico** (equivalente a alguém de TI), com acesso irrestrito, independente de setor. Exclusivo das páginas de Administração e da criação de setores novos.

**Log de auditoria**:
Registro de ações administrativas (criar, editar, deletar) em qualquer módulo, persistido no Postgres para consulta (ex: "tudo que o usuário X fez"). Não inclui ações de leitura.
_Avoid_: Log técnico, log de erro

**Log técnico**:
Registro de exceptions e erros 500 da aplicação, sem valor de auditoria. Não é persistido no banco.
_Avoid_: Log de auditoria

**Documento**:
Arquivo pertencente a um setor (ex: POP). O metadado (nome, setor, quem fez upload) mora no Postgres; o binário mora no MinIO — são armazenados separadamente por design.

**Mural**:
Módulo de comunicados/avisos do setor ou do hospital.

**Dúvidas**:
Módulo onde colaboradores enviam perguntas; um admin cadastra manualmente a resposta, que passa a aparecer na lista pública de FAQ. Não há rastreamento individual — quem enviou não acompanha status da própria pergunta.

**Ramal**:
Número de telefone interno associado a um setor. Um setor pode ter mais de um ramal.

**Evento**:
Item do calendário (ex: reunião, treinamento), distinto de aniversariante (que é derivado da data de nascimento do usuário, não um registro próprio). Criado por `admin_setor` ou `superadmin`; sempre visível a todos, sem escopo por setor.
