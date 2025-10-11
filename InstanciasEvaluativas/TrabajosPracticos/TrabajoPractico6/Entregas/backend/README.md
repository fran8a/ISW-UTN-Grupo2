## 📍 Endpoints

### GET /actividades
Lista todas las actividades disponibles con su información de cupos y horarios.

*Response:*
json
{
  "actividades": [
    {
      "id": 1,
      "nombre": "Tirolesa",
      "requiere_talla": true,
      "total_cupos": 15,
      "total_horarios": 3
    }
  ]
}


---

### GET /actividad/{actividad_id}
Obtiene los detalles de una actividad específica con sus horarios disponibles.

*Response:*
json
{
  "actividad": {
    "id": 1,
    "nombre": "Tirolesa",
    "requiere_talla": true
  },
  "horarios": [
    {
      "id": 1,
      "hora": "10:00:00",
      "cupos": 5,
      "fecha": "2025-10-15"
    }
  ]
}


*Errors:*
- 404 - Actividad no encontrada

---

### POST /inscripcion
Inscribe uno o varios visitantes a una actividad en un horario específico.

*Request Body:*
json
{
  "actividad_id": 1,
  "horario_id": 1,
  "fecha": "2025-10-15",
  "acepta_terminos": true,
  "visitantes": [
    {
      "nombre": "Juan Pérez",
      "dni": "12345678",
      "edad": 25,
      "talla": "M"
    }
  ]
}


*Response (Success):*
json
{
  "message": "Inscripción exitosa"
}
