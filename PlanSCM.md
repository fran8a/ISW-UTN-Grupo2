# Plan de Gestión de Configuración (SCM) - ISW Grupo 2

> **Objetivo**: mantener todo el material de cursada **ordenado, trazable y fácil de encontrar**.
>
> Este README define **dónde va cada archivo relacionado con la materia**, **cómo se nombra**, **cómo se versiona** y **cómo trabajamos con Git**.

---

## 🗂️ Estructura del repositorio

```text
/Apuntes
	/EjerciciosResueltos
		/UnidadN
	/MapasConceptuales
	/Presentaciones
	/Resumenes
/Bibliografia
	/Articulos
	/Libros
/InstanciasEvaluativas
	/Parciales
		/ParcialN
			/Correcciones
			/Enunciados
			/Templates
	/TrabajosPracticos
		/TrabajoPracticoN
			/Correcciones
			/Entregas
			/Enunciados
```

Donde “N” representa el identificador del TP, Parcial o Unidad. Este identificador suele ser numérico, aunque en determinadas instancias puede adoptar un nombre específico.

---

## 🏷️ Convención de nombrado

**Formato general**

```text
<Tipo>_<Instancia><N>_<Tema>_<Autor>.<ext>
```

Donde:

- Tipo → indica la naturaleza del archivo:
  - RES → Resumen
  - PRES → Presentación
  - MAP → Mapa conceptual
  - ENUN → Enunciado
  - EJ → Ejercicio resuelto
  - BBL → Bibliografía
  - TMP → Template
  - CORR → Corrección (de TP, parcial, etc.)
- Instancia<N> → identifica la unidad, parcial o trabajo práctico:
  - Unidad<N>
  - Parcial<N>
  - TP<N>
- Tema → breve descripción del contenido (ej.: SCRUM, SCM, UserStories, etc.)
- Autor → opcional (usado si cada integrante sube su propio contenido.)
- ext → extensión (ej.: pdf, docx, pptx, etc.).

**Principios de nombrado**

- Los archivos deben nombrarse de forma descriptiva, evitando nombres genéricos como documento1.pdf o resumen.docx.\*
- Se usan guiones bajos "\_" para separar las secciones principales (tipo, instancia, tema, autor).
- Los tipos (RES, PRES, MAP, ENUN, EJ, etc) se escriben siempre en MAYÚSCULAS.
- El tema:
  - Se escribe en PascalCase cuando es una frase (ej: UserStories).
  - Se escribe en MAYÚSCULAS cuando es una sigla (ej: SCM, UML).

Ejemplos de nombrado:

    Resumen de Unidad 1 sobre SCM hecho por Tomas Tealdi:
    - RES_Unidad1_SCM_TomasTealdi.pdf

    Presentación de Unidad 3 sobre User Stories:
    - PRES_Unidad3_UserStories.pptx

    Enunciado del Trabajo Práctico 2 sobre Scrum:
    - ENUN_TP2_Scrum.docx

---

## 🧩 Items de Configuración

1. Trabajos prácticos (TPs)
   - Archivos entregables.
   - Enunciados.
   - Correcciones recibidas de la cátedra.
2. Parciales y recuperatorios
   - Enunciados de cada parcial.
   - Resoluciones propias (de los integrantes).
   - Correcciones o devoluciones de los docentes.
3. Apuntes de clase
   - Resúmenes propios.
   - Diapositivas entregadas por los profesores.
   - Esquemas, mapas conceptuales o notas colaborativas.
4. Bibliografía y material de estudio
   - Libros en PDF.
   - Artículos recomendados.
   - Guías de lectura.

---

## 🗺️ Dónde va cada tipo de archivo

- **Apuntes** → `Apuntes/`

  - **Ejercicios resueltos** por unidad → `Apuntes/EjerciciosResueltos/Unidad<N>/`
  - **Mapas conceptuales** → `Apuntes/MapasConceptuales/`
  - **Presentaciones** → `Apuntes/Presentaciones/`
  - **Resúmenes** → `Apuntes/Resumenes/`

- **Bibliografía** → `Bibliografias/`

  - Artículos → `Bibliografia/Articulos/`
  - Libros → `Bibliografia/Libros/`

- **Instancias Evaluativas** → `InstanciasEvaluativas/`

  - Parciales (enunciados, correcciones, templates) → `InstanciasEvaluativas/Parciales/Parcial<N>/...`
  - Trabajos Prácticos (enunciados, entregas, correcciones, templates) → `InstanciasEvaluativas/TrabajosPracticos/TrabajoPractico<N>/...`

---

## 🧱 Baselines

### 📌 ¿Cuándo crear una baseline?

- Al realizar la entrega de un **Trabajo Práctico (TP)**

### 🏷️ Cómo se nombran

Las baselines se registran mediante la siguiente convención para el **tag** en Git:
`BL-TP<N>-Entrega-<Fecha>`

Donde:

- BL → identifica el tag como una baseline.
- N → Representa el identificador del TP.
- Fecha → Es la fecha de creación del baseline en formato `YYYY-MM-DD`

Ejemplos de nombrado de baseline:

- BL-TP1-Entrega-2025-05-01
- BL-TP2-Entrega-2025-04-10

---

## 🔧 Commits y ramas

**Prefijos de commit**:
Para mantener un historial claro y consistente, todos los commits deben comenzar con un prefijo que indique el tipo de cambio realizado:

| Prefijo     | Uso                                         | Ejemplo                                          |
| ----------- | ------------------------------------------- | ------------------------------------------------ |
| `docs:`     | Altas/cambios en documentación              | `docs: agregar RES_Parcial2_Algoritmos_2025.pdf` |
| `fix:`      | Correcciones de nombres, typos, links       | `fix: corregir nombre de entrega`                |
| `feat:`     | Plantillas, scripts de apoyo                | `feat: agregar TP1_TMP_PlantillaInforme.docx`    |
| `refactor:` | Reorganizar sin cambiar contenido académico | `refactor: separar U01 y U02`                    |

**Ramas**

- La rama base del repositorio es `main`.
- La convención de nombrado de las ramas es:
  `<Prefijo>/<descripcion-tarea>`

  Donde:

  - Prefijo → Indica el tipo de cambio que se realiza y coinciden con los definidos para los commits (docs, fix, feat, refactor)
  - descripcion-tarea → Es una descripción breve y clara de lo que se realiza en la rama.

  Ejemplos:

  - `docs/cambio-fechas`
  - `docs/agrego-enunciados`
  - `fix/renombre-resumen-p1`

**Pull Requests (PR)**

- Todo cambio debe realizarse mediante un PR dirigido a la rama main.
- Todo PR debe ser **revisado y aprobado por al menos un integrante del grupo** antes de realizar el merge.
- Una vez aprobado y mergeado, se debe **eliminar la rama remota**.

---

## 🔁 Flujo de trabajo

1. **Crear** una rama desde `main`, siguiendo la convención establecida.
2. Realizar los **cambios** necesarios, nombrando los archivos de acuerdo con las reglas definidas.
3. Registrar los cambios mediante un **commit**, utilizando el prefijo y la descripción adecuada.
4. **Pushear** la rama al repositorio remoto y abrir un **Pull Request** dirigido a main.
5. Solicitar revisión del PR por parte de al menos un integrante del grupo.
6. **Aprobar y mergear** el PR cuando esté validado, y **eliminar la rama remota**.
