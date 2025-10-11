from fastapi import FastAPI
from . import database
from pydantic import BaseModel
from typing import List, Optional
from fastapi import HTTPException


app = FastAPI(title="Parque de Aventuras API", version="1.0.0")


#Clases que vamos a utilizar como bodys
class Visitante(BaseModel):
    nombre: str
    dni: str
    edad: int
    talla: Optional[str] = None

class InscripcionRequest(BaseModel):
    actividad_id: int
    horario_id: int
    visitantes: List[Visitante]
    acepta_terminos: bool
    fecha: str


#Este endopoint esta para la pantalla principal donde se eligen las actividades
@app.get("/actividades")
def listar_actividades():
    cursor = database.conn.cursor()
    cursor.execute("SELECT id, nombre, requiere_talla, SUM(cupos) as total_cupos , COUNT(*) as total_horarios FROM Actividad LEFT JOIN horarios_x_actividades ON Actividad.id = horarios_x_actividades.id_actividad GROUP BY Actividad.id")
    rows = cursor.fetchall()
    return {"actividades": [dict(row) for row in rows]}

@app.get("/horarios")
def listar_todos_los_horarios():
    cursor = database.conn.cursor()
    cursor.execute("SELECT * FROM Horario")
    rows = cursor.fetchall()
    return {"horarios": [dict(row) for row in rows]}


@app.get("/actividad/{actividad_id}")
def obtener_actividad(actividad_id: int):
    cursor = database.conn.cursor()
    cursor.execute("SELECT * FROM Actividad WHERE id = ?", (actividad_id,))
    actividad = cursor.fetchone()
    if not actividad:
        return {"error": "Actividad no encontrada"}
    
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




@app.post("/inscripcion")
def inscribir_visitante(body: InscripcionRequest):
    actividad_id = body.actividad_id
    horario_id = body.horario_id
    visitantes = body.visitantes
    acepta_terminos = body.acepta_terminos
    fecha = body.fecha
    if not acepta_terminos:
        raise HTTPException(status_code=400, detail="Debe aceptar los términos y condiciones")

    cursor = database.conn.cursor()
    
    
    cursor.execute("SELECT * FROM Actividad WHERE id = ?", (actividad_id,))
    actividad = cursor.fetchone()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")


    cursor.execute("SELECT * FROM Horario WHERE id = ?", (horario_id,))
    horario = cursor.fetchone()
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    
    
    cursor.execute("""
        SELECT cupos FROM horarios_x_actividades 
        WHERE id_actividad = ? AND id_horario = ? AND fecha = ?
    """, (actividad_id, horario_id, fecha))
    cupos_disponibles = cursor.fetchone()


    if not cupos_disponibles or cupos_disponibles["cupos"] < len(visitantes):
        raise HTTPException(status_code=400, detail="No hay cupos disponibles para esta actividad en el horario y fecha seleccionados")
    
    
    for visitante in visitantes:
        if actividad["requiere_talla"] and not visitante.talla:
            raise HTTPException(status_code=400, detail="La actividad requiere talla de vestimenta")
        
    
    for visitante in visitantes:
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


    
        
        try:
            cursor.execute("""
                INSERT INTO Inscripcion (visitante_id, horario_id, actividad_id, fecha) 
                VALUES (?, ?, ?, ?)
            """, (visitante_id, horario_id, actividad_id, fecha))
            
            cursor.execute("""            UPDATE horarios_x_actividades 
                SET cupos = cupos - 1 
                WHERE id_actividad = ? AND id_horario = ? AND fecha = ? AND cupos > 0
            """, (actividad_id, horario_id, fecha))
            cursor.connection.commit()
        
        except Exception as e:
            cursor.connection.rollback()
            return {"error": str(e)}

    return {"message": "Inscripción exitosa"}