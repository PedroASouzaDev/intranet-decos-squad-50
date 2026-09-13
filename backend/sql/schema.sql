CREATE TABLE setores (
  id        RAW(16)       DEFAULT SYS_GUID() NOT NULL,
  nome      VARCHAR2(200) NOT NULL,
  criado_em TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_setores PRIMARY KEY (id),
  CONSTRAINT uq_setores_nome UNIQUE (nome)
);

CREATE TABLE ramais (
  id       RAW(16)      DEFAULT SYS_GUID() NOT NULL,
  numero   VARCHAR2(20) NOT NULL,
  setor_id RAW(16)      NOT NULL,
  CONSTRAINT pk_ramais PRIMARY KEY (id),
  CONSTRAINT fk_ramais_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE usuarios (
  id              RAW(16)       DEFAULT SYS_GUID() NOT NULL,
  nome            VARCHAR2(200) NOT NULL,
  email           VARCHAR2(200) NOT NULL,
  senha_hash      VARCHAR2(255) NOT NULL,
  role            VARCHAR2(20)  DEFAULT 'comum' NOT NULL,
  setor_id        RAW(16),
  data_nascimento DATE,
  ativo           NUMBER(1)     DEFAULT 1 NOT NULL,
  criado_em       TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_usuarios PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  CONSTRAINT ck_usuarios_role CHECK (role IN ('comum', 'admin_setor', 'superadmin')),
  CONSTRAINT ck_usuarios_ativo CHECK (ativo IN (0, 1)),
  CONSTRAINT fk_usuarios_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE tokens_atualizacao (
  id         RAW(16)       DEFAULT SYS_GUID() NOT NULL,
  usuario_id RAW(16)       NOT NULL,
  token_hash VARCHAR2(255) NOT NULL,
  expira_em  TIMESTAMP     NOT NULL,
  revogado   NUMBER(1)     DEFAULT 0 NOT NULL,
  criado_em  TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_tokens_atualizacao PRIMARY KEY (id),
  CONSTRAINT uq_tokens_atualizacao_hash UNIQUE (token_hash),
  CONSTRAINT ck_tokens_atualizacao_revogado CHECK (revogado IN (0, 1)),
  CONSTRAINT fk_tokens_atualizacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

CREATE TABLE avisos (
  id            RAW(16)       DEFAULT SYS_GUID() NOT NULL,
  titulo        VARCHAR2(200) NOT NULL,
  conteudo      CLOB          NOT NULL,
  chave_imagem  VARCHAR2(500),
  autor_id      RAW(16)       NOT NULL,
  setor_id      RAW(16)       NOT NULL,
  criado_em     TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  atualizado_em TIMESTAMP,
  CONSTRAINT pk_avisos PRIMARY KEY (id),
  CONSTRAINT fk_avisos_autor FOREIGN KEY (autor_id) REFERENCES usuarios (id),
  CONSTRAINT fk_avisos_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE eventos (
  id          RAW(16)       DEFAULT SYS_GUID() NOT NULL,
  titulo      VARCHAR2(200) NOT NULL,
  descricao   CLOB,
  data_inicio TIMESTAMP     NOT NULL,
  data_fim    TIMESTAMP,
  autor_id    RAW(16)       NOT NULL,
  setor_id    RAW(16)       NOT NULL,
  criado_em   TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_eventos PRIMARY KEY (id),
  CONSTRAINT fk_eventos_autor FOREIGN KEY (autor_id) REFERENCES usuarios (id),
  CONSTRAINT fk_eventos_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE documentos (
  id                  RAW(16)       DEFAULT SYS_GUID() NOT NULL,
  nome                VARCHAR2(255) NOT NULL,
  setor_id            RAW(16)       NOT NULL,
  enviado_por         RAW(16)       NOT NULL,
  chave_armazenamento VARCHAR2(500) NOT NULL,
  criado_em           TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_documentos PRIMARY KEY (id),
  CONSTRAINT fk_documentos_setor FOREIGN KEY (setor_id) REFERENCES setores (id),
  CONSTRAINT fk_documentos_usuario FOREIGN KEY (enviado_por) REFERENCES usuarios (id)
);

CREATE TABLE faq (
  id            RAW(16)       DEFAULT SYS_GUID() NOT NULL,
  pergunta      VARCHAR2(500) NOT NULL,
  resposta      CLOB          NOT NULL,
  area          VARCHAR2(20)  NOT NULL,
  criado_por    RAW(16)       NOT NULL,
  setor_id      RAW(16)       NOT NULL,
  criado_em     TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  atualizado_em TIMESTAMP,
  CONSTRAINT pk_faq PRIMARY KEY (id),
  CONSTRAINT fk_faq_usuario FOREIGN KEY (criado_por) REFERENCES usuarios (id),
  CONSTRAINT fk_faq_setor FOREIGN KEY (setor_id) REFERENCES setores (id)
);

CREATE TABLE logs_auditoria (
  id         RAW(16)      DEFAULT SYS_GUID() NOT NULL,
  usuario_id RAW(16)      NOT NULL,
  acao       VARCHAR2(50) NOT NULL,
  modulo     VARCHAR2(50) NOT NULL,
  setor_id   RAW(16),
  detalhes   CLOB,
  criado_em  TIMESTAMP    DEFAULT SYSTIMESTAMP NOT NULL,
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
