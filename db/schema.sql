DROP TABLE IF EXISTS editors;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS editors_join;

CREATE TABLE editors (
       editors_id SERIAL UNIQUE PRIMARY KEY,
       email VARCHAR(255),
       password_digest TEXT
);

CREATE TABLE subscribers (
       subscribers_id SERIAL UNIQUE PRIMARY KEY,
       email VARCHAR(255),
       password_digest TEXT
);

CREATE TABLE posts (
       posts_id SERIAL UNIQUE PRIMARY KEY,
       name VARCHAR(255),
       occupation TEXT,
       years integer,
       country TEXT,
       bio TEXT,
       img VARCHAR(255)
);

CREATE TABLE editors_join (
  editors_id integer REFERENCES editors,
  posts_id integer REFERENCES posts,
  PRIMARY KEY (editors_id, posts_id)
);
