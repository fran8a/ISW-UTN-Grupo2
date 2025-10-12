import sqlite3

conn = sqlite3.connect(":memory:", check_same_thread=False)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("PRAGMA foreign_keys = ON;")  


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
    requiere_talla BOOLEAN NOT NULL DEFAULT 0
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


actividades = [
    ("Tirolesa", 1),
    ("Safari", 0),
    ("Palestra", 1),
    ("Jardinería", 0),
]
cursor.executemany(
    "INSERT INTO Actividad (nombre, requiere_talla) VALUES (?, ?)",
    actividades
)
conn.commit()


cursor.execute("SELECT id, nombre FROM Actividad")
acts = {nombre: _id for _id, nombre in cursor.fetchall()}


horarios = [
    ( "10:00",),
    ( "16:00",),
    ( "11:00",),
    ( "15:30",),
    ( "09:30",),
    ( "14:00",),
]
cursor.executemany(
    "INSERT INTO Horario (hora) VALUES (?)",
    horarios
)


horarios_actividades = [
    (1, 1, 5, "2025-11-19"),
    (1, 3, 5, "2025-10-19"),
    (2, 6, 1, "2025-10-18"),
    (3, 2, 8, "2025-10-18"),
    (4, 5, 10, "2025-10-17"),
]
cursor.executemany(
    "INSERT INTO horarios_x_actividades (id_actividad, id_horario, cupos, fecha) VALUES (?, ?, ?, ?)",
    horarios_actividades
)


conn.commit()
