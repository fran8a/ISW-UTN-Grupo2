import React, { useState } from 'react';
import { iniciarSesion, registrarUsuario } from '../services/api';

const Login = ({ onLogin }) => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      if (esRegistro) {
        await registrarUsuario(email, contraseña);
        setError('');
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        setEsRegistro(false);
      } else {
        await iniciarSesion(email, contraseña);
        onLogin(email);
      }
    } catch (error) {
      setError(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${!esRegistro ? 'active' : ''}`}
          onClick={() => setEsRegistro(false)}
        >
          Iniciar Sesión
        </button>
        <button 
          className={`nav-tab ${esRegistro ? 'active' : ''}`}
          onClick={() => setEsRegistro(true)}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={manejarSubmit}>
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>
        
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            placeholder="Mínimo 6 caracteres"
            minLength="6"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={cargando}
        >
          {cargando ? 'Procesando...' : (esRegistro ? 'Registrarse' : 'Iniciar Sesión')}
        </button>
      </form>
    </div>
  );
};

export default Login;