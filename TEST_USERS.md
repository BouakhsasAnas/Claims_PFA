# 🔐 Utilisateurs de Test - Système de Gestion des Réclamations

Ce document contient les informations de connexion pour les utilisateurs de test créés pour chaque rôle du système.

## 🚀 Comment utiliser

1. **Exécuter le script de seeding** (si pas encore fait):
   ```bash
   cd backend
   python seed_users.py
   ```

2. **Lancer l'application**:
   - Backend: `cd backend && python app.py` (port 5000)
   - Frontend: `cd frontend && npm run dev` (port 5173)

3. **Se connecter** avec l'un des comptes ci-dessous

---

## 👥 Comptes de Test

> **Mot de passe commun**: `Test123!`

### 1️⃣ Administrateur
- **Email**: `admin@test.com`
- **Rôle**: Administrateur
- **Accès**: Dashboard Admin - `http://localhost:5173/admin`
- **Permissions**: 
  - Voir toutes les réclamations
  - Assigner les réclamations aux responsables
  - Gérer les utilisateurs
  - Accès complet au système

### 2️⃣ Utilisateur (Étudiant/Personnel)
- **Email**: `user@test.com`
- **Rôle**: Utilisateur
- **Filière**: IIR
- **Site**: Roudani
- **Accès**: Dashboard Utilisateur - `http://localhost:5173/user`
- **Permissions**:
  - Créer des réclamations
  - Voir ses propres réclamations
  - Suivre le statut de ses réclamations

### 3️⃣ Responsable Filière
- **Email**: `resp.filiere@test.com`
- **Rôle**: Responsable Filiere
- **Filière**: IIR (ID: 1)
- **Accès**: Dashboard Responsable Filière - `http://localhost:5173/responsable-filiere`
- **Permissions**:
  - Voir les réclamations NOTE de sa filière
  - Traiter les réclamations assignées
  - Changer le statut des réclamations
  - Ajouter des réponses

### 4️⃣ Responsable Site
- **Email**: `resp.site@test.com`
- **Rôle**: Responsable Site
- **Site**: Maarif (ID: 1)
- **Accès**: Dashboard Responsable Site - `http://localhost:5173/responsable-site`
- **Permissions**:
  - Voir les réclamations ABSENCE de son site
  - Traiter les réclamations assignées
  - Changer le statut des réclamations
  - Ajouter des réponses

---

## 🧪 Scénarios de Test

### Scénario 1: Flux complet de réclamation
1. **Utilisateur** (`user@test.com`) crée une réclamation
2. **Admin** (`admin@test.com`) assigne la réclamation à un responsable
3. **Responsable** (`resp.filiere@test.com` ou `resp.site@test.com`) traite la réclamation
4. **Utilisateur** vérifie le changement de statut

### Scénario 2: Test des permissions
1. Connectez-vous avec chaque compte
2. Vérifiez que chaque rôle voit uniquement son dashboard
3. Testez les redirections automatiques selon le rôle

### Scénario 3: Gestion multi-utilisateurs
1. Créez plusieurs réclamations avec `user@test.com`
2. Assignez-les à différents responsables avec `admin@test.com`
3. Traitez-les depuis les comptes responsables respectifs

---

## 📊 Données de Base

Le script `database.sql` crée également:

**Filières disponibles**:
- IIR (ID: 1)
- IFA (ID: 2)
- GC (ID: 3)

**Sites disponibles**:
- Maarif (ID: 1)
- Roudani (ID: 2)

**Statuts de réclamation**:
- `EN_ATTENTE`: Nouvelle réclamation
- `EN_COURS`: Réclamation assignée et en traitement
- `TRAITEE`: Réclamation résolue
- `REJETEE`: Réclamation rejetée

---

## 🔧 Dépannage

### Les utilisateurs n'existent pas
Exécutez le script de seeding:
```bash
cd backend
python seed_users.py
```

### Erreur de connexion
Vérifiez que:
- La base de données est créée (`database.sql` exécuté)
- Le backend est lancé sur le port 5000
- Les credentials sont corrects (email + `Test123!`)

### Redirection incorrecte après login
Vérifiez que le frontend gère correctement les rôles dans le composant de login.

---

## 🔐 Sécurité

> ⚠️ **IMPORTANT**: Ces comptes sont pour le développement/test uniquement!
> 
> En production:
> - Utilisez des mots de passe forts et uniques
> - Supprimez ces comptes de test
> - Implémentez une politique de mots de passe robuste
> - Activez l'authentification à deux facteurs si nécessaire
