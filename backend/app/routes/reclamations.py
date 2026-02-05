from flask import Blueprint, request, jsonify
from app.models.models import Reclamation, PieceJointe, User, Role
from app.utils.db import db
from app.utils.auth import token_required, role_required
from datetime import datetime

reclamation_bp = Blueprint('reclamations', __name__)

# Créer une réclamation
@reclamation_bp.route('/create', methods=['POST'])
@token_required
def create_reclamation(current_user):
    data = request.get_json()
    
    if not data.get('titre') or not data.get('description') or not data.get('type_reclamation'):
        return jsonify({'message': 'Titre, description et type requis'}), 400
    
    type_reclamation = data['type_reclamation']
    if type_reclamation not in ['NOTE', 'ABSENCE']:
        return jsonify({'message': 'Type invalide. Utilisez NOTE ou ABSENCE'}), 400
    
    # Assignation automatique selon le type
    filiere_id = None
    site_id = None
    
    if type_reclamation == 'NOTE':
        # NOTE -> Assigné à la filière de l'utilisateur
        filiere_id = current_user.filiere_id
    elif type_reclamation == 'ABSENCE':
        # ABSENCE -> Assigné au site de l'utilisateur
        site_id = current_user.site_id
        
    new_reclamation = Reclamation(
        titre=data['titre'],
        description=data['description'],
        type_reclamation=type_reclamation,
        user_id=current_user.id,
        filiere_id=filiere_id,
        site_id=site_id
    )
    
    db.session.add(new_reclamation)
    db.session.flush() # Pour avoir l'ID
    
    # Gestion des pièces jointes (URLs simulées pour l'instant)
    if data.get('pieces_jointes'):
        for pj_url in data['pieces_jointes']:
            pj = PieceJointe(
                nom_fichier=pj_url.split('/')[-1], # Simulation nom
                chemin_fichier=pj_url,
                reclamation_id=new_reclamation.id
            )
            db.session.add(pj)
            
    db.session.commit()
    
    return jsonify({'message': 'Réclamation créée', 'id': new_reclamation.id}), 201

# Mes réclamations
@reclamation_bp.route('/my', methods=['GET'])
@token_required
def my_reclamations(current_user):
    reclamations = Reclamation.query.filter_by(user_id=current_user.id).all()
    return jsonify([r.to_dict() for r in reclamations]), 200

# Toutes les réclamations (Admin)
@reclamation_bp.route('/all', methods=['GET'])
@token_required
@role_required(['Administrateur'])
def all_reclamations(current_user):
    reclamations = Reclamation.query.all()
    return jsonify([r.to_dict() for r in reclamations]), 200

# Réclamations assignées (Responsables)
@reclamation_bp.route('/assigned', methods=['GET'])
@token_required
def assigned_reclamations(current_user):
    if current_user.role.nom == 'Responsable Filiere':
        # Filtre uniquement par type NOTE (toutes les filières)
        reclamations = Reclamation.query.filter_by(
            type_reclamation='NOTE'
        ).all()
    elif current_user.role.nom == 'Responsable Site':
        # Filtre uniquement par type ABSENCE (tous les sites)
        reclamations = Reclamation.query.filter_by(
            type_reclamation='ABSENCE'
        ).all()
    else:
        return jsonify({'message': 'Rôle non autorisé pour cette route'}), 403
        
    return jsonify([r.to_dict() for r in reclamations]), 200

# Assigner une réclamation (Admin) - En fait, c'est souvent automatique ou manuel
# Ici on permet à l'admin de changer filiere/site pour réassigner
@reclamation_bp.route('/<int:id>/assign', methods=['PUT'])
@token_required
@role_required(['Administrateur'])
def assign_reclamation(current_user, id):
    reclamation = Reclamation.query.get_or_404(id)
    data = request.get_json()
    
    if 'filiere_id' in data:
        reclamation.filiere_id = data['filiere_id']
    if 'site_id' in data:
        reclamation.site_id = data['site_id']
        
    db.session.commit()
    return jsonify({'message': 'Réclamation réassignée'}), 200

# Changer le statut
@reclamation_bp.route('/<int:id>/status', methods=['PUT'])
@token_required
def update_status(current_user, id):
    reclamation = Reclamation.query.get_or_404(id)
    data = request.get_json()
    new_status = data.get('status')
    
    allowed_roles = ['Administrateur', 'Responsable Filiere', 'Responsable Site']
    if current_user.role.nom not in allowed_roles:
         return jsonify({'message': 'Non autorisé'}), 403
         
    # Vérification supplémentaire pour les responsables : est-ce bien leur périmètre ?
    if current_user.role.nom == 'Responsable Filiere' and reclamation.filiere_id != current_user.filiere_id:
        return jsonify({'message': 'Non autorisé (mauvaise filière)'}), 403
    if current_user.role.nom == 'Responsable Site' and reclamation.site_id != current_user.site_id:
        return jsonify({'message': 'Non autorisé (mauvais site)'}), 403

    if new_status in ['EN_ATTENTE', 'EN_COURS', 'TRAITEE', 'REJETEE']:
        reclamation.status = new_status
        db.session.commit()
        return jsonify({'message': 'Statut mis à jour'}), 200
    else:
        return jsonify({'message': 'Statut invalide'}), 400
