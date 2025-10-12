import React, { useState, useEffect } from 'react';
import { comprarEntradas, obtenerPrecios } from '../services/api';

const CompraEntradas = ({ email, onCerrarSesion }) => {
  const [fechaVisita, setFechaVisita] = useState('');
  const [edadesVisitantes, setEdadesVisitantes] = useState([25]);
  const [formaPago, setFormaPago] = useState('efectivo');
  const [precios, setPrecios] = useState({});
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarPrecios();
  }, []);

  const cargarPrecios = async () => {
    try {
      const data = await obtenerPrecios();
      setPrecios(data.precios);
    } catch (error) {
      setError('Error al cargar precios');
    }
  };

  const calcularPrecio = (edad) => {
    if (edad < 3) return precios.menores_3 || 0;
    if (edad <= 12) return precios.niños_3_12 || 0;
    if (edad <= 65) return precios.adultos_13_65 || 0;
    return precios.mayores_65 || 0;
  };

  const calcularTotal = () => {
    return edadesVisitantes.reduce((total, edad) => total + calcularPrecio(edad), 0);
  };

  const agregarVisitante = () => {
    if (edadesVisitantes.length < 10) {
      setEdadesVisitantes([...edadesVisitantes, 25]);
    }
  };

  const eliminarVisitante = (index) => {
    if (edadesVisitantes.length > 1) {
      const nuevasEdades = edadesVisitantes.filter((_, i) => i !== index);
      setEdadesVisitantes(nuevasEdades);
    }
  };

  const actualizarEdad = (index, edad) => {
    const nuevasEdades = [...edadesVisitantes];
    nuevasEdades[index] = parseInt(edad) || 0;
    setEdadesVisitantes(nuevasEdades);
  };

  const manejarCompra = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setExito('');

    try {
      const resultado = await comprarEntradas(email, fechaVisita, edadesVisitantes, formaPago);
      setExito(`¡Compra realizada exitosamente! Total: $${resultado.monto_total.toLocaleString()}`);
      
      setFechaVisita('');
      setEdadesVisitantes([25]);
      setFormaPago('efectivo');
    } catch (error) {
      setError(error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerFechaMinima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Comprar Entradas</h2>
          <button 
            onClick={onCerrarSesion}
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}
          >
            Cerrar Sesión
          </button>
        </div>
        
        <p style={{ marginBottom: '20px', color: '#666' }}>Bienvenido: {email}</p>

        {error && <div className="error">{error}</div>}
        {exito && <div className="success">{exito}</div>}

        <form onSubmit={manejarCompra}>
          <div className="form-group">
            <label>Fecha de visita:</label>
            <input
              type="date"
              value={fechaVisita}
              onChange={(e) => setFechaVisita(e.target.value)}
              min={obtenerFechaMinima()}
              required
            />
          </div>

          <div className="form-group">
            <label>Visitantes (máximo 10):</label>
            {edadesVisitantes.map((edad, index) => (
              <div key={index} className="edad-input">
                <span>Visitante {index + 1}:</span>
                <input
                  type="number"
                  value={edad}
                  onChange={(e) => actualizarEdad(index, e.target.value)}
                  min="0"
                  max="120"
                  required
                />
                <span>años</span>
                {edadesVisitantes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarVisitante(index)}
                    style={{ 
                      background: '#fee', 
                      color: '#c53030', 
                      border: 'none', 
                      borderRadius: '5px', 
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            
            {edadesVisitantes.length < 10 && (
              <div className="btn-add" onClick={agregarVisitante}>
                + Agregar visitante
              </div>
            )}
          </div>

          {Object.keys(precios).length > 0 && (
            <div className="precio-info">
              <h3>Información de precios:</h3>
              <div className="precio-item">
                <span>Menores de 3 años:</span>
                <span>Gratis</span>
              </div>
              <div className="precio-item">
                <span>Niños (3-12 años):</span>
                <span>${precios.niños_3_12?.toLocaleString()}</span>
              </div>
              <div className="precio-item">
                <span>Adultos (13-65 años):</span>
                <span>${precios.adultos_13_65?.toLocaleString()}</span>
              </div>
              <div className="precio-item">
                <span>Mayores de 65 años:</span>
                <span>${precios.mayores_65?.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="total">
            Total a pagar: ${calcularTotal().toLocaleString()}
          </div>

          <div className="form-group">
            <label>Forma de pago:</label>
            <select
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              required
            >
              <option value="efectivo">Efectivo (en boletería)</option>
              <option value="tarjeta">Tarjeta (Mercado Pago)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={cargando}
          >
            {cargando ? 'Procesando compra...' : 'Comprar Entradas'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompraEntradas;