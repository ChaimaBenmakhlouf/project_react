CREATE DATABASE IF NOT EXISTS health_app;
USE health_app;

CREATE TABLE Utilisateurs (
    id CHAR(36) PRIMARY KEY,
    auth0_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Profiles (
    id CHAR(36) PRIMARY KEY,
    utilisateur_id CHAR(36),
    num_securite_sociale VARCHAR(50),
    taille FLOAT,
    poids FLOAT,
    autres_infos JSON,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
);

CREATE TABLE Questionnaires (
    id CHAR(36) PRIMARY KEY,
    utilisateur_id CHAR(36),
    type_questionnaire VARCHAR(50),
    reponses JSON,
    date_remplissage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
);

CREATE TABLE Historique_Notifications (
    id CHAR(36) PRIMARY KEY,
    utilisateur_id CHAR(36),
    message TEXT,
    statut VARCHAR(20),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id)
);
