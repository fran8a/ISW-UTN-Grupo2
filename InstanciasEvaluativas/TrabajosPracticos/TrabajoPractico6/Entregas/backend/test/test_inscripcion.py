import pytest
from datetime import time

from src.model import Actividad, ActividadSinCupoError, ParqueNoDisponibleError, SistemaInscripcion, TallaRequeridaError, TerminosNoAceptadosError, Visitante


@pytest.fixture
def sistema():
    return SistemaInscripcion()


def test_inscripcion_exitosa_con_todos_los_datos(sistema):
    tirolesa = Actividad("Tirolesa", [time(10, 0)], cupos=5, requiere_talla=True)
    sistema.agregar_actividad(tirolesa)
    
    visitante = Visitante("Juan Perez", "12345678", 25, "M")
    
    inscripcion = sistema.inscribir_visitante(
        actividad="Tirolesa",
        horario=time(10, 0),
        visitante=visitante,
        acepta_terminos=True
    )
    
    assert inscripcion is not None
    assert inscripcion["actividad"] == "Tirolesa"
    assert inscripcion["visitante"].nombre == "Juan Perez"


def test_inscripcion_falla_sin_cupos_disponibles(sistema):
    safari = Actividad("Safari", [time(14, 0)], cupos=1, requiere_talla=False)
    sistema.agregar_actividad(safari)
    
    visitante1 = Visitante("Ana Lopez", "87654321", 30)
    visitante2 = Visitante("Carlos Ruiz", "11223344", 28)
    
    sistema.inscribir_visitante("Safari", time(14, 0), visitante1, True)
    
    with pytest.raises(ActividadSinCupoError):
        sistema.inscribir_visitante("Safari", time(14, 0), visitante2, True)


def test_inscripcion_falla_sin_talla_cuando_es_requerida(sistema):
    palestra = Actividad("Palestra", [time(16, 0)], cupos=8, requiere_talla=True)
    sistema.agregar_actividad(palestra)
    
    visitante_sin_talla = Visitante("Maria Garcia", "99887766", 22)
    
    with pytest.raises(TallaRequeridaError):
        sistema.inscribir_visitante("Palestra", time(16, 0), visitante_sin_talla, True)


def test_inscripcion_exitosa_sin_talla_cuando_no_es_requerida(sistema):
    jardineria = Actividad("Jardinería", [time(9, 0)], cupos=10, requiere_talla=False)
    sistema.agregar_actividad(jardineria)
    
    visitante = Visitante("Pedro Martinez", "55667788", 35)
    
    inscripcion = sistema.inscribir_visitante(
        "Jardinería", 
        time(9, 0), 
        visitante, 
        True
    )
    
    assert inscripcion is not None


def test_inscripcion_falla_cuando_parque_cerrado(sistema):
    sistema.parque_abierto = False
    
    tirolesa = Actividad("Tirolesa", [time(11, 0)], cupos=5, requiere_talla=True)
    sistema.agregar_actividad(tirolesa)
    
    visitante = Visitante("Luis Fernandez", "44556677", 27, "L")
    
    with pytest.raises(ParqueNoDisponibleError):
        sistema.inscribir_visitante("Tirolesa", time(11, 0), visitante, True)


def test_inscripcion_falla_sin_aceptar_terminos(sistema):
    safari = Actividad("Safari", [time(15, 0)], cupos=6, requiere_talla=False)
    sistema.agregar_actividad(safari)
    
    visitante = Visitante("Sofia Torres", "33445566", 29)
    
    with pytest.raises(TerminosNoAceptadosError):
        sistema.inscribir_visitante("Safari", time(15, 0), visitante, False)


def test_inscripcion_falla_sin_talle_requerido(sistema):
    tirolesa = Actividad("Tirolesa", [time(12, 0)], cupos=4, requiere_talla=True)
    sistema.agregar_actividad(tirolesa)
    
    visitante = Visitante("Roberto Diaz", "22334455", 31)
    
    with pytest.raises(TallaRequeridaError):
        sistema.inscribir_visitante("Tirolesa", time(12, 0), visitante, True)