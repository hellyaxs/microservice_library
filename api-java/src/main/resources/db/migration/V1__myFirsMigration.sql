CREATE TABLE IF NOT EXISTS person (
    id UUID PRIMARY KEY,
    FIRST_NAME VARCHAR(100) NOT NULL,
    LAST_NAME VARCHAR(100),
    birthdate DATE,
    endereco VARCHAR(255),
    cargo VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS phone (
     id UUID PRIMARY KEY,
     ddd VARCHAR(3) NOT NULL,
     numero VARCHAR(9) NOT NULL,
     tipo VARCHAR(50),
     person_id UUID,
     FOREIGN KEY (person_id) REFERENCES person(ID) ON DELETE CASCADE
);