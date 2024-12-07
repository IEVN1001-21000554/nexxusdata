from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db, Usuario, Cliente, Venta, Producto, DetalleVenta, Agenda
from modules import (agenda, auth, clientes, productos, usuarios, ventas)

app = Flask(__name__)

# Load configuration
app.config.from_object('config.DevelopmentConfig')
app.config['JWT_SECRET_KEY'] = 'llavesecreta123'

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Configure CORS
CORS(app, resources={r"/*": {
    "origins": "http://localhost:4200",
    "supports_credentials": True,
    "allow_headers": ["Content-Type", "Authorization"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}})

# Register blueprints
app.register_blueprint(auth.auth_bp)
app.register_blueprint(usuarios.usuarios_bp)
app.register_blueprint(clientes.clientes_bp)
app.register_blueprint(ventas.ventas_bp)
app.register_blueprint(productos.productos_bp)
app.register_blueprint(agenda.agenda_bp)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.errorhandler(404)
def pagina_no_encontrada(error):
    return jsonify({"error": "Página no encontrada", "message": str(error)}), 404

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "API de Flask funcionando correctamente"}), 200

def create_tables():
    with app.app_context():
        db.create_all()

if __name__ == "__main__":
    create_tables()
    app.run(host="0.0.0.0", port=5000, debug=True)