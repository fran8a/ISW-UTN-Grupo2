# EcoHarmony Park - Sistema de Compra de Entradas

## Descripción
Sistema completo para la compra de entradas al bioparque EcoHarmony Park, desarrollado con:
- **Backend**: FastAPI (Python)
- **Frontend**: React (Mobile-first)

## Estructura del Proyecto
```
.
├── backend/
│   ├── src/
│   │   ├── main.py          # API FastAPI
│   │   └── model.py         # Modelos de negocio
│   ├── test/                # Tests existentes
│   └── requirements.txt     # Dependencias Python
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # API calls
│   │   ├── App.js          # Componente principal
│   │   └── index.js        # Punto de entrada
│   └── package.json        # Dependencias Node
└── README.md
```

## Características Implementadas

### Backend (FastAPI)
- ✅ Registro de usuarios con validación de email y contraseña
- ✅ Sistema de login/autenticación
- ✅ Compra de entradas con validación de límites (máx. 10 entradas)
- ✅ Cálculo automático de precios por edad
- ✅ API REST con endpoints documentados
- ✅ CORS configurado para comunicación con frontend

### Frontend (React)
- ✅ Diseño mobile-first responsivo
- ✅ Interfaz de registro/login con tabs
- ✅ Formulario de compra de entradas intuitivo
- ✅ Gestión dinámica de visitantes (agregar/eliminar)
- ✅ Cálculo de precios en tiempo real
- ✅ Validación de formularios
- ✅ Manejo de errores y mensajes de éxito

## Instalación y Ejecución

### Backend
```bash
cd backend
pip install -r requirements.txt
cd src
python main.py
```
El backend estará disponible en `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm start
```
El frontend estará disponible en `http://localhost:3000`

## API Endpoints

- `POST /registro` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `POST /comprar-entradas` - Realizar compra de entradas
- `GET /precios` - Obtener información de precios
- `GET /` - Health check de la API

## Precios por Edad
- Menores de 3 años: Gratis
- Niños (3-12 años): $15.000
- Adultos (13-65 años): $30.000
- Mayores de 65 años: $20.000

## Funcionalidades
1. **Registro de Usuario**: Email válido y contraseña mínimo 6 caracteres
2. **Compra de Entradas**: Selección de fecha, gestión de visitantes por edad
3. **Formas de Pago**: Efectivo (en boletería) o Tarjeta (Mercado Pago)
4. **Validaciones**: Máximo 10 entradas por compra, fechas futuras únicamente
5. **Responsive Design**: Optimizado para dispositivos móviles