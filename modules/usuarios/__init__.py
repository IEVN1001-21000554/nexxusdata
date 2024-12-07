from flask import Blueprint


usuarios_bp = Blueprint('usuarios', __name__, url_prefix='/api/usuarios')
from . import routes