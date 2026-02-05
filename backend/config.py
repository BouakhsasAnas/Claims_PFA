import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'votre_cle_secrete_tres_securisee'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///pfa_reclamations.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
