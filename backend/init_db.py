"""
Script pour initialiser la base de données et créer les données de base.
Exécutez ce script avant seed_users.py
"""
from app import create_app
from app.utils.db import db
from app.models.models import Role, Filiere, Site

def init_database():
    app = create_app()
    
    with app.app_context():
        print("🗄️  Initialisation de la base de données...")
        
        # Créer toutes les tables
        db.create_all()
        print("✅ Tables créées")
        
        # Vérifier si les données de base existent déjà
        if Role.query.first():
            print("⚠️  Les données de base existent déjà!")
            return
        
        # Insérer les rôles
        roles = [
            Role(nom='Administrateur'),
            Role(nom='Utilisateur'),
            Role(nom='Responsable Filiere'),
            Role(nom='Responsable Site')
        ]
        for role in roles:
            db.session.add(role)
        print("✅ Rôles créés")
        
        # Insérer les filières
        filieres = [
            Filiere(nom='Informatique'),
            Filiere(nom='Gestion'),
            Filiere(nom='Droit')
        ]
        for filiere in filieres:
            db.session.add(filiere)
        print("✅ Filières créées")
        
        # Insérer les sites
        sites = [
            Site(nom='Campus Principal'),
            Site(nom='Annexe Centre-Ville')
        ]
        for site in sites:
            db.session.add(site)
        print("✅ Sites créés")
        
        # Sauvegarder
        db.session.commit()
        
        print("\n🎉 Base de données initialisée avec succès!")
        print("\n📝 Prochaine étape: Exécutez 'python seed_users.py' pour créer les utilisateurs de test")

if __name__ == '__main__':
    init_database()
