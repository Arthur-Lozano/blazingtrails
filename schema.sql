DROP TABLE IF EXISTS hiking;
CREATE TABLE hiking (
  id SERIAL PRIMARY KEY,
  name VARCHAR(350),
  rating VARCHAR(100),
  formatted_address VARCHAR(100),
  description VARCHAR(350)
);

DROP TABLE IF EXISTS camping;
CREATE TABLE camping (
  id SERIAL PRIMARY KEY,
  name VARCHAR(350),
  rating VARCHAR(100),
  formatted_address VARCHAR(100),
  description VARCHAR(350)
);