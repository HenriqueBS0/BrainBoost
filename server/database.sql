CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE study_list (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    FOREIGN KEY ("client_id") REFERENCES client(id)
);

CREATE TABLE concept (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    study_list_id INTEGER NOT NULL,
    FOREIGN KEY (study_list_id) REFERENCES study_list(id)
);