from flask import Blueprint


ventas_bp = Blueprint('ventas', __name__, url_prefix='/api/ventas')
from . import routes