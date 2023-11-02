INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("John", "Doe", "john_doe", "johndoe1234@gmail.com", "$2b$05$0V/v35TC4kZTy1QN29/sheFti5jyxV/BFxX2d1/X3MSqEPVHQhg5i");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("Robby", "Gusman", "robby_g", "robbyGusman@gmail.com", "$2b$05$Zu1l64l.wg08QYmzq3.BQ.9W/rGX3EOF.F0LGXN61WZ2cWjfkj7VG");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("Fellicia", "Tian", "FelliUwU", "TianFellicia@gmail.com", "$2b$05$sNb.S.N.xa3ur0yjofPWXekJ1a/g3abVtOj5/pi6CwD.c.yCOC9qq");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("Bryan", "Walker", "BW", "bryanWalker@gmail.com", "$2b$05$39mUeEKFsM/pAiflA8onj.a3JtZjIcUocl90OtsqYM.NJwnEb.SqG");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("Michael", "Wu", "michaelWu88", "michaelW@gmail.com", "$2b$05$N.UgxkZ01e2c2YbT.HN25.9G/QJttMdsdm4pYNDYmZQkQAVWX8y5i");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("Angel", "Tran", "AT", "AngelTran45@gmail.com", "$2b$05$IvJXDkn93zM68e2ud5xEx.hq.82GlhuIQyYh.pWyxpNPJTt3GsCR.");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("Kevin", "Nguyen", "kevv55", "kevin_ng38@gmail.com", "$2b$05$FS4lOCITms3ObxHJNzFDrOrWPN6H8zqm4/1WmySW/ocr1DGrcImBy");

INSERT INTO users 
(first_name, last_name, username, email, password)
VALUES ("Jeffrey", "Banning", "jeffBan", "jeff_banning@gmail.com", "$2b$05$KgLEWiB134a7KDPSPkY7p.nm2Gcpfhc/XNsYxvR/Ac77uuPEhPwR.");

/*belongs to Angel Tran, username: AT*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Toyota", "Corolla", (SELECT id FROM users WHERE username="AT"), "Limited", 2020, "Silver", 25000, "Automatic", "Hybrid", "Front wheel drive", "Clean title", 23000, "Good condition, well-maintained, service record at Toyota dealership. Highest trim level with all options you ever needed: navigation, heated seats, LED headlights, etc.");

/*belongs to Kevin Nguyen, username: kevv55*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Honda", "Accord", (SELECT id FROM users WHERE username="kevv55"), "EX", 2019, "Black", 35000, "Automatic", "Hybrid", "Front wheel drive", "Clean title", 17800, "Very good condition, garage kept, and routinely maintained at Honda dealership. Very fuel efficient hybrid powertrain returning up to 48 MPG and very economical to maintain. Hybrid battery warranty still active until 8 years/100,000 Miles.");

/*belongs to John Doe, username john_doe*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Ford", "Focus", (SELECT id FROM users WHERE username="john_doe"), "ST", 2016, "Red", 42000, "Automatic", "Gasoline", "Front wheel drive", "Salvage title", 10500, "Fastest engine option with 252 HP, very fun to drive. Salvage title because of rear end collision, engine components still in good condition.");

/*belongs to Jeffrey Banning, username jeffBan*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Chevrolet", "Cruze", (SELECT id FROM users WHERE username="jeffBan"), "LT", 2018, "Red", 38000, "Automatic", "Gasoline", "Front wheel drive", "Clean title", 15000, "Good condition, great daily car with compact size for easy maneuverability around town and tons of features you ever needed navigation, bluetooth, heated seats came standard. Letting go for a great deal at $11200 or best offer.");

/*belongs to Fellicia Tian, username FelliUwU*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Nissan", "Altima", (SELECT id FROM users WHERE username="FelliUwU"), "SR", 2020, "Blue", 30000, "Automatic", "Gasoline", "Front wheel drive", "Salvage title", 14500, "New facelifted model 2020 with new front end design with LED headlights. Fully loaded features. Salvage title because side collision but already repaired with like new result. Engine and transmission in good condition, runs like new.");

/*belongs to Michael Wu, username michaelWu88*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Kia", "Optima", (SELECT id FROM users WHERE username="michaelWu88"), "SX Turbo", 2019, "Gray", 28000, "Automatic", "Gasoline", "Front wheel drive", "Clean title", 16500, "High end trim Optima with the most powerful engine output of 245 HP and fully loaded features. Very rare trim, hard to find one in the market with like new condition and low mileage. Need to let go ASAP because moving out of state.");

/*belongs to Robby Gusman, username robby_g*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Hyundai", "Elantra", (SELECT id FROM users WHERE username="robby_g"), "SE", 2018, "Silver", 33000, "Automatic", "Gasoline", "Front wheel drive", "Clean title", 14000, "Very good condition, well maintained with a service record at Hyundai. Runs like new, good compact car for daily or first car. Active warranty until 2025 with free routine maintenance included. Great deal!");

/*belongs to John Doe, username john_doe*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Mazda", "3 Hatchback", (SELECT id FROM users WHERE username="john_doe"), "Carbon edition", 2020, "Black", 25000, "Automatic", "Gasoline", "Front wheel drive", "Clean title", 25000, "Carbon edition trim with red leather interior. Carbon trim includes more sporty exterior styling. This car is very fun to drive and practical because of the hatchback. In excellent condition and low mileage. Still has active warranty from Mazda.");

/*belongs to Bryan Walker, username BW*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Subaru", "WRX", (SELECT id FROM users WHERE username="BW"), "STI", 2017, "Blue", 32000, "Manual", "Gasoline", "All wheel drive", "Clean title", 30000, "STI trim with most powerful engine option and handling package for a very fun to drive experience. Car is in very good condition and well maintained, mostly highway driving so engine still has a long life ahead.");

/*belongs to Bryan Walker, username BW*/
INSERT INTO car_listing 
(make, model, user_id, trim, year, color, mileage, transmission, fuel_type, drivetrain, title_status, price, description)
VALUES ("Volkswagen", "Jetta", (SELECT id FROM users WHERE username="BW"), "SEL", 2019, "White", 28000, "Automatic", "Gasoline", "Front wheel drive", "Salvage title", 16000, "Salvage title because car got rear-ended but repaired with like new results. Engine and transmission still runs like new, routinely serviced at Volkswagen and still has active warranty.");