from flask import Blueprint, request, jsonify
from app.models.models import User, Role, Filiere, Site
from app.utils.db import db
from app.utils.auth import token_required, role_required
from werkzeug.security import generate_password_hash

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
@token_required
@role_required(['Administrateur'])
def get_users(current_user):
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@user_bp.route('/', methods=['POST'])
@token_required
@role_required(['Administrateur'])
def create_user(current_user):
    data = request.get_json()
    # ... validation ...
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
    return jsonify({'message': 'Utilisateur créé'}), 201

@user_bp.route('/<int:id>', methods=['DELETE'])
@token_required
@role_required(['Administrateur'])
def delete_user(current_user, id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Utilisateur supprimé'}), 200
