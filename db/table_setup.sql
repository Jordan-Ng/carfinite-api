
DROP TABLE IF EXISTS `session`;
DROP TABLE IF EXISTS `car_image`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `car_listing`;
DROP TABLE IF EXISTS `users`;


-- CREATE TABLE `users` (
--     id int NOT NULL AUTO_INCREMENT,
--     first_name varchar(255) NOT NULL,
--     last_name varchar(255) NOT NULL,
--     username varchar(255) NOT NULL,
--     email varchar(255) NOT NULL,
--     password varchar(255) NOT NULL,
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE session (
--     id int NOT NULL AUTO_INCREMENT,
--     user_id int NOT NULL,
--     token varchar(255) NOT NULL,
--     PRIMARY KEY(id),
--     FOREIGN kEY (user_id) REFERENCES users(id)
-- );

-- CREATE TABLE car_listing (
--     id int NOT NULL AUTO_INCREMENT,
--     make varchar(255) NOT NULL,
--     model varchar(255) NOT NULL,
--     user_id int NOT NULL,
--     trim varchar(255) NOT NULL,
--     year int NOT NULL,
--     color varchar(255) NOT NULL,
--     mileage int NOT NULL,
--     transmission varchar(255) NOT NULL,
--     fuel_type varchar(255) NOT NULL,
--     drivetrain varchar(255) NOT NULL,
--     title_status varchar(255) NOT NULL,
--     price double NOT NULL,
--     description LONGTEXT NOT NULL,
--     PRIMARY KEY(id),
--     FOREIGN kEY (user_id) REFERENCES users(id)
-- );

-- CREATE TABLE images (
--     id int NOT NULL AUTO_INCREMENT,
--     filename varchar(255) NOT NULL,
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE car_image (
--     id int NOT NULL AUTO_INCREMENT,
--     image_id int NOT NULL,
--     car_id int NOT NULL,
--     PRIMARY KEY(id),
--     FOREIGN kEY (image_id) REFERENCES images(id),
--     FOREIGN kEY (car_id) REFERENCES car_listing(id)
-- );






