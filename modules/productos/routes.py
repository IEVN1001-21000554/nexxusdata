from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Producto, Usuario
from sqlalchemy.exc import IntegrityError
from decimal import Decimal
from . import productos_bp

@productos_bp.route('', methods=['GET'])
@jwt_required()
def get_productos():
    productos = Producto.query.all()
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'descripcion': p.descripcion,
        'precio': float(p.precio),
        'stock': p.stock
    } for p in productos]), 200

@productos_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_producto(id):
    producto = Producto.query.get_or_404(id)
    return jsonify({
        'id': producto.id,
        'nombre': producto.nombre,
        'descripcion': producto.descripcion,
        'precio': float(producto.precio),
        'stock': producto.stock
    }), 200

@productos_bp.route('', methods=['POST'])
@jwt_required()
def create_producto():
    data = request.get_json()
    
    if not all(k in data for k in ('nombre', 'precio', 'stock')):
        return jsonify({'mensaje': 'Campos requeridos faltantes'}), 400
    
    try:
        nuevo_producto = Producto(
            nombre=data['nombre'],
            descripcion=data.get('descripcion', ''),
            precio=Decimal(str(data['precio'])),
            stock=data['stock']
        )
        
        db.session.add(nuevo_producto)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Producto creado exitosamente',
            'producto': {
                'id': nuevo_producto.id,
                'nombre': nuevo_producto.nombre,
                'descripcion': nuevo_producto.descripcion,
                'precio': float(nuevo_producto.precio),
                'stock': nuevo_producto.stock
            }
        }), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'Ya existe un producto con este nombre'}), 400
    except ValueError:
        return jsonify({'mensaje': 'Formato de precio inv lido'}), 400

@productos_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_producto(id):
    producto = Producto.query.get_or_404(id)
    data = request.get_json()
    
    if 'nombre' in data:
        producto.nombre = data['nombre']
    if 'descripcion' in data:
        producto.descripcion = data['descripcion']
    if 'precio' in data:
        try:
            producto.precio = Decimal(str(data['precio']))
        except ValueError:
            return jsonify({'mensaje': 'Formato de precio inv lido'}), 400
    if 'stock' in data:
        producto.stock = data['stock']
    
    try:
        db.session.commit()
        return jsonify({
            'mensaje': 'Producto actualizado exitosamente',
            'producto': {
                'id': producto.id,
                'nombre': producto.nombre,
                'descripcion': producto.descripcion,
                'precio': float(producto.precio),
                'stock': producto.stock
            }
        }), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'Ya existe un producto con este nombre'}), 400

@productos_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_producto(id):
    producto = Producto.query.get_or_404(id)
    
    try:
        db.session.delete(producto)
        db.session.commit()
        return jsonify({'mensaje': 'Producto eliminado exitosamente'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'No se puede eliminar el producto. Est  referenciado en ventas.'}), 400

@productos_bp.route('/search', methods=['GET'])
@jwt_required()
def search_productos():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'mensaje': 'La consulta de b squeda es requerida'}), 400
    
    productos = Producto.query.filter(
        (Producto.nombre.ilike(f'%{query}%')) |
        (Producto.descripcion.ilike(f'%{query}%'))
    ).all()
    
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'descripcion': p.descripcion,
        'precio': float(p.precio),
        'stock': p.stock
    } for p in productos]), 200

@productos_bp.route('/low-stock', methods=['GET'])
@jwt_required()
def get_low_stock_productos():
    threshold = request.args.get('threshold', 10, type=int)
    productos = Producto.query.filter(Producto.stock < threshold).all()
    
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'descripcion': p.descripcion,
        'precio': float(p.precio),
        'stock': p.stock
    } for p in productos]), 200
