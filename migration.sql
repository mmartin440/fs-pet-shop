DROP TABLE IF EXISTS pets; 

CREATE TABLE pets (
    id SERIAL, 
    name TEXT, 
    kind TEXT, 
    age INTEGER
); 

INSERT INTO pets (name, kind, age) VALUES ('Logan', 'chiken', 4); 
INSERT INTO pets (name, kind, age) VALUES ('Fido', 'dog', 3); 