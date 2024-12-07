from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Venta, DetalleVenta, Producto, Usuario, Cliente
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from . import ventas_bp

@ventas_bp.route('', methods=['GET'])
@jwt_required()
def get_ventas():
    ventas = Venta.query.all()
    return jsonify([{
        'id': v.id,
        'cliente_id': v.cliente_id,
        'usuario_id': v.usuario_id,
        'monto_total': float(v.monto_total),
        'estado': v.estado,
        'fecha_venta': v.fecha_venta.isoformat(),
        'notas': v.notas,
        'cliente': v.cliente.nombre if v.cliente else None,
        'usuario': v.usuario.nombre if v.usuario else None
    } for v in ventas]), 200

@ventas_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_venta(id):
    venta = Venta.query.get_or_404(id)
    detalles = DetalleVenta.query.filter_by(venta_id=id).all()
    
    return jsonify({
        'id': venta.id,
        'cliente_id': venta.cliente_id,
        'usuario_id': venta.usuario_id,
        'monto_total': float(venta.monto_total),
        'estado': venta.estado,
        'fecha_venta': venta.fecha_venta.isoformat(),
        'notas': venta.notas,
        'cliente': venta.cliente.nombre if venta.cliente else None,
        'usuario': venta.usuario.nombre if venta.usuario else None,
        'detalles': [{
            'id': d.id,
            'producto_id': d.producto_id,
            'cantidad': d.cantidad,
            'precio_unitario': float(d.precio_unitario),
            'subtotal': float(d.subtotal),
            'producto': d.producto.nombre if d.producto else None
        } for d in detalles]
    }), 200

@ventas_bp.route('', methods=['POST'])
@jwt_required()
def create_venta():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    if not all(k in data for k in ('cliente_id', 'detalles')):
        return jsonify({'mensaje': 'Faltan campos obligatorios'}), 400
    
    try:
        cliente = Cliente.query.get(data['cliente_id'])
        if not cliente:
            return jsonify({'mensaje': 'Cliente no encontrado'}), 404
        
        nueva_venta = Venta(
            cliente_id=data['cliente_id'],
            usuario_id=current_user_id,
            monto_total=0,
            estado='pendiente',
            fecha_venta=datetime.utcnow(),
            notas=data.get('notas', '')
        )
        
        db.session.add(nueva_venta)
        
        monto_total = 0
        for detalle in data['detalles']:
            if not all(k in detalle for k in ('producto_id', 'cantidad')):
                return jsonify({'mensaje': 'Faltan campos obligatorios en detalles'}), 400
            
            producto = Producto.query.get(detalle['producto_id'])
            if not producto:
                return jsonify({'mensaje': f'Producto con id {detalle["producto_id"]} no encontrado'}), 404
            
            if producto.stock < detalle['cantidad']:
                return jsonify({'mensaje': f'No hay stock suficiente para {producto.nombre}'}), 400
            
            subtotal = producto.precio * detalle['cantidad']
            nuevo_detalle = DetalleVenta(
                venta=nueva_venta,
                producto_id=detalle['producto_id'],
                cantidad=detalle['cantidad'],
                precio_unitario=producto.precio,
                subtotal=subtotal
            )
            
            producto.stock -= detalle['cantidad']
            db.session.add(nuevo_detalle)
            monto_total += subtotal
        
        nueva_venta.monto_total = monto_total
        nueva_venta.estado = 'completada'
        
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Venta creada correctamente',
            'venta': {
                'id': nueva_venta.id,
                'cliente_id': nueva_venta.cliente_id,
                'usuario_id': nueva_venta.usuario_id,
                'monto_total': float(nueva_venta.monto_total),
                'estado': nueva_venta.estado,
                'fecha_venta': nueva_venta.fecha_venta.isoformat(),
                'notas': nueva_venta.notas
            }
        }), 201
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'Ocurrio un error al crear la venta'}), 400

@ventas_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_venta(id):
    venta = Venta.query.get_or_404(id)
    data = request.get_json()
    
    if 'estado' in data:
        venta.estado = data['estado']
    if 'notas' in data:
        venta.notas = data['notas']
    
    try:
        db.session.commit()
        return jsonify({
            'mensaje': 'Venta actualizada correctamente',
            'venta': {
                'id': venta.id,
                'cliente_id': venta.cliente_id,
                'usuario_id': venta.usuario_id,
                'monto_total': float(venta.monto_total),
                'estado': venta.estado,
                'fecha_venta': venta.fecha_venta.isoformat(),
                'notas': venta.notas
            }
        }), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'Ocurrio un error al actualizar la venta'}), 400

@ventas_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_venta(id):
    venta = Venta.query.get_or_404(id)
    
    try:
        # Restore product stock
        for detalle in venta.detalles:
            producto = detalle.producto
            producto.stock += detalle.cantidad
        
        db.session.delete(venta)
        db.session.commit()
        return jsonify({'mensaje': 'Venta eliminada correctamente'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'mensaje': 'Ocurrio un error al eliminar la venta'}), 400

@ventas_bp.route('/search', methods=['GET'])
@jwt_required()
def search_ventas():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'mensaje': 'Se requiere un campo de busqueda'}), 400
    
    ventas = Venta.query.join(Cliente).filter(
        (Cliente.nombre.ilike(f'%{query}%')) |
        (Venta.estado.ilike(f'%{query}%')) |
        (Venta.fecha_venta.cast(db.String).ilike(f'%{query}%'))
    ).all()
    
    return jsonify([{
        'id': v.id,
        'cliente_id': v.cliente_id,
        'usuario_id': v.usuario_id,
        'monto_total': float(v.monto_total),
        'estado': v.estado,
        'fecha_venta': v.fecha_venta.isoformat(),
        'notas': v.notas,
        'cliente': v.cliente.nombre if v.cliente else None,
        'usuario': v.usuario.nombre if v.usuario else None
    } for v in ventas]), 200


@ventas_bp.route('/<int:id>/pdf', methods=['GET'])
@jwt_required()
def generate_venta_pdf(id):
    venta = Venta.query.get_or_404(id)
    detalles = DetalleVenta.query.filter_by(venta_id=id).all()
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    normal_style = styles['Normal']
    
    # Title
    elements.append(Paragraph(f"Venta #{venta.id}", title_style))
    elements.append(Spacer(1, 12))
    
    # Cliente and Usuario information
    elements.append(Paragraph(f"Cliente: {venta.cliente.nombre if venta.cliente else 'N/A'}", normal_style))
    elements.append(Paragraph(f"Usuario: {venta.usuario.nombre if venta.usuario else 'N/A'}", normal_style))
    elements.append(Paragraph(f"Fecha: {venta.fecha_venta.strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    elements.append(Paragraph(f"Estado: {venta.estado}", normal_style))
    elements.append(Spacer(1, 12))
    
    # Products table
    data = [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']]
    for detalle in detalles:
        data.append([
            detalle.producto.nombre if detalle.producto else 'N/A',
            str(detalle.cantidad),
            f"${detalle.precio_unitario:.2f}",
            f"${detalle.subtotal:.2f}"
        ])
    
    # Add total row
    data.append(['', '', 'Total:', f"${venta.monto_total:.2f}"])
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('ALIGN', (0, -1), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    
    # Add notes if available
    if venta.notas:
        elements.append(Spacer(1, 12))
        elements.append(Paragraph("Notas:", styles['Heading3']))
        elements.append(Paragraph(venta.notas, normal_style))
    
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=venta_{venta.id}.pdf'
    
    return response