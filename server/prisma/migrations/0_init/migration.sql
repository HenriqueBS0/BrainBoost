CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    name CHARACTER(100) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE study_list (
    id SERIAL PRIMARY KEY,
    title CHARACTER(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    FOREIGN KEY ("client_id") REFERENCES client(id)
);

CREATE TABLE concept (
    id SERIAL PRIMARY KEY,
    title CHARACTER(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    study_list_id INTEGER NOT NULL,
    FOREIGN KEY (study_list_id) REFERENCES study_list(id)
);

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "concept_title_key" ON "concept"("title");

-- CreateIndex
CREATE UNIQUE INDEX "study_list_title_key" ON "study_list"("title");