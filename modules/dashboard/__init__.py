from flask import Blueprint

dashboard = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')
from . import routes