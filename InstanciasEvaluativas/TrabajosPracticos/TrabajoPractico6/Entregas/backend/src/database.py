# database.py
import sqlite3
from datetime import datetime, timedelta

# -------------------------------------------------------------
# 1. Conexión e inicialización de la base de datos en memoria
# -------------------------------------------------------------
conn = sqlite3.connect(":memory:", check_same_thread=False)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Activar claves foráneas
tcursor = conn.cursor()
cursor.execute("PRAGMA foreign_keys = ON;")

# -------------------------------------------------------------
# 2. Creación de tablas
# -------------------------------------------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS Visitante (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    edad INTEGER NOT NULL,
    talla TEXT
)
""")


cursor.execute("""
CREATE TABLE IF NOT EXISTS Actividad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    requiere_talla BOOLEAN NOT NULL DEFAULT 0,
    terminos_y_condiciones TEXT,
    descripcion TEXT
)
""")


cursor.execute("""
CREATE TABLE IF NOT EXISTS Horario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hora TEXT NOT NULL,            
    UNIQUE (hora)
)
""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS horarios_x_actividades(
               id_actividad INTEGER NOT NULL,
               id_horario INTEGER NOT NULL,
               fecha DATE NOT NULL,
               cupos INTEGER NOT NULL,
               PRIMARY KEY (id_actividad, id_horario, fecha),
               FOREIGN KEY (id_actividad) REFERENCES Actividad (id) ON DELETE CASCADE,
               FOREIGN KEY (id_horario) REFERENCES Horario (id) ON DELETE CASCADE
    )
""")


cursor.execute("""
CREATE TABLE IF NOT EXISTS Inscripcion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitante_id INTEGER NOT NULL,
    horario_id INTEGER NOT NULL,
    actividad_id INTEGER NOT NULL,
    fecha DATE NOT NULL, 
    UNIQUE (visitante_id, horario_id), -- evita doble inscripción al mismo horario
    FOREIGN KEY (visitante_id) REFERENCES Visitante (id) ON DELETE CASCADE,
    FOREIGN KEY (horario_id) REFERENCES Horario (id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES Actividad (id) ON DELETE CASCADE
)
""")

# -------------------------------------------------------------
# 3. Carga de datos base: Actividades y Términos
# -------------------------------------------------------------

terminos = "La participación en la actividad implica el cumplimiento de las normas del parque. Se recomienda llevar vestimenta y calzado cómodos apropiados para la actividad. Los organizadores no se responsabilizan por objetos perdidos o daños personales menores. En caso de condiciones climáticas adversas, la actividad podrá ser reprogramada o cancelada. Al aceptar, autorizas el uso de imágenes en material promocional del parque."

actividades = [
    ("Tirolesa", 1, terminos, "Vuela sobre el parque en nuestra tirolesa y disfruta las vistas espectaculares. La actividad dura 1 hora e incluye instrucción, equipo certificado y supervisión."),
    ("Safari", 0, terminos, "Descubre la fauna del parque en un safari guiado de 2 horas. Incluye un guía experto y una experiencia educativa y emocionante."),
    ("Palestra", 1, terminos, "Escala en nuestra palestra y supera desafíos durante 1 hora 30 min. Equipo e instructores incluidos para mejorar tu técnica y celebrar cada ascenso."),
    ("Jardinería", 0, terminos, "Participa en una sesión de jardinería de 2 horas y aprende trucos de cultivo. Disfruta del ritmo tranquilo de la naturaleza y cultiva bienestar."),
]
cursor.executemany(
    "INSERT INTO Actividad (nombre, requiere_talla, terminos_y_condiciones, descripcion) VALUES (?, ?, ?, ?)",
    actividades
)

conn.commit()

# -------------------------------------------------------------
# 4. Carga de horarios: de 9:00 a 17:30, cada 30 minutos (18 horarios)
# -------------------------------------------------------------
horarios = [(f"{h:02d}:{m:02d}",) for h in range(9, 18) for m in (0, 30)]
cursor.executemany("INSERT INTO Horario (hora) VALUES (?)", horarios)
conn.commit()

# -------------------------------------------------------------
# 5. Generador de cupos por actividad y fecha
# -------------------------------------------------------------
def generar_horarios_actividades(fecha_inicio: str, fecha_fin: str):
    """Genera los horarios y cupos para todas las actividades entre dos fechas."""
    actividades_cupos = {
        1: 10, # Tirolesa 
        2: 8,  # Safari
        3: 10, # Palestra
        4: 12, # Jardinería
    }

    cursor.execute("SELECT id FROM Horario")
    horarios_ids = [row[0] for row in cursor.fetchall()]

    fecha_actual = datetime.strptime(fecha_inicio, "%Y-%m-%d")
    fin = datetime.strptime(fecha_fin, "%Y-%m-%d")

    while fecha_actual <= fin:
        # Omitir lunes (día de cierre del parque)
        if fecha_actual.weekday() != 0:
            fecha_str = fecha_actual.strftime("%Y-%m-%d")
            for act_id, cupo in actividades_cupos.items():
                for id_horario in horarios_ids:
                    cursor.execute(
                        "INSERT INTO horarios_x_actividades (id_actividad, id_horario, fecha, cupos) VALUES (?, ?, ?, ?)",
                        (act_id, id_horario, fecha_str, cupo)
                    )
        fecha_actual += timedelta(days=1)
    conn.commit()

# Generar datos desde el 1 al 30 de octubre de 2025
generar_horarios_actividades("2025-10-01", "2025-10-30")


print("Base de datos generada con horarios desde 9:00 a 17:30 y cupos por actividad actualizados.")




