import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app
from app.models.models import User

def generate_token(user_id, role_id):
    payload = {
        'user_id': user_id,
        'role_id': role_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Bearer <token>

        if not token:
            return jsonify({'message': 'Token manquant!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token invalide!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

def role_required(roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            if current_user.role.nom not in roles:
                return jsonify({'message': 'Accès interdit: rôle insuffisant'}), 403
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator
