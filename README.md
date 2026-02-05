# Système de Gestion des Réclamations (PFA)

## Description
Application web complète pour la gestion des réclamations d'une école.
Permet aux étudiants de soumettre des réclamations et aux administrateurs/responsables de les traiter.

## Technologies
- **Backend**: Python, Flask, SQLAlchemy, MySQL, JWT
- **Frontend**: React, Vite, Tailwind CSS, Axios

## Prérequis
- Python 3.8+
- Node.js 16+
- MySQL Server

## Installation

### 1. Base de Données
1. Ouvrez votre client MySQL (Workbench, phpMyAdmin, etc.).
2. Exécutez le script `database.sql` situé à la racine du projet.
   Cela créera la base de données `pfa_reclamations` et les tables nécessaires.

### 2. Backend
1. Ouvrez un terminal dans le dossier `backend`.
2. Créez un environnement virtuel (optionnel mais recommandé) :
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```
3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
4. Configurez la base de données dans `config.py` si nécessaire (par défaut : `root:password@localhost`).
5. Lancez le serveur :
   ```bash
   python app.py
   ```
   Le serveur démarrera sur `http://localhost:5000`.

### 3. Frontend
1. Ouvrez un nouveau terminal dans le dossier `frontend`.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

## Utilisation
1. **Inscription/Connexion** : Créez un compte ou connectez-vous.
   - Pour tester les rôles Admin/Responsable, vous devez modifier le rôle de l'utilisateur directement en base de données (table `utilisateurs`, colonne `role_id`) ou utiliser un compte admin pré-créé si vous en avez inséré un.
   - IDs des rôles (selon le script SQL) :
     - 1 : Administrateur
     - 2 : Utilisateur
     - 3 : Responsable Filiere
     - 4 : Responsable Site

2. **Utilisateur** : Créez une réclamation depuis `/user`.
3. **Admin** : Assignez la réclamation depuis `/admin`.
4. **Responsable** : Traitez la réclamation depuis `/responsable-filiere` ou `/responsable-site`.

## Auteur
Généré par Antigravity
