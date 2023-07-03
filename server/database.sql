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

CREATE TABLE audit (
    id SERIAL PRIMARY KEY,
    affected_table TEXT,
    operation TEXT,
    date_time TIMESTAMP DEFAULT NOW(),
    previous_data JSONB,
    current_data JSONB
);


CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit (affected_table, operation, current_data)
        VALUES (TG_TABLE_NAME, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit (affected_table, operation, previous_data, current_data)
        VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit (affected_table, operation, previous_data)
        VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON client
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON study_list
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON concept
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();