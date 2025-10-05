import pytest
from main import *

@pytest.fixture
def visitante_con_talla():
    return Visitante("Juan Perez", "12345678", 30, "M")

@pytest.fixture
def visitante_sin_talla():
    return Visitante("Ana Gomez", "87654321", 25)

@pytest.fixture
def sistema():
    return SistemaInscripcion()

# Probar inscripcion exitosa por el camino feliz
def test_agregar_inscripcion(visitante_con_talla, sistema):
    actividad = Actividad("Montaña Rusa", [time(10, 0), time(11, 0)], 5, True)
    sistema.agregar_actividad(actividad)

    resultado = sistema.inscribir_visitante(
        actividad="Montaña Rusa",
        horario=time(10, 0),
        visitante=visitante_con_talla,
        acepta_terminos=True
    )

    assert resultado["confirmado"] is True
    assert actividad.inscripciones_por_horario[time(10, 0)] == [visitante_con_talla]


# Probar inscribirse a una actividad que no tiene cupo para el horario seleccionado
def test_agregar_inscripcion_sin_cupos(visitante_con_talla, sistema):
    actividad = Actividad("Montaña Rusa", [time(10, 0)], 1, True)
    sistema.agregar_actividad(actividad)

    sistema.inscribir_visitante(
        actividad="Montaña Rusa",
        horario=time(10, 0),
        visitante=visitante_con_talla,
        acepta_terminos=True
    )

    visitante2 = Visitante("Carlos Lopez", "11223344", 28, "L")
    with pytest.raises(ActividadSinCupoError):
        sistema.inscribir_visitante(
            actividad="Montaña Rusa",
            horario=time(10, 0),
            visitante=visitante2,
            acepta_terminos=True
        )

#Probar inscribirse a una actividad sin ingresar el talle porque la actividad no lo requiere
def test_agregar_inscripcion_sin_talla(visitante_sin_talla, sistema):
    actividad = Actividad("Montaña Rusa", [time(10, 0)], 5, False)
    sistema.agregar_actividad(actividad)

    resultado = sistema.inscribir_visitante(
        actividad="Montaña Rusa",
        horario=time(10, 0),
        visitante=visitante_sin_talla,
        acepta_terminos=True
    )

    assert resultado["confirmado"] is True
    assert actividad.inscripciones_por_horario[time(10, 0)] == [visitante_sin_talla]


# Probar inscribirse a una actividad en un horario no disponible
def test_agregar_inscripcion_fuera_horario(visitante_con_talla, sistema):
    actividad = Actividad("Montaña Rusa", [time(10, 0)], 5, True)
    sistema.agregar_actividad(actividad)

    with pytest.raises(HorarioNoDisponibleError):
        sistema.inscribir_visitante(
            actividad="Montaña Rusa",
            horario=time(12, 0),
            visitante=visitante_con_talla,
            acepta_terminos=True
        )

# Probar inscribirse a una actividad sin aceptar los términos y condiciones
def test_agregar_inscripcion_sin_aceptar_terminos(visitante_con_talla, sistema):
    actividad = Actividad("Montaña Rusa", [time(10, 0)], 5, True)
    sistema.agregar_actividad(actividad)

    with pytest.raises(TerminosNoAceptadosError):
        sistema.inscribir_visitante(
            actividad="Montaña Rusa",
            horario=time(10, 0),
            visitante=visitante_con_talla,
            acepta_terminos=False
        )

# Probar inscribirse a una actividad cuando el parque está cerrado
def test_agregar_inscripcion_parque_cerrado(visitante_con_talla, sistema):
    actividad = Actividad("Montaña Rusa", [time(10, 0)], 5, True)
    sistema.agregar_actividad(actividad)
    sistema.parque_abierto = False

    with pytest.raises(ParqueNoDisponibleError):
        sistema.inscribir_visitante(
            actividad="Montaña Rusa",
            horario=time(10, 0),
            visitante=visitante_con_talla,
            acepta_terminos=True
        )
    
# Probar inscribirse a una actividad que requiere talla sin ingresar la talla
def test_agregar_inscripcion_talla_requerida(visitante_sin_talla, sistema):
    actividad = Actividad("Montaña Rusa", [time(10, 0)], 5, True)
    sistema.agregar_actividad(actividad)

    with pytest.raises(TallaRequeridaError):
        sistema.inscribir_visitante(
            actividad="Montaña Rusa",
            horario=time(10, 0),
            visitante=visitante_sin_talla,
            acepta_terminos=True
        )