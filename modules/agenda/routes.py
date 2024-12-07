from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Agenda, Usuario, Cliente
from datetime import datetime
from . import agenda_bp
from dateutil.relativedelta import relativedelta

@agenda_bp.route('', methods=['GET'])
@jwt_required()
def get_eventos():
    current_user_id = get_jwt_identity()
    eventos = Agenda.query.filter_by(usuario_id=current_user_id).all()
    return jsonify([{
        'id': e.id,
        'titulo': e.titulo,
        'descripcion': e.descripcion,
        'fecha_inicio': e.fecha_inicio.isoformat(),
        'fecha_fin': e.fecha_fin.isoformat(),
        'estado': e.estado,
        'tipo': e.tipo,
        'cliente': {
            'id': e.cliente.id,
            'nombre': e.cliente.nombre
        } if e.cliente else None
    } for e in eventos]), 200

@agenda_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_evento(id):
    current_user_id = get_jwt_identity()
    evento = Agenda.query.filter_by(id=id, usuario_id=current_user_id).first()
    if not evento:
        return jsonify({'mensaje': 'Evento no encontrado'}), 404
    
    return jsonify({
        'id': evento.id,
        'titulo': evento.titulo,
        'descripcion': evento.descripcion,
        'fecha_inicio': evento.fecha_inicio.isoformat(),
        'fecha_fin': evento.fecha_fin.isoformat(),
        'estado': evento.estado,
        'tipo': evento.tipo,
        'cliente': {
            'id': evento.cliente.id,
            'nombre': evento.cliente.nombre
        } if evento.cliente else None
    }), 200

@agenda_bp.route('/filtro', methods=['GET'])
@jwt_required()
def get_eventos_filtrados():
    current_user_id = get_jwt_identity()
    anio = request.args.get('anio', None)
    mes = request.args.get('mes', None)
    
    if not anio or not mes:
        return jsonify({'mensaje': 'Parámetros anio y mes son requeridos'}), 400
    
    try:
        anio = int(anio)
        mes = int(mes)
        if mes < 1 or mes > 12:
            return jsonify({'mensaje': 'El mes debe estar entre 1 y 12'}), 400
        
        fecha_inicio = datetime(anio, mes, 1)
        fecha_fin = fecha_inicio + relativedelta(months=1)
        
        eventos = Agenda.query.filter_by(usuario_id=current_user_id).filter(
            Agenda.fecha_inicio >= fecha_inicio,
            Agenda.fecha_inicio < fecha_fin
        ).all()
        
        return jsonify([{
            'id': e.id,
            'titulo': e.titulo,
            'descripcion': e.descripcion,
            'fecha_inicio': e.fecha_inicio.isoformat(),
            'fecha_fin': e.fecha_fin.isoformat(),
            'estado': e.estado,
            'tipo': e.tipo,
            'cliente': {
                'id': e.cliente.id,
                'nombre': e.cliente.nombre
            } if e.cliente else None
        } for e in eventos]), 200
    
    except ValueError as e:
        return jsonify({'mensaje': f'Error en los parámetros: {str(e)}'}), 400

@agenda_bp.route('', methods=['POST'])
@jwt_required()
def create_evento():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not all(k in data for k in ['titulo', 'fecha_inicio', 'fecha_fin', 'estado']):
        return jsonify({'mensaje': 'Faltan campos requeridos'}), 400
    
    try:
        fecha_inicio = datetime.fromisoformat(data['fecha_inicio'])
        fecha_fin = datetime.fromisoformat(data['fecha_fin'])
    except ValueError:
        return jsonify({'mensaje': 'Formato de fecha inválido. Use el formato ISO (YYYY-MM-DDTHH:MM:SS)'}), 400
    
    if fecha_inicio >= fecha_fin:
        return jsonify({'mensaje': 'La fecha de fin debe ser posterior a la fecha de inicio'}), 400
    
    nuevo_evento = Agenda(
        usuario_id=current_user_id,
        cliente_id=data.get('cliente_id'),
        titulo=data['titulo'],
        descripcion=data.get('descripcion'),
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        estado=data['estado'],
        tipo=data.get('tipo')
    )
    
    db.session.add(nuevo_evento)
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Evento creado exitosamente',
        'evento': {
            'id': nuevo_evento.id,
            'titulo': nuevo_evento.titulo,
            'fecha_inicio': nuevo_evento.fecha_inicio.isoformat(),
            'fecha_fin': nuevo_evento.fecha_fin.isoformat(),
            'estado': nuevo_evento.estado
        }
    }), 201

@agenda_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_evento(id):
    current_user_id = get_jwt_identity()
    evento = Agenda.query.filter_by(id=id, usuario_id=current_user_id).first()
    if not evento:
        return jsonify({'mensaje': 'Evento no encontrado'}), 404
    
    data = request.get_json()
    
    if 'titulo' in data:
        evento.titulo = data['titulo']
    if 'descripcion' in data:
        evento.descripcion = data['descripcion']
    if 'fecha_inicio' in data:
        try:
            evento.fecha_inicio = datetime.fromisoformat(data['fecha_inicio'])
        except ValueError:
            return jsonify({'mensaje': 'Formato de fecha de inicio inválido. Use el formato ISO (YYYY-MM-DDTHH:MM:SS)'}), 400
    if 'fecha_fin' in data:
        try:
            evento.fecha_fin = datetime.fromisoformat(data['fecha_fin'])
        except ValueError:
            return jsonify({'mensaje': 'Formato de fecha de fin inválido. Use el formato ISO (YYYY-MM-DDTHH:MM:SS)'}), 400
    if 'estado' in data:
        evento.estado = data['estado']
    if 'tipo' in data:
        evento.tipo = data['tipo']
    if 'cliente_id' in data:
        evento.cliente_id = data['cliente_id']
    
    if evento.fecha_inicio >= evento.fecha_fin:
        return jsonify({'mensaje': 'La fecha de fin debe ser posterior a la fecha de inicio'}), 400
    
    db.session.commit()
    
    return jsonify({
        'mensaje': 'Evento actualizado exitosamente',
        'evento': {
            'id': evento.id,
            'titulo': evento.titulo,
            'fecha_inicio': evento.fecha_inicio.isoformat(),
            'fecha_fin': evento.fecha_fin.isoformat(),
            'estado': evento.estado
        }
    }), 200

@agenda_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_evento(id):
    current_user_id = get_jwt_identity()
    evento = Agenda.query.filter_by(id=id, usuario_id=current_user_id).first()
    if not evento:
        return jsonify({'mensaje': 'Evento no encontrado'}), 404
    
    db.session.delete(evento)
    db.session.commit()
    
    return jsonify({'mensaje': 'Evento eliminado exitosamente'}), 200
