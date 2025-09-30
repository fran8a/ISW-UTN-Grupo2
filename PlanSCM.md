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
			/Templates
```
Donde N es el número de TP, Parcial o Unidad.

---

## 🏷️ Convencion de nombrado

**Principios**

* Los archivos deben nombrarse de forma descriptiva, evitando nombres genéricos como documento1.pdf o resumen.docx.*
* Se usan guiones bajos "_" para separar secciones principales (tipo, unidad, tema, autor).
* Los tipos (RES, PRES, MAP, ENUN, EJ) van en MAYÚSCULAS
* Las instancias:
*	- Unidad1, Unidad2, Unidad<N> -> N es el número de unidad
*	- Parcial1, Parcial2, Parcial<N> -> N es el número de parcial
*	- TP1, TP2, TP<N> -> N es el número de trabajo práctico
* El Tema se escribe en PascalCase si es una frase (ej: UserStories), o en mayúsculas si es una sigla (ej: SCM, UML).

**Formato general**

```text
<Tipo>_<Unidad|Parcial|TP><N>_<Tema>_<Autor>.<ext>
```

Donde:
- Tipo → indica qué es el archivo:
	- RES → Resumen
	- PRES → Presentación
	- MAP → Mapa conceptual
	- ENUN → Enunciado
	- EJ → Ejercicio resuelto
- Unidad|Parcial|TP\<N> → número de la unidad, parcial o trabajo práctico.
- Tema → breve descripción (SCRUM, SCM, UserStories, etc.).
- Autor → si aplica (ej: si cada integrante sube su versión).
- ext → extensión (pdf, docx, pptx, etc.).


**📂 Ejemplos de nombrado**

```text
Resumen de Unidad 1 sobre SCM hecho por Tomas Tealdi

- RES_Unidad1_SCM_TomasTealdi.pdf


Presentación de Unidad 3 sobre User Stories

- PRES_Unidad3_UserStories.pptx


Enunciado del Trabajo Práctico 2 sobre Scrum

- ENUN_TP2_Scrum.docx
```

---

## 🗺️ Dónde va cada tipo de archivo

* **Apuntes** → `Apuntes/`

  * **Ejercicios resueltos** por unidad → `Apuntes/EjerciciosResueltos/Unidad<N>/`
  * **Mapas conceptuales** → `Apuntes/MapasConceptuales/`
  * **Presentaciones** → `Apuntes/Presentaciones/`
  * **Resumenes** → `Apuntes/Resumenes/`
* **Bibliografia**

  * Articulos → `Bibliografia/Articulos/`
  * Libros → `Bibliografia/Libros/`
* **Instancias Evaluativas**

  * Parciales (enunciados, correcciones, templates) → `InstanciasEvaluativas/Parciales/Parcial<N>/...`
  * Trabajos Prácticos (enunciados, entregas, correcciones, templates) → `InstanciasEvaluativas/TrabajosPracticos/TrabajoPractico<N>/...`


---

## 🧱 Baselines

### 📌 ¿Cuándo crear una baseline?
- Cuando se entrega un **TP**.  

### 🏷️ Cómo se nombran
Formato del **tag** en Git:
`BL-<Tipo>-<Ident>-<Fecha>`

Ejemplos:
- BL-TP1-Entrega-YYYY-mm-dd
- BL-TP1-Entrega-2025-05-01
- BL-TP2-Entrega-2025-04-10

YYYY: año
mm: mes
dd: dia
---

## Items de Configuración

1. Trabajos prácticos (TPs)
	- Archivos entregables (Word, PDF)
	- Enunciados.
	- Correcciones recibidas de la cátedra.
2. Parciales y recuperatorios
	- Enunciados de cada parcial.
	- Resoluciones propias (lo que el grupo hizo).
	- Correcciones o devoluciones de los docentes
3. Apuntes de clase
	- Resúmenes propios.
	- Diapositivas entregadas por los profesores.
	- Esquemas, mapas conceptuales o notas colaborativas.
4. Bibliografía y material de estudio
	- Libros en PDF.
	- Artículos recomendados.
	- Guías de lectura.
5. Reglamento académico y planificación de cursado
	- Cronograma de la materia.
	- Programa oficial de la asignatura.
	- Reglas de evaluación (notas mínimas, porcentajes).

---

## 🔧 Commits y ramas

**Prefijos de commit**:

| Prefijo     | Uso                                         | Ejemplo                                                     |
| ----------- | ------------------------------------------- | ----------------------------------------------------------- |
| `docs:`     | Altas/cambios en documentación              | `docs: agregar RES_Parcial2_Algoritmos_2025.pdf` |
| `fix:`      | Correcciones de nombres, typos, links       | `fix: corregir nombre de entrega`                      |
| `feat:`     | Plantillas, scripts de apoyo                | `feat: agregar TP1_TMP_PlantillaInforme.docx`    |
| `refactor:` | Reorganizar sin cambiar contenido académico | `refactor: separar U01 y U02`                      |

**Ramas**

* Base: `main`.
* Nomenclatura: `<Prefijo>/<Descripcion-tarea>`

  * `docs/cambio-fechas`
  * `docs/agrego-enunciados`
  * `fix/renombre-resumen-p1`

**Pull Requests**

* Todo cambio mediante PR.
* Describir **qué** + **por qué**.
* Tras merge, borrar la rama remota.

---

## 🔁 Flujo de trabajo

1. **Crear** rama desde `main` con el nombre indicado.
2. **Agregar** agregar cambios y **nombrar** siguiendo la convención.
3. **Commit** con el prefijo y descripcion adecuada.
4. **Push** y abrir **PR**.
