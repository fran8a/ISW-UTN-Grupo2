import React, { useState } from 'react';
import Login from './components/Login';
import CompraEntradas from './components/CompraEntradas';

function App() {
  const [usuario, setUsuario] = useState(null);

  const manejarLogin = (email) => {
    setUsuario(email);
  };

  const manejarCerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🌿 EcoHarmony Park</h1>
        <p>Compra de entradas online</p>
      </div>

      {usuario ? (
        <CompraEntradas 
          email={usuario} 
          onCerrarSesion={manejarCerrarSesion}
        />
      ) : (
        <Login onLogin={manejarLogin} />
      )}
    </div>
  );
}

export default App;