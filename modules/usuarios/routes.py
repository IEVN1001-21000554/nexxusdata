from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Usuario
from . import usuarios_bp

@usuarios_bp.route('', methods=['GET'])
@jwt_required()
def get_usuarios():
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    if current_user.rol != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    usuarios = Usuario.query.all()
    return jsonify([{
        'id': u.id,
        'nombre': u.nombre,
        'email': u.email,
        'rol': u.rol,
        'activo': u.activo
    } for u in usuarios]), 200

@usuarios_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_usuario(id):
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    if current_user.rol != 'admin' and current_user.id != id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    usuario = Usuario.query.get_or_404(id)
    return jsonify({
        'id': usuario.id,
        'nombre': usuario.nombre,
        'email': usuario.email,
        'rol': usuario.rol,
        'activo': usuario.activo
    }), 200

@usuarios_bp.route('', methods=['POST'])
@jwt_required()
def create_usuario():
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    if current_user.rol != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if not all(k in data for k in ['nombre', 'email', 'password', 'rol']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    nuevo_usuario = Usuario(
        nombre=data['nombre'],
        email=data['email'],
        password=data['password'],
        rol=data['rol']
    )
    
    db.session.add(nuevo_usuario)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully',
        'user': {
            'id': nuevo_usuario.id,
            'nombre': nuevo_usuario.nombre,
            'email': nuevo_usuario.email,
            'rol': nuevo_usuario.rol,
            'activo': nuevo_usuario.activo
        }
    }), 201

@usuarios_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_usuario(id):
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    if current_user.rol != 'admin' and current_user.id != id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    usuario = Usuario.query.get_or_404(id)
    data = request.get_json()
    
    if 'nombre' in data:
        usuario.nombre = data['nombre']
    if 'email' in data and data['email'] != usuario.email:
        if Usuario.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already in use'}), 400
        usuario.email = data['email']
    if 'password' in data:
        usuario.password = data['password']
    if 'rol' in data and current_user.rol == 'admin':
        usuario.rol = data['rol']
    if 'activo' in data and current_user.rol == 'admin':
        usuario.activo = data['activo']
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'rol': usuario.rol,
            'activo': usuario.activo
        }
    }), 200

@usuarios_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(id):
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    if current_user.rol != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403
    
    usuario = Usuario.query.get_or_404(id)
    
    if usuario.id == current_user.id:
        return jsonify({'message': 'Cannot delete your own account'}), 400
    
    db.session.delete(usuario)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200