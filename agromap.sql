CREATE DATABASE IF NOT EXISTS agromap_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agromap_db;

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    tipo_usuario VARCHAR(30) DEFAULT 'produtor',
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Propriedade (
    id_propriedade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    localizacao VARCHAR(255),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    area_total DECIMAL(12,2),
    hectares_plantados DECIMAL(12,2),
    cultura_principal VARCHAR(100),
    outras_culturas VARCHAR(255),
    epoca_plantio VARCHAR(100),
    irrigacao VARCHAR(50),
    observacoes TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,

    CONSTRAINT fk_propriedade_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES Usuario(id_usuario)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Talhao (
    id_talhao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    area DECIMAL(12,2),
    tipo_solo VARCHAR(100),
    id_propriedade INT NOT NULL,

    CONSTRAINT fk_talhao_propriedade
    FOREIGN KEY (id_propriedade)
    REFERENCES Propriedade(id_propriedade)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Cultura (
    id_cultura INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ciclo_medio INT,
    unidade_producao VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Plantio (
    id_plantio INT AUTO_INCREMENT PRIMARY KEY,
    data_plantio DATE,
    data_prevista_colheita DATE,
    area_plantada DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'Planejado',
    id_talhao INT NOT NULL,
    id_cultura INT NOT NULL,

    CONSTRAINT fk_plantio_talhao
    FOREIGN KEY (id_talhao)
    REFERENCES Talhao(id_talhao)
    ON DELETE CASCADE,

    CONSTRAINT fk_plantio_cultura
    FOREIGN KEY (id_cultura)
    REFERENCES Cultura(id_cultura)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Dados_Climaticos (
    id_dado_climatico INT AUTO_INCREMENT PRIMARY KEY,
    data_coleta DATE NOT NULL,
    temperatura_media DECIMAL(8,2),
    precipitacao DECIMAL(10,2),
    umidade_media DECIMAL(8,2),
    vento_medio DECIMAL(8,2),
    fonte VARCHAR(100),
    id_talhao INT NOT NULL,

    CONSTRAINT fk_clima_talhao
    FOREIGN KEY (id_talhao)
    REFERENCES Talhao(id_talhao)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Previsao (
    id_previsao INT AUTO_INCREMENT PRIMARY KEY,
    data_previsao DATETIME DEFAULT CURRENT_TIMESTAMP,
    producao_esperada DECIMAL(12,2),
    cenario VARCHAR(100),
    confianca DECIMAL(5,2),
    modelo_utilizado VARCHAR(100),
    id_plantio INT NOT NULL,

    CONSTRAINT fk_previsao_plantio
    FOREIGN KEY (id_plantio)
    REFERENCES Plantio(id_plantio)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Perdas (
    id_perda INT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATE NOT NULL,
    tipo_perda VARCHAR(100),
    causa VARCHAR(255),
    quantidade_perdida DECIMAL(12,2),
    observacoes TEXT,
    id_talhao INT NOT NULL,

    CONSTRAINT fk_perda_talhao
    FOREIGN KEY (id_talhao)
    REFERENCES Talhao(id_talhao)
    ON DELETE CASCADE
);