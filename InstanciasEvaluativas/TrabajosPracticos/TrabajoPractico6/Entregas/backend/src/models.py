from typing import List, Optional
from pydantic import BaseModel


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