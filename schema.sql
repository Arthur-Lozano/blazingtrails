DROP TABLE IF EXISTS hiking;
CREATE TABLE hiking (
  id SERIAL PRIMARY KEY,
  name VARCHAR(350),
  rating VARCHAR(20),
);

DROP TABLE IF EXISTS camping;
CREATE TABLE camping (
  id SERIAL PRIMARY KEY,
  name VARCHAR(350),
  rating VARCHAR(20),
);

/* database name = blazingdata */