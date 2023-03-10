-- To recreate db, run: source /home/codio/workspace/backend_cw2/create_db.sql

-- Code to set up the database.

DROP DATABASE book_api_db;
CREATE DATABASE book_api_db;
USE book_api_db;

CREATE TABLE roles (
  name VARCHAR(16) UNIQUE NOT NULL,
  description TEXT,
  PRIMARY KEY (name));

CREATE TABLE users (
    ID INT NOT NULL AUTO_INCREMENT,
    role VARCHAR(16) NOT NULL DEFAULT 'user',
    firstName VARCHAR(32),
    lastName VARCHAR(32),
    username VARCHAR(16) UNIQUE NOT NULL,
    about TEXT,
    dateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(64) UNIQUE NOT NULL,
    avatarURL VARCHAR(64),
    PRIMARY KEY (ID),
    FOREIGN KEY (role) REFERENCES roles (name) ON DELETE CASCADE);

CREATE TABLE genres (
    ID INT NOT NULL AUTO_INCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    imageURL VARCHAR(2048),
    PRIMARY KEY (ID));

CREATE TABLE authors (
    ID INT NOT NULL AUTO_INCREMENT,
    fullName TEXT NOT NULL,
    about TEXT,
    imageURL VARCHAR(2048),
    PRIMARY KEY (ID));

CREATE TABLE books (
    ID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(32) NOT NULL,
    summary TEXT,
    datePublished DATE,
    isbn TEXT,
    imageURL VARCHAR(2048),
    authorID INT NOT NULL,
    genreID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (authorID) REFERENCES users (ID) ON DELETE CASCADE,
    FOREIGN KEY (genreiD) REFERENCES genres (ID) ON DELETE CASCADE);

CREATE TABLE reviews (
    ID INT NOT NULL AUTO_INCREMENT,
    rating INT NOT NULL,
    allText TEXT NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userID INT NOT NULL,
    bookID INT NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES users (ID) ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES books (ID) ON DELETE CASCADE);

-- Code to populate database.

INSERT INTO roles (name) VALUES ('user');
INSERT INTO roles (name) VALUES ('admin');

INSERT INTO users (role, username, password, email) VALUES
    ("admin", "sadat", "$2b$10$00WWC2hHbEeYji.T2fJ47uTouJPtDlohWvaST6Y2ZvJpmZUM2N6u2", "personalmalamute@gmail.com"),
    ("user", "pia", "$2b$10$zkxpPTqOBakGJJl//WZYHutFg8rx1kBeJHjkIHBE8MAAUFfNKHBGu", "piapereira7@gmail.com"),
    ("user", "younes", "$2b$10$GGd.SJKFNk1Y7cHDWjOXduVPH7ARepGjlT9CHKahK/BxwrG365FJy", "chakrounyounes@gmail.com");

INSERT INTO genres (name, description) VALUES
    ("Fantasy", "The fantasy genre involves imaginary or supernatural elements in a world that is different from the real world, often following a hero's journey to save the world or defeat evil forces."),
    ("Science-fiction", "The science-fiction genre is characterized by imaginative and futuristic concepts, often exploring the potential consequences of scientific and other innovations, and typically set in a future or alternative universe."),
    ("Romance", "The romance genre is characterized by the central theme of romantic love and the emotional journey of the characters as they develop a relationship and overcome obstacles to be together."),
    ("Mystery", "The mystery genre involves a puzzle or crime that needs to be solved, often through the investigation of clues and the work of a detective."),
    ("Horror", "The horror genre is characterized by an intense feeling of fear, shock, or disgust, often involving supernatural or macabre elements such as ghosts, monsters, or psychopaths."),
    ("Thriller", "The thriller genre is characterized by suspenseful and exciting plots that often involve danger, high stakes, and fast-paced action, keeping readers on the edge of their seats."),
    ("Young adult", "The young adult genre is typically aimed at a teenage audience and explores themes of growing up, self-discovery, and identity, often featuring protagonists in their teenage years.");

INSERT INTO authors (fullName, about) VALUES
    ("J.R.R. Tolkien", "J.R.R. Tolkien was a British author and philologist best known for his epic high-fantasy works The Hobbit and The Lord of the Rings, which have had a significant impact on the fantasy genre and popular culture."),
    ("Stephen King", "Stephen King is a prolific and highly influential American author known for his horror, suspense, and supernatural fiction, with works ranging from classics such as Carrie, The Shining, and It to more recent novels like The Outsider and The Institute."),
    ("John Green", "John Green is an American author known for his young adult novels that often explore themes of love, loss, and mental health, with his most famous works including The Fault in Our Stars, Looking for Alaska, and Paper Towns.");

INSERT INTO books (title, summary, datePublished, isbn, authorID, genreID) VALUES
    ("The Hobbit", "The Hobbit is a classic high-fantasy novel that tells the story of the hobbit Bilbo Baggins, who embarks on an adventure with a group of dwarves to reclaim their treasure from the dragon Smaug.", '2002-08-15', NULL, 1, 1),
    ("Doctor Sleep", "Doctor Sleep is a horror novel by Stephen King and a sequel to his earlier novel The Shining, following the adult life of Dan Torrance as he faces his past and battles a group of quasi-immortal beings who feed on children with psychic abilities.", '2013-09-24', "9781476727653", 2, 5),
    ("Looking for Alaska", "Looking for Alaska is a young adult novel that follows the story of Miles Halter as he navigates his first year at a boarding school and his relationships with his new friends, including the enigmatic and troubled Alaska Young.", '2006-12-28', "9781435249158", 3, 7),
    ("The Silmarillion", "The Silmarillion is a posthumously published collection of J.R.R. Tolkien's works detailing the mythology and history of Middle-earth, from the creation of the universe to the end of the Third Age.", '2004-11-15', "9780618391110", 1, 1);

INSERT INTO reviews (rating, allText, userID, bookID) VALUES
    (8, "Such a cute book with lovable characters! Alaska is literally me!", 2, 3),
    (4, "Too scary for me.", 2, 2),
    (10, "An absolute masterpiece. Highly recommend.", 3, 1);
