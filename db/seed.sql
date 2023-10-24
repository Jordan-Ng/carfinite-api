INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("user", "user", "user", "user@email.com", "$2b$05$bxiBA5eGO7ySWhHt6ZucZeQR/fs67zWHcyJS02b5mCgNLPY8/YffK");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("user2", "user2", "user2", "user2@email.com", "$2b$05$bxiBA5eGO7ySWhHt6ZucZeQR/fs67zWHcyJS02b5mCgNLPY8/YffK");

INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("make1", "model1", (SELECT id FROM users WHERE username="user"), "trim1", 2020, "red", 1234, "transmission1", "fuel_type1", "drivetrain1", "title_status1", 1234, "user1car1");

INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("make2", "model2", (SELECT id FROM users WHERE username="user2"), "trim2", 2020, "red", 1234, "transmission2", "fuel_type2", "drivetrain2", "title_status2", 1234, "user2car1");
