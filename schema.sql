DROP TABLE IF EXISTS hiking;
CREATE TABLE hiking (
  id SERIAL PRIMARY KEY,
  center VARCHAR(350),
  rating VARCHAR(20),
  zoom INTEGER,
  location_name VARCHAR(100)
);

DROP TABLE IF EXISTS camping;
CREATE TABLE camping (
  id SERIAL PRIMARY KEY,
  center VARCHAR(350),
  rating VARCHAR(20),
  zoom INTEGER,
  location_name VARCHAR(100)
);

/* database name = blazingdata */