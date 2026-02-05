from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.utils.auth import token_required
import os
from datetime import datetime

upload_bp = Blueprint('upload', __name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    if 'file' not in request.files:
        return jsonify({'message': 'Aucun fichier fourni'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'Nom de fichier vide'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'message': 'Type de fichier non autorisé. Utilisez PDF ou images'}), 400
    
    # Vérifier la taille du fichier
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({'message': 'Fichier trop volumineux. Maximum 5MB'}), 400
    
    # Créer un nom de fichier unique
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = secure_filename(file.filename)
    unique_filename = f"{timestamp}_{current_user.id}_{filename}"
    
    # Sauvegarder le fichier
    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(filepath)
    
    return jsonify({
        'message': 'Fichier uploadé avec succès',
        'filename': unique_filename,
        'original_filename': filename,
        'url': f'/uploads/{unique_filename}'
    }), 201
