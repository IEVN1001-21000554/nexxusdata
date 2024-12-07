from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import Usuario
from datetime import timedelta
from . import auth_bp

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    usuario = Usuario.query.filter_by(email=data['email']).first()
    
    if not usuario or usuario.password != data['password']:
        return jsonify({'message': 'Invalid email or password'}), 401
        
    if not usuario.activo:
        return jsonify({'message': 'This account is inactive'}), 401
    
    access_token = create_access_token(
        identity=str(usuario.id),  # Ensure this is a string
        additional_claims={'rol': usuario.rol},
        expires_delta=timedelta(hours=1)
    )
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'rol': usuario.rol
        }
    }), 200

