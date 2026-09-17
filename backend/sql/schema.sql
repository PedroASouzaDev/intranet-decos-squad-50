CREATE TABLE setores (
  id        UUID        DEFAULT gen_random_uuid() NOT NULL,
  nome      VARCHAR(200) NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT pk_setores PRIMARY KEY (id),
  CONSTRAINT uq_setores_nome UNIQUE (nome)
);

CREATE TABLE ramais (
  id       UUID        DEFAULT gen_random_uuid() NOT NULL,
  numero   VARCHAR(20) NOT NULL,
  setor_id UUID        NOT NULL,
  CONSTRAINT pk_ramais PRIMARY KEY (id),
  CONSTRAINT fk_ramais_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE usuarios (
  id              UUID         DEFAULT gen_random_uuid() NOT NULL,
  nome            VARCHAR(200) NOT NULL,
  email           VARCHAR(200) NOT NULL,
  senha_hash      VARCHAR(255) NOT NULL,
  role            VARCHAR(20)  DEFAULT 'comum' NOT NULL,
  setor_id        UUID,
  data_nascimento DATE,
  ativo           BOOLEAN      DEFAULT TRUE NOT NULL,
  criado_em       TIMESTAMPTZ  DEFAULT now() NOT NULL,
  CONSTRAINT pk_usuarios PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  CONSTRAINT ck_usuarios_role CHECK (role IN ('comum', 'admin_setor', 'superadmin')),
  CONSTRAINT fk_usuarios_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE tokens_atualizacao (
  id         UUID        DEFAULT gen_random_uuid() NOT NULL,
  usuario_id UUID        NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expira_em  TIMESTAMPTZ NOT NULL,
  revogado   BOOLEAN     DEFAULT FALSE NOT NULL,
  criado_em  TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT pk_tokens_atualizacao PRIMARY KEY (id),
  CONSTRAINT uq_tokens_atualizacao_hash UNIQUE (token_hash),
  CONSTRAINT fk_tokens_atualizacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

CREATE TABLE avisos (
  id            UUID         DEFAULT gen_random_uuid() NOT NULL,
  titulo        VARCHAR(200) NOT NULL,
  conteudo      TEXT         NOT NULL,
  chave_imagem  VARCHAR(500),
  autor_id      UUID         NOT NULL,
  setor_id      UUID         NOT NULL,
  criado_em     TIMESTAMPTZ  DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMPTZ,
  CONSTRAINT pk_avisos PRIMARY KEY (id),
  CONSTRAINT fk_avisos_autor FOREIGN KEY (autor_id) REFERENCES usuarios (id),
  CONSTRAINT fk_avisos_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE eventos (
  id          UUID         DEFAULT gen_random_uuid() NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  descricao   TEXT,
  data_inicio TIMESTAMPTZ  NOT NULL,
  data_fim    TIMESTAMPTZ,
  autor_id    UUID         NOT NULL,
  setor_id    UUID         NOT NULL,
  criado_em   TIMESTAMPTZ  DEFAULT now() NOT NULL,
  CONSTRAINT pk_eventos PRIMARY KEY (id),
  CONSTRAINT fk_eventos_autor FOREIGN KEY (autor_id) REFERENCES usuarios (id),
  CONSTRAINT fk_eventos_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE documentos (
  id                  UUID         DEFAULT gen_random_uuid() NOT NULL,
  nome                VARCHAR(255) NOT NULL,
  setor_id            UUID         NOT NULL,
  enviado_por         UUID         NOT NULL,
  chave_armazenamento VARCHAR(500) NOT NULL,
  criado_em           TIMESTAMPTZ  DEFAULT now() NOT NULL,
  CONSTRAINT pk_documentos PRIMARY KEY (id),
  CONSTRAINT fk_documentos_setor FOREIGN KEY (setor_id) REFERENCES setores (id),
  CONSTRAINT fk_documentos_usuario FOREIGN KEY (enviado_por) REFERENCES usuarios (id)
);

CREATE TABLE faq (
  id            UUID         DEFAULT gen_random_uuid() NOT NULL,
  pergunta      VARCHAR(500) NOT NULL,
  resposta      TEXT         NOT NULL,
  area          VARCHAR(20)  NOT NULL,
  criado_por    UUID         NOT NULL,
  setor_id      UUID         NOT NULL,
  criado_em     TIMESTAMPTZ  DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMPTZ,
  CONSTRAINT pk_faq PRIMARY KEY (id),
  CONSTRAINT fk_faq_usuario FOREIGN KEY (criado_por) REFERENCES usuarios (id),
  CONSTRAINT fk_faq_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE logs_auditoria (
  id         UUID        DEFAULT gen_random_uuid() NOT NULL,
  usuario_id UUID        NOT NULL,
  acao       VARCHAR(50) NOT NULL,
  modulo     VARCHAR(50) NOT NULL,
  setor_id   UUID,
  detalhes   TEXT,
  criado_em  TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT pk_logs_auditoria PRIMARY KEY (id),
  CONSTRAINT fk_logs_auditoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  CONSTRAINT fk_logs_auditoria_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE INDEX ix_ramais_setor ON ramais (setor_id);
CREATE INDEX ix_usuarios_setor ON usuarios (setor_id);
CREATE INDEX ix_tokens_atualizacao_usuario ON tokens_atualizacao (usuario_id);
CREATE INDEX ix_avisos_autor ON avisos (autor_id);
CREATE INDEX ix_avisos_setor ON avisos (setor_id);
CREATE INDEX ix_eventos_autor ON eventos (autor_id);
CREATE INDEX ix_eventos_setor ON eventos (setor_id);
CREATE INDEX ix_documentos_setor ON documentos (setor_id);
CREATE INDEX ix_documentos_usuario ON documentos (enviado_por);
CREATE INDEX ix_faq_usuario ON faq (criado_por);
CREATE INDEX ix_faq_setor ON faq (setor_id);
CREATE INDEX ix_logs_auditoria_usuario ON logs_auditoria (usuario_id);
CREATE INDEX ix_logs_auditoria_setor ON logs_auditoria (setor_id);
