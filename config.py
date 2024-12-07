
import os
from sqlalchemy import create_engine
import urllib

class Config(object):
    SECRET_KEY = 'llavesecreta123'
    SESION_COOKIE_SECURE = False

class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_ENV = 'development'
    # postgresql://  usuario  :  contrasenia  @localhost/  nombre_de_la_base
    SQLALCHEMY_DATABASE_URI = 'postgresql://openpg:openpgpwd@localhost/nexxuscrm'
    SQLALCHEMY_TRACK_MODIFICATIONS = False