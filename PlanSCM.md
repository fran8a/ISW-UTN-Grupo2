# Plan de Gestión de Configuración (SCM) - ISW Grupo 2

> **Objetivo**: mantener todo el material de cursada **ordenado, trazable y fácil de encontrar**.
>
> Este README define **dónde va cada cosa**, **cómo se nombra**, **cómo se versiona** y **cómo trabajamos con Git**.

---


## 🗂️ Estructura del repositorio

```text
/APUNTES
	/EJERCICIOSRESUELTOS
		/Unidad1
		/UnidadN
	/MapasConceptuales
	/Presentaciones
	/Resumenes
/Bibliografia
	/Articulos
	/Libros
/InstanciasEvaluativas
	/Parciales
		/Parcial1
		/ParcialN
			/Correcciones
			/Enunciados
			/Templates
	/TrabajosPracticos
		/TrabajoPractico1
		/TrabajoPracticoN
			/Correcciones
			/Entregas
			/Enunciados
			/Templates
/Otros
```

---

## 🏷️ Convencion de nombrado

**Principios**

* Los archivos deben nombrarse de forma descriptiva, evitando nombres genéricos como documento1.pdf o resumen.docx.*
* Evitar espacios y tildes. Usar PascalCase junto con snake-case para presentaciones y resumenes.

**Formato general**

```text
<Tema|Descripcion><ext>
```

**Ejemplos rápidos**

```text
ResumenSCMTomasTealdi.pdf
Presentacion01_NombreDeLaPresentacion.pdf
```

---

## 🗺️ Dónde va cada tipo de archivo

* **Apuntes** → `APUNTES/`

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
* **Otros** → `Otros/`


---

## 🧱 Baselines y versionado

**Cuándo fijar una Baseline (BL)**

* Tras corrección/devolución de **Parciales** y **TPs**.
* Al cerrar una **Unidad** o hito de cursada (opcional).

---

## 🔧 Commits y ramas

**Prefijos de commit**:

| Prefijo     | Uso                                         | Ejemplo                                                     |
| ----------- | ------------------------------------------- | ----------------------------------------------------------- |
| `docs/`     | Altas/cambios en documentación              | `docs/agregar RES_Parcial2_Algoritmos_2025.pdf` |
| `fix/`      | Correcciones de nombres, typos, links       | `fix/corregir nombre de entrega`                      |
| `feat/`     | Plantillas, scripts de apoyo                | `feat/agregar TP1_TMP_PlantillaInforme.docx`    |
| `refactor/` | Reorganizar sin cambiar contenido académico | `refactor/separar U01 y U02`                      |

**Ramas**

* Base: `main`.
* Nomenclatura: `<Prefijo>/<Descripcion tarea>`

  * `docs/cambio fechas`
  * `docs/agrego enunciados`
  * `fix/renombre resumen p1`

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
