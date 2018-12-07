DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial,
  username varchar not null,
  password varchar not null,
  hscore int,

  PRIMARY KEY (id)
);

INSERT INTO users (username, password, hscore)
VALUES ('Adam','password1',NULL),('Hunter','password2',NULL),('John','password3',NULL),('Taicheng','password4',NULL),('Connor','password5',NULL),('Jason','password6',NULL);
