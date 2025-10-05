from datetime import time
from typing import List, Optional

# Excepciones personalizadas que heredan de Exception
class ActividadSinCupoError(Exception):
    pass


class HorarioNoDisponibleError(Exception):
    pass


class TallaRequeridaError(Exception):
    pass


class TerminosNoAceptadosError(Exception):
    pass


class ParqueNoDisponibleError(Exception):
    pass


# Definicion de clases de negocio
class Visitante:
    def __init__(self, nombre: str, dni: str, edad: int, talla: Optional[str] = None):
        self.nombre = nombre
        self.dni = dni
        self.edad = edad
        self.talla = talla


class Actividad:
    def __init__(self, nombre: str, horarios: List[time], cupos: int, requiere_talla: bool):
        self.nombre = nombre
        self.horarios = horarios
        self.cupos = cupos
        self.requiere_talla = requiere_talla
        self.inscripciones_por_horario = {horario: [] for horario in horarios}
        
    def tiene_cupo_disponible(self, horario: time) -> bool:
        return len(self.inscripciones_por_horario.get(horario, [])) < self.cupos
    
    def horario_valido(self, horario: time) -> bool:
        return horario in self.horarios
    
    def agregar_inscripcion(self, horario: time, visitante: Visitante):
        if horario not in self.inscripciones_por_horario:
            self.inscripciones_por_horario[horario] = []
        self.inscripciones_por_horario[horario].append(visitante)
        self.cupos -= 1


class SistemaInscripcion:
    def __init__(self):
        self.actividades = {}
        self.parque_abierto = True
        
    def agregar_actividad(self, actividad: Actividad):
        self.actividades[actividad.nombre] = actividad
        
    def inscribir_visitante(
        self, 
        actividad: str, 
        horario: time, 
        visitante: Visitante, 
        acepta_terminos: bool
    ) -> dict:
        if not self.parque_abierto:
            raise ParqueNoDisponibleError("El parque no está disponible")
            
        if not acepta_terminos:
            raise TerminosNoAceptadosError("Debe aceptar los términos y condiciones")
            
        actividad_obj = self.actividades.get(actividad)
        
        if not actividad_obj:
            raise ValueError("Actividad no encontrada")
            
        if not actividad_obj.horario_valido(horario):
            raise HorarioNoDisponibleError("Horario no disponible")
            
        if actividad_obj.requiere_talla and not visitante.talla:
            raise TallaRequeridaError("La actividad requiere talla de vestimenta")
            
        if not actividad_obj.tiene_cupo_disponible(horario):
            raise ActividadSinCupoError("No hay cupos disponibles")
            
        actividad_obj.agregar_inscripcion(horario, visitante)
        
        return {
            "actividad": actividad,
            "horario": horario,
            "visitante": visitante,
            "confirmado": True
        }