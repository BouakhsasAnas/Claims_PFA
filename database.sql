-- Création de la base de données
CREATE DATABASE IF NOT EXISTS pfa_reclamations;
USE pfa_reclamations;

-- Table des Rôles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- Table des Filières
CREATE TABLE filieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- Table des Sites
CREATE TABLE sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- Table des Utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    filiere_id INT,
    site_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id),
    FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Table des Réclamations
CREATE TABLE reclamations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('EN_ATTENTE', 'EN_COURS', 'TRAITEE', 'REJETEE') DEFAULT 'EN_ATTENTE',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    filiere_id INT, -- Optionnel, si la réclamation concerne une filière
    site_id INT,    -- Optionnel, si la réclamation concerne un site
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id),
    FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Table des Pièces Jointes
CREATE TABLE pieces_jointes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL,
    reclamation_id INT NOT NULL,
    FOREIGN KEY (reclamation_id) REFERENCES reclamations(id) ON DELETE CASCADE
);

-- Table des Réponses (Optionnel, pour le fil de discussion)
CREATE TABLE reponses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    date_reponse DATETIME DEFAULT CURRENT_TIMESTAMP,
    reclamation_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (reclamation_id) REFERENCES reclamations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
);

-- Insertion des données initiales (Seed)

-- Rôles
INSERT INTO roles (nom) VALUES ('Administrateur'), ('Utilisateur'), ('Responsable Filiere'), ('Responsable Site');

-- Filières (Exemples)
INSERT INTO filieres (nom) VALUES ('Informatique'), ('Gestion'), ('Droit');

-- Sites (Exemples)
INSERT INTO sites (nom) VALUES ('Campus Principal'), ('Annexe Centre-Ville');

-- Utilisateurs (Mot de passe 'password123' hashé à titre d'exemple - à gérer via l'app)
-- Note: Dans la pratique, on insérera les utilisateurs via l'application pour avoir le bon hash.
