-- CREATE DATABASE mydatabase;

\c mydatabase;

CREATE TABLE IF NOT EXISTS person (
    ID BIGSERIAL PRIMARY KEY,
    FIRST_NAME VARCHAR(100) NOT NULL,
    LAST_NAME VARCHAR(100),
    birthdate DATE,
    endereco VARCHAR(255),
    cargo VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS phone (
    id BIGSERIAL PRIMARY KEY,
    ddd VARCHAR(3) NOT NULL,
    numero VARCHAR(9) NOT NULL,
    tipo VARCHAR(50),
    person_id BIGINT,
    FOREIGN KEY (person_id) REFERENCES person(ID) ON DELETE CASCADE
    );