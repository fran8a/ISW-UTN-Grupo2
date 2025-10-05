# Inscripción a Actividad - Decisiones de Diseño

## Contexto
Este documento justifica las decisiones de diseño tomadas durante la implementación de la User Story "Inscribirme a actividad" del sistema EcoHarmony Park, desarrollada aplicando TDD (Test-Driven Development).

## Arquitectura General

### Decisión 1: Diseño con tres clases principales
*Clases implementadas:*
- Visitante
- Actividad
- SistemaInscripcion

*Justificación:*
- *Separación de responsabilidades*: Cada clase representa un concepto claro del dominio del negocio
- *Visitante*: Encapsula los datos personales del visitante (nombre, DNI, edad, talla)
- *Actividad*: Gestiona la información de cada actividad (horarios, cupos, requisitos)
- *SistemaInscripcion*: Coordina el proceso de inscripción y aplica las reglas de negocio
- *Mantenibilidad*: Facilita futuros cambios sin afectar otras partes del sistema
- *Testabilidad*: Permite probar cada componente de forma aislada

### Decisión 2: Excepciones personalizadas para cada tipo de error
*Excepciones creadas:*
- ActividadSinCupoError
- HorarioNoDisponibleError
- TallaRequeridaError
- TerminosNoAceptadosError
- ParqueNoDisponibleError

*Justificación:*
- *Claridad*: El nombre de cada excepción describe exactamente qué salió mal
- *Manejo específico*: Permite capturar y manejar cada tipo de error de forma diferenciada

## Gestión de Datos

### Decisión 3: Almacenamiento de inscripciones por horario
*Implementación:*
python
self.inscripciones_por_horario = {horario: [] for horario in horarios}


*Justificación:*
- *Granularidad correcta*: Cada horario tiene su propio límite de cupos independiente
- *Coherencia con el dominio*: Los cupos son por horario, no por actividad en general

### Decisión 4: Diccionario para almacenar actividades
*Implementación:*
python
self.actividades = {}


*Justificación:*
- *Simplicidad*: Estructura de datos simple y directa para el alcance actual
- *Suficiente para el MVP*: No requiere complejidad adicional de bases de datos en esta etapa

## Validaciones

### Decisión 5: Orden de validaciones en cascada
*Orden implementado:*
1. Parque abierto
2. Términos aceptados
3. Actividad existe
4. Horario válido
5. Talla requerida
6. Cupos disponibles

*Justificación:*
- *Prioridad*: Las validaciones más generales van primero para evitar procesamiento innecesario
- *Lógica de negocio*: No tiene sentido validar cupos si el parque está cerrado

### Decisión 6: Talla como parámetro opcional
*Implementación:*
python
def __init__(self, nombre: str, dni: str, edad: int, talla: Optional[str] = None)


*Justificación:*
- *Flexibilidad*: No todas las actividades requieren talla
- *Reutilización*: La misma clase Visitante sirve para todas las actividades
- *Validación contextual*: La necesidad de talla se valida según la actividad específica
- *Cumplimiento de requisitos*: Alineado con los criterios de aceptación que especifican "si la actividad lo demanda"

## Cobertura de Criterios de Aceptación

Cada criterio de aceptación tiene su test correspondiente:

| Criterio | Test |
|----------|------|
| Seleccionar actividad con cupos | test_inscripcion_exitosa_con_todos_los_datos |
| Sin cupos disponibles | test_inscripcion_falla_sin_cupos_disponibles |
| Seleccionar horario | test_inscripcion_exitosa_con_todos_los_datos |
| Talla requerida | test_inscripcion_falla_sin_talla_cuando_es_requerida |
| Talla no requerida | test_inscripcion_exitosa_sin_talla_cuando_no_es_requerida |
| Aceptar términos | test_inscripcion_falla_sin_aceptar_terminos |
| Parque no disponible | test_inscripcion_falla_cuando_parque_cerrado |