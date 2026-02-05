"""
Script pour créer des utilisateurs de test pour chaque rôle.
Exécutez ce script après avoir créé la base de données avec database.sql
"""
from werkzeug.security import generate_password_hash
from app import create_app
from app.utils.db import db
from app.models.models import User, Role, Filiere, Site

def seed_test_users():
    app = create_app()
    
    with app.app_context():
        print("🌱 Début du seeding des utilisateurs de test...")
        
        # Vérifier que les rôles, filières et sites existent
        roles = Role.query.all()
        filieres = Filiere.query.all()
        sites = Site.query.all()
        
        if not roles or not filieres or not sites:
            print("❌ Erreur: Assurez-vous d'avoir exécuté database.sql d'abord!")
            return
        
        # Récupérer les rôles
        role_admin = Role.query.filter_by(nom='Administrateur').first()
        role_user = Role.query.filter_by(nom='Etudiant').first()
        role_resp_filiere = Role.query.filter_by(nom='Responsable Filiere').first()
        role_resp_site = Role.query.filter_by(nom='Responsable Site').first()
        
        # Récupérer une filière et un site pour les tests
        filiere_info = Filiere.query.filter_by(nom='Informatique').first()
        site_principal = Site.query.filter_by(nom='Campus Principal').first()
        
        # Mot de passe commun pour tous les utilisateurs de test
        password = "Test123!"
        hashed_password = generate_password_hash(password)
        
        # Liste des utilisateurs de test à créer
        test_users = [
            {
                'nom': 'Admin Test',
                'email': 'admin@test.com',
                'password_hash': hashed_password,
                'role_id': role_admin.id,
                'filiere_id': None,
                'site_id': None
            },
            {
                'nom': 'Etudiant Test',
                'email': 'user@test.com',
                'password_hash': hashed_password,
                'role_id': role_user.id,
                'filiere_id': filiere_info.id,
                'site_id': site_principal.id
            },
            {
                'nom': 'Responsable Filiere Test',
                'email': 'resp.filiere@test.com',
                'password_hash': hashed_password,
                'role_id': role_resp_filiere.id,
                'filiere_id': filiere_info.id,
                'site_id': None
            },
            {
                'nom': 'Responsable Site Test',
                'email': 'resp.site@test.com',
                'password_hash': hashed_password,
                'role_id': role_resp_site.id,
                'filiere_id': None,
                'site_id': site_principal.id
            }
        ]
        
        # Créer les utilisateurs
        created_count = 0
        for user_data in test_users:
            # Vérifier si l'utilisateur existe déjà
            existing_user = User.query.filter_by(email=user_data['email']).first()
            if existing_user:
                print(f"⚠️  L'utilisateur {user_data['email']} existe déjà, ignoré.")
                continue
            
            new_user = User(**user_data)
            db.session.add(new_user)
            created_count += 1
            print(f"✅ Utilisateur créé: {user_data['nom']} ({user_data['email']})")
        
        # Sauvegarder les changements
        db.session.commit()
        
        print(f"\n🎉 Seeding terminé! {created_count} utilisateur(s) créé(s).")
        print(f"\n📝 Mot de passe pour tous les utilisateurs de test: {password}")
        print("\n👥 Utilisateurs créés:")
        print("   - admin@test.com (Administrateur)")
        print("   - user@test.com (Etudiant)")
        print("   - resp.filiere@test.com (Responsable Filiere)")
        print("   - resp.site@test.com (Responsable Site)")

if __name__ == '__main__':
    seed_test_users()
