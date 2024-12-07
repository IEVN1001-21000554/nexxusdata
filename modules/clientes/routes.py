from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Cliente, Usuario
from sqlalchemy.exc import IntegrityError
from . import clientes_bp

@clientes_bp.route('', methods=['GET'])
@jwt_required()
def get_clientes():
    clientes = Cliente.query.all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'email': c.email,
        'telefono': c.telefono,
        'direccion': c.direccion
    } for c in clientes]), 200

@clientes_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    return jsonify({
        'id': cliente.id,
        'nombre': cliente.nombre,
        'email': cliente.email,
        'telefono': cliente.telefono,
        'direccion': cliente.direccion
    }), 200

@clientes_bp.route('', methods=['POST'])
@jwt_required()
def create_cliente():
    data = request.get_json()
    
    if not data.get('nombre'):
        return jsonify({'mensaje': 'El nombre es requerido'}), 400
    
    nuevo_cliente = Cliente(
        nombre=data['nombre'],
        email=data.get('email'),
        telefono=data.get('telefono'),
        direccion=data.get('direccion')
    )
    
    try:
        db.session.add(nuevo_cliente)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'Ya existe un cliente con este correo electr nico'}), 400
    
    return jsonify({
        'mensaje': 'Cliente creado exitosamente',
        'cliente': {
            'id': nuevo_cliente.id,
            'nombre': nuevo_cliente.nombre,
            'email': nuevo_cliente.email,
            'telefono': nuevo_cliente.telefono,
            'direccion': nuevo_cliente.direccion
        }
    }), 201

@clientes_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    data = request.get_json()
    
    if 'nombre' in data:
        cliente.nombre = data['nombre']
    if 'email' in data:
        cliente.email = data['email']
    if 'telefono' in data:
        cliente.telefono = data['telefono']
    if 'direccion' in data:
        cliente.direccion = data['direccion']
    
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'Ya existe un cliente con este correo electr nico'}), 400
    
    return jsonify({
        'mensaje': 'Cliente actualizado exitosamente',
        'cliente': {
            'id': cliente.id,
            'nombre': cliente.nombre,
            'email': cliente.email,
            'telefono': cliente.telefono,
            'direccion': cliente.direccion
        }
    }), 200

@clientes_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    
    db.session.delete(cliente)
    db.session.commit()
    
    return jsonify({'mensaje': 'Cliente eliminado exitosamente'}), 200

@clientes_bp.route('/buscar', methods=['GET'])
@jwt_required()
def buscar_clientes():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'mensaje': 'La b squeda es requerida'}), 400
    
    clientes = Cliente.query.filter(
        (Cliente.nombre.ilike(f'%{query}%')) |
        (Cliente.email.ilike(f'%{query}%')) |
        (Cliente.telefono.ilike(f'%{query}%'))
    ).all()
    
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'email': c.email,
        'telefono': c.telefono,
        'direccion': c.direccion
    } for c in clientes]), 200
