from flask import Flask
from flask_cors import CORS
from config import Config
from app.utils.db import db
from app.models import models

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    
    with app.app_context():
        db.create_all()

    CORS(app)

    # Register Blueprints (Routes)
    from app.routes.auth import auth_bp
    from app.routes.reclamations import reclamation_bp
    from app.routes.users import user_bp
    from app.routes.admin import admin_bp
    from app.routes.upload import upload_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(reclamation_bp, url_prefix='/api/reclamations')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    
    # Serve uploaded files
    from flask import send_from_directory
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory('uploads', filename)

    @app.route('/')
    def index():
        return {"message": "Welcome to the School Claims Management System API"}

    return app
