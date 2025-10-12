from . import database
from .models import (
    ActividadSinCupoError, 
    HorarioNoDisponibleError, 
    ParqueNoDisponibleError,
    TallaRequeridaError, 
    TerminosNoAceptadosError
)
from typing import List
from datetime import datetime


def listar_actividades():
    cursor = database.conn.cursor()
    cursor.execute("SELECT id, nombre, requiere_talla, SUM(cupos) as total_cupos , COUNT(*) as total_horarios, descripcion, terminos_y_condiciones FROM Actividad LEFT JOIN horarios_x_actividades ON Actividad.id = horarios_x_actividades.id_actividad GROUP BY Actividad.id")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def obtener_actividad(actividad_id: int):
    cursor = database.conn.cursor()
    cursor.execute("SELECT * FROM Actividad WHERE id = ?", (actividad_id,))
    actividad = cursor.fetchone()
    if not actividad:
        return None
    
    cursor.execute("""
        SELECT Horario.id, Horario.hora, horarios_x_actividades.cupos, horarios_x_actividades.fecha
        FROM Horario
        JOIN horarios_x_actividades ON Horario.id = horarios_x_actividades.id_horario
        WHERE horarios_x_actividades.id_actividad = ?
    """, (actividad_id,))
    horarios = cursor.fetchall()
    
    return {
        "actividad": dict(actividad),
        "horarios": [dict(horario) for horario in horarios]
    }


def inscribir_visitante(actividad_id: int, horario_id: int, visitantes: List, acepta_terminos: bool, fecha: str):
    cursor = database.conn.cursor()
    
    # Validación 0: Parque cerrado los lunes
    try:
        fecha_obj = datetime.strptime(fecha, "%Y-%m-%d")
        # weekday() devuelve 0=lunes, 1=martes, ..., 6=domingo
        if fecha_obj.weekday() == 0:
            raise ParqueNoDisponibleError("El parque está cerrado los lunes")
    except ValueError:
        raise ValueError("Formato de fecha inválido. Use YYYY-MM-DD")
    
    # Validación 1: Terminos y condiciones
    if not acepta_terminos:
        raise TerminosNoAceptadosError("Debe aceptar los términos y condiciones")
    
    # Validación 2: Actividad existe
    cursor.execute("SELECT * FROM Actividad WHERE id = ?", (actividad_id,))
    actividad = cursor.fetchone()
    if not actividad:
        raise ValueError("Actividad no encontrada")

    # Validación 3: Horario existe
    cursor.execute("SELECT * FROM Horario WHERE id = ?", (horario_id,))
    horario = cursor.fetchone()
    if not horario:
        raise HorarioNoDisponibleError("Horario no encontrado")
    
    # Validación 4: Cupos disponibles para la fecha
    cursor.execute("""
        SELECT cupos FROM horarios_x_actividades 
        WHERE id_actividad = ? AND id_horario = ? AND fecha = ?
    """, (actividad_id, horario_id, fecha))
    cupos_info = cursor.fetchone()
    
    if not cupos_info:
        raise HorarioNoDisponibleError("No existe ese horario para la actividad en la fecha seleccionada")
    
    cupos_disponibles = cupos_info["cupos"]
    
    if cupos_disponibles < len(visitantes):
        raise ActividadSinCupoError("No hay cupos disponibles para esta actividad en el horario y fecha seleccionados")
    
    # Validación 5: Talla requerida
    for visitante in visitantes:
        if actividad["requiere_talla"] and not visitante.talla:
            raise TallaRequeridaError("La actividad requiere talla de vestimenta")
    
    # Procesamiento de inscripciones
    try:
        for visitante in visitantes:
            # Buscar o crear visitante
            cursor.execute("SELECT * FROM Visitante WHERE dni = ?", (visitante.dni,))
            visitante_db = cursor.fetchone()
        
            if not visitante_db:
                cursor.execute("""
                    INSERT INTO Visitante (nombre, dni, edad, talla) 
                    VALUES (?, ?, ?, ?)
                """, (
                    visitante.nombre,
                    visitante.dni, 
                    visitante.edad, 
                    visitante.talla, 
                ))
                visitante_id = cursor.lastrowid
            else:
                visitante_id = visitante_db["id"]
            
            # Crear inscripción
            cursor.execute("""
                INSERT INTO Inscripcion (visitante_id, horario_id, actividad_id, fecha) 
                VALUES (?, ?, ?, ?)
            """, (visitante_id, horario_id, actividad_id, fecha))
            
            # Decrementar cupos
            cursor.execute("""
                UPDATE horarios_x_actividades 
                SET cupos = cupos - 1 
                WHERE id_actividad = ? AND id_horario = ? AND fecha = ? AND cupos > 0
            """, (actividad_id, horario_id, fecha))
        
        cursor.connection.commit()
        return {"message": "Inscripción exitosa"}
    
    except Exception as e:
        cursor.connection.rollback()
        raise e
