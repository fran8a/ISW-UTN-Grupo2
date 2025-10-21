from fastapi import FastAPI, HTTPException
import uvicorn

from src.models import (
    InscripcionRequest,
    ActividadSinCupoError,
    HorarioNoDisponibleError,
    ParqueNoDisponibleError,
    TallaRequeridaError,
    TerminosNoAceptadosError
)
from src import service

app = FastAPI(title="EcoHarmonyPark", version="1.0.0")

# Endpoint para listar todas las actividades disponibles
@app.get("/actividades")
def listar_actividades():
    actividades = service.listar_actividades()
    return {"actividades": actividades}

# Endpoint para obtener detalles de una actividad específica
@app.get("/actividad/{actividad_id}")
def obtener_actividad(actividad_id: int):
    actividad = service.obtener_actividad(actividad_id)
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    return actividad

# Endpoint para inscribir visitantes a una actividad
@app.post("/inscripcion")
def inscribir_visitante(body: InscripcionRequest):
    try:
        return service.inscribir_visitante(
            actividad_id=body.actividad_id,
            horario_id=body.horario_id,
            visitantes=body.visitantes,
            acepta_terminos=body.acepta_terminos,
            fecha=body.fecha
        )
    except ParqueNoDisponibleError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except TerminosNoAceptadosError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except TallaRequeridaError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ActividadSinCupoError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HorarioNoDisponibleError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
