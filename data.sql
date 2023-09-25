-- Normal Database
DROP DATABASE IF EXISTS messagely;
CREATE DATABASE messagely;

\c messagely;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users(username),
    to_username text NOT NULL REFERENCES users(username),
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

INSERT INTO users
    VALUES
        ('username', 'helloworld1', 'Ryan', 'Dowd', '111-111-1111', '1-1-2000 1:1:1', '1-1-2000 1:1:1'),
        ('user2', 'helloworld2', 'Ryan2', 'Dowd2', '111-111-1112', '1-1-2000 1:1:1', '1-1-2000 1:1:1');

INSERT INTO messages
    VALUES
        (DEFAULT, 'username', 'user2', 'Hello There!', '2020-11-10 11:20:34', '2020-11-10 11:20:34');


-- Test Database
DROP DATABASE IF EXISTS messagely_test;
CREATE DATABASE messagely_test;

\c messagely_test;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users(username),
    to_username text NOT NULL REFERENCES users(username),
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

INSERT INTO users
    VALUES
        ('username', 'helloworld1', 'Ryan', 'Dowd', '111-111-1111', '1-1-2000 1:1:1', '1-1-2000 1:1:1'),
        ('user2', 'helloworld2', 'Ryan2', 'Dowd2', '111-111-1112', '1-1-2000 1:1:1', '1-1-2000 1:1:1');

INSERT INTO messages
    VALUES
        (DEFAULT, 'username', 'user2', 'Hello There!', '2020-11-10 11:20:34', '2020-11-10 11:20:34');