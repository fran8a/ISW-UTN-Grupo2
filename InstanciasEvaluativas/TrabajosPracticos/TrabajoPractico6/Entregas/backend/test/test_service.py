import pytest
from datetime import datetime

from src import database, service
from src.models import (
    Visitante,
    ActividadSinCupoError,
    ParqueNoDisponibleError,
    TallaRequeridaError,
    TerminosNoAceptadosError
)


@pytest.fixture(autouse=True)
def setup_database():
    """Limpia y configura la base de datos antes de cada test"""
    cursor = database.conn.cursor()
    
    cursor.execute("DELETE FROM Inscripcion")
    cursor.execute("DELETE FROM horarios_x_actividades")
    cursor.execute("DELETE FROM Visitante")
    cursor.execute("DELETE FROM Actividad")
    cursor.execute("DELETE FROM Horario")
    database.conn.commit()
    
    yield
    
    cursor.execute("DELETE FROM Inscripcion")
    cursor.execute("DELETE FROM horarios_x_actividades")
    cursor.execute("DELETE FROM Visitante")
    cursor.execute("DELETE FROM Actividad")
    cursor.execute("DELETE FROM Horario")
    database.conn.commit()


def crear_actividad_con_horario(nombre: str, requiere_talla: bool, cupos: int, hora: str = "10:00:00", fecha: str = "2025-10-15"):
    """Funcion aux para crear actividad y horario en la BD"""
    cursor = database.conn.cursor()
    
    # Crear actividad
    cursor.execute(
        "INSERT INTO Actividad (nombre, requiere_talla) VALUES (?, ?)",
        (nombre, requiere_talla)
    )
    actividad_id = cursor.lastrowid
    
    # Buscar o crear horario
    cursor.execute("SELECT id FROM Horario WHERE hora = ?", (hora,))
    horario_existente = cursor.fetchone()
    
    if horario_existente:
        horario_id = horario_existente["id"]
    else:
        cursor.execute(
            "INSERT INTO Horario (hora) VALUES (?)",
            (hora,)
        )
        horario_id = cursor.lastrowid
    
    # Relacionar actividad con horario y cupos
    cursor.execute(
        "INSERT INTO horarios_x_actividades (id_actividad, id_horario, fecha, cupos) VALUES (?, ?, ?, ?)",
        (actividad_id, horario_id, fecha, cupos)
    )
    
    database.conn.commit()
    return actividad_id, horario_id


def test_inscripcion_exitosa_con_todos_los_datos():
    """Test: Inscripción exitosa con todos los datos válidos"""
    actividad_id, horario_id = crear_actividad_con_horario("Tirolesa", True, 5)
    
    visitante = Visitante(nombre="Juan Perez", dni="12345678", edad=25, talla="M")
    
    resultado = service.inscribir_visitante(
        actividad_id=actividad_id,
        horario_id=horario_id,
        visitantes=[visitante],
        acepta_terminos=True,
        fecha="2025-10-15"
    )
    
    assert resultado["message"] == "Inscripción exitosa"
    
    # Verificar que se creó la inscripción
    cursor = database.conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM Inscripcion")
    assert cursor.fetchone()["total"] == 1


def test_inscripcion_falla_sin_cupos_disponibles():
    """Test: Falla cuando no hay cupos disponibles"""
    actividad_id, horario_id = crear_actividad_con_horario("Safari", False, 1)
    
    visitante1 = Visitante(nombre="Ana Lopez", dni="87654321", edad=30)
    visitante2 = Visitante(nombre="Carlos Ruiz", dni="11223344", edad=28)
    
    # Primera inscripción exitosa
    service.inscribir_visitante(actividad_id, horario_id, [visitante1], True, "2025-10-15")
    
    # Segunda inscripción debe fallar
    with pytest.raises(ActividadSinCupoError):
        service.inscribir_visitante(actividad_id, horario_id, [visitante2], True, "2025-10-15")


def test_inscripcion_falla_sin_talla_cuando_es_requerida():
    """Test: Falla cuando la actividad requiere talla y no se proporciona"""
    actividad_id, horario_id = crear_actividad_con_horario("Palestra", True, 8)
    
    visitante_sin_talla = Visitante(nombre="Maria Garcia", dni="99887766", edad=22)
    
    with pytest.raises(TallaRequeridaError):
        service.inscribir_visitante(actividad_id, horario_id, [visitante_sin_talla], True, "2025-10-15")


def test_inscripcion_exitosa_sin_talla_cuando_no_es_requerida():
    """Test: Inscripción exitosa sin talla cuando no es requerida"""
    actividad_id, horario_id = crear_actividad_con_horario("Jardinería", False, 10)
    
    visitante = Visitante(nombre="Pedro Martinez", dni="55667788", edad=35)
    
    resultado = service.inscribir_visitante(
        actividad_id, horario_id, [visitante], True, "2025-10-15"
    )
    
    assert resultado["message"] == "Inscripción exitosa"


def test_inscripcion_falla_sin_aceptar_terminos():
    """Test: Falla cuando no se aceptan los términos y condiciones"""
    actividad_id, horario_id = crear_actividad_con_horario("Safari", False, 6)
    
    visitante = Visitante(nombre="Sofia Torres", dni="33445566", edad=29)
    
    with pytest.raises(TerminosNoAceptadosError):
        service.inscribir_visitante(actividad_id, horario_id, [visitante], False, "2025-10-15")


def test_inscripcion_falla_cuando_parque_cerrado():
    """Test: Falla cuando intentan inscribirse un lunes (parque cerrado)"""
    actividad_id, horario_id = crear_actividad_con_horario("Tirolesa", True, 5, fecha="2025-10-13")  # Lunes
    
    visitante = Visitante(nombre="Luis Fernandez", dni="44556677", edad=27, talla="L")
    
    # Intentar inscribirse un lunes (2025-10-13 es lunes)
    with pytest.raises(ParqueNoDisponibleError, match="El parque está cerrado los lunes"):
        service.inscribir_visitante(actividad_id, horario_id, [visitante], True, "2025-10-13")
