DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial,
  username varchar not null,
  password varchar not null,
  hscore int,

  PRIMARY KEY (id)
);

INSERT INTO users (username, password, hscore)
VALUES ('admin','password0',0),('Adam','password1',0),('Hunter','password2',0),('John','password3',0),('Taicheng','password4',0),('Connor','password5',0),('Jason','password6',0);
