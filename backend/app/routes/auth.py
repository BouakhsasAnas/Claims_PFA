from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.models import User, Role, Filiere, Site
from app.utils.db import db
from app.utils.auth import generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation basique
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Données manquantes'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Cet email est déjà utilisé'}), 400
    
    # Récupération du rôle (par défaut Etudiant si non spécifié, ce qui est mieux pour la sécu)
    # Pour la démo, on permet de choisir son rôle ou on le déduit.
    # Ici on va dire que l'inscription est pour les étudiants/personnel par défaut.
    # Les admins/responsables seraient créés par un admin.
    
    role_user = Role.query.filter_by(nom='Etudiant').first()
    if not role_user:
         return jsonify({'message': 'Erreur configuration rôles'}), 500

    hashed_password = generate_password_hash(data['password'])
    
    new_user = User(
        nom=data['nom'],
        email=data['email'],
        password_hash=hashed_password,
        role_id=role_user.id,
        filiere_id=data.get('filiere_id'), # Optionnel
        site_id=data.get('site_id')       # Optionnel
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Utilisateur créé avec succès'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email et mot de passe requis'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Email ou mot de passe incorrect'}), 401
        
    token = generate_token(user.id, user.role_id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'nom': user.nom,
            'email': user.email,
            'role': user.role.nom
        }
    }), 200
