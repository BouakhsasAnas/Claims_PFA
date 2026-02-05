from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app.models.models import User, Role, Filiere, Site, Reclamation
from app.utils.db import db
from app.utils.auth import token_required, role_required

admin_bp = Blueprint('admin', __name__)

# Liste de tous les utilisateurs
@admin_bp.route('/users', methods=['GET'])
@token_required
@role_required(['Administrateur'])
def get_all_users(current_user):
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# Détails d'un utilisateur
@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@token_required
@role_required(['Administrateur'])
def get_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

# Mettre à jour un utilisateur
@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@token_required
@role_required(['Administrateur'])
def update_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Mise à jour des champs autorisés
    if 'nom' in data:
        user.nom = data['nom']
    if 'email' in data:
        # Vérifier que l'email n'est pas déjà utilisé
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.id != user_id:
            return jsonify({'message': 'Cet email est déjà utilisé'}), 400
        user.email = data['email']
    if 'role_id' in data:
        user.role_id = data['role_id']
    if 'filiere_id' in data:
        user.filiere_id = data['filiere_id']
    if 'site_id' in data:
        user.site_id = data['site_id']
    if 'password' in data and data['password']:
        user.password_hash = generate_password_hash(data['password'])
    
    db.session.commit()
    return jsonify({'message': 'Utilisateur mis à jour', 'user': user.to_dict()}), 200

# Supprimer un utilisateur
@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@token_required
@role_required(['Administrateur'])
def delete_user(current_user, user_id):
    if user_id == current_user.id:
        return jsonify({'message': 'Vous ne pouvez pas supprimer votre propre compte'}), 400
    
    user = User.query.get_or_404(user_id)
    
    # Supprimer toutes les réclamations de l'utilisateur
    Reclamation.query.filter_by(user_id=user_id).delete()
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'Utilisateur supprimé'}), 200

# Créer un utilisateur (par l'admin)
@admin_bp.route('/users', methods=['POST'])
@token_required
@role_required(['Administrateur'])
def create_user(current_user):
    data = request.get_json()
    
    if not data.get('nom') or not data.get('email') or not data.get('password') or not data.get('role_id'):
        return jsonify({'message': 'Nom, email, mot de passe et rôle requis'}), 400
    
    # Vérifier si l'email existe déjà
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Cet email est déjà utilisé'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    
    new_user = User(
        nom=data['nom'],
        email=data['email'],
        password_hash=hashed_password,
        role_id=data['role_id'],
        filiere_id=data.get('filiere_id'),
        site_id=data.get('site_id')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Utilisateur créé', 'user': new_user.to_dict()}), 201

# Récupérer les rôles disponibles
@admin_bp.route('/roles', methods=['GET'])
@token_required
@role_required(['Administrateur'])
def get_roles(current_user):
    roles = Role.query.all()
    return jsonify([role.to_dict() for role in roles]), 200

# Récupérer les filières disponibles
@admin_bp.route('/filieres', methods=['GET'])
@token_required
@role_required(['Administrateur'])
def get_filieres(current_user):
    filieres = Filiere.query.all()
    return jsonify([filiere.to_dict() for filiere in filieres]), 200

# Récupérer les sites disponibles
@admin_bp.route('/sites', methods=['GET'])
@token_required
@role_required(['Administrateur'])
def get_sites(current_user):
    sites = Site.query.all()
    return jsonify([site.to_dict() for site in sites]), 200

# Statistiques pour le dashboard
@admin_bp.route('/stats', methods=['GET'])
@token_required
@role_required(['Administrateur', 'Etudiant', 'Responsable Filiere', 'Responsable Site'])
def get_stats(current_user):
    from sqlalchemy import func
    
    # Compter les réclamations par statut
    stats = db.session.query(
        Reclamation.status,
        func.count(Reclamation.id).label('count')
    ).group_by(Reclamation.status).all()
    
    # Convertir en dictionnaire
    stats_dict = {stat[0]: stat[1] for stat in stats}
    
    # S'assurer que tous les statuts sont présents
    all_statuses = ['EN_ATTENTE', 'EN_COURS', 'TRAITEE', 'REJETEE']
    result = {status: stats_dict.get(status, 0) for status in all_statuses}
    
    # Ajouter le total
    result['TOTAL'] = sum(result.values())
    
    return jsonify(result), 200
