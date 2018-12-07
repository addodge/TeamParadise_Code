DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial,
  username varchar not null,
  password varchar not null,
  hscore int,

  PRIMARY KEY (id)
);

INSERT INTO users VALUES (1,'Adam','password1',NULL);
INSERT INTO users VALUES (2,'Hunter','password2',NULL);
INSERT INTO users VALUES (3,'John','password3',NULL);
INSERT INTO users VALUES (4,'Taicheng','password4',NULL);
INSERT INTO users VALUES (5,'Connor','password5',NULL);
INSERT INTO users VALUES (6,'Jason','password6',NULL);
