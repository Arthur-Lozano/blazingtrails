DROP TABLE IF EXISTS hiking;
CREATE TABLE hiking(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  types VARCHAR(255),
  business_status VARCHAR(255),
  formatted_address VARCHAR(255),
  rating VARCHAR(20)
);



/* database name = hikingblazingdata */