from app.utils.db import db
from datetime import datetime

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {'id': self.id, 'nom': self.nom}

class Filiere(db.Model):
    __tablename__ = 'filieres'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {'id': self.id, 'nom': self.nom}

class Site(db.Model):
    __tablename__ = 'sites'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {'id': self.id, 'nom': self.nom}

class User(db.Model):
    __tablename__ = 'utilisateurs'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    filiere_id = db.Column(db.Integer, db.ForeignKey('filieres.id'), nullable=True)
    site_id = db.Column(db.Integer, db.ForeignKey('sites.id'), nullable=True)

    role = db.relationship('Role', backref='users')
    filiere = db.relationship('Filiere', backref='users')
    site = db.relationship('Site', backref='users')

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'email': self.email,
            'role': self.role.nom if self.role else None,
            'filiere': self.filiere.nom if self.filiere else None,
            'site': self.site.nom if self.site else None
        }

class Reclamation(db.Model):
    __tablename__ = 'reclamations'
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    type_reclamation = db.Column(db.Enum('NOTE', 'ABSENCE'), nullable=False)  # NOTE -> Filiere, ABSENCE -> Site
    status = db.Column(db.Enum('EN_ATTENTE', 'EN_COURS', 'TRAITEE', 'REJETEE'), default='EN_ATTENTE')
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), nullable=False)
    filiere_id = db.Column(db.Integer, db.ForeignKey('filieres.id'), nullable=True)
    site_id = db.Column(db.Integer, db.ForeignKey('sites.id'), nullable=True)

    user = db.relationship('User', backref='reclamations')
    filiere = db.relationship('Filiere', backref='reclamations')
    site = db.relationship('Site', backref='reclamations')
    pieces_jointes = db.relationship('PieceJointe', backref='reclamation', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'titre': self.titre,
            'description': self.description,
            'type_reclamation': self.type_reclamation,
            'status': self.status,
            'date_creation': self.date_creation.isoformat(),
            'user': self.user.nom,
            'user_id': self.user_id,
            'filiere': self.filiere.nom if self.filiere else None,
            'filiere_id': self.filiere_id,
            'site': self.site.nom if self.site else None,
            'site_id': self.site_id,
            'pieces_jointes': [pj.to_dict() for pj in self.pieces_jointes]
        }

class PieceJointe(db.Model):
    __tablename__ = 'pieces_jointes'
    id = db.Column(db.Integer, primary_key=True)
    nom_fichier = db.Column(db.String(255), nullable=False)
    chemin_fichier = db.Column(db.String(255), nullable=False)
    reclamation_id = db.Column(db.Integer, db.ForeignKey('reclamations.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nom_fichier': self.nom_fichier,
            'url': self.chemin_fichier # En production, ce serait une URL complète
        }
