USE EEDatabase;

INSERT INTO departments (name)
VALUES
  ('Hosts'),
  ('Service'),
  ('Bar Staff'),
  ('Parking'),
  ('Leadership');

INSERT INTO roles (title, salary, department_id)
VALUES
('Lead Hostess', 200000, 1),
('Server', 300000, 2),
('Bartender', 400000, 3),
('Valet', 500000, 4),
('Manager', 600000, 5);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Rupert', 'Giles', 5, NULL),
('Willow', 'Rosenberg', 1, 1),
('Jay', 'Beach', 2, 1),
('Xander', 'Harris', 3, 1),
('Buffy', 'Summers', 4, 1);
 