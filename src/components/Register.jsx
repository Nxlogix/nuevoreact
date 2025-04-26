import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [alerta, setAlerta] = useState('');
  const navegar = useNavigate();

  const actualizarCampo = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();

    if (!usuario.nombre || !usuario.email || !usuario.password) {
      setAlerta('Todos los campos son obligatorios.');
      return;
    }

    try {
      const respuesta = await fetch('https://34.227.104.48/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });

      const resultado = await respuesta.json();

      if (resultado.error) {
        setAlerta(resultado.error);
      } else {
        setAlerta('Registro exitoso');
        navegar('/login');
      }
    } catch (err) {
      console.error('Error al registrarse:', err);
      setAlerta('Error del servidor. Intenta más tarde.');
    }
  };

  return (
    <section className="contenedor-login">
      <img src="/presentacion.jpg" alt="Imagen de bienvenida" className="imagen-login" />
      <h2>Crea tu cuenta</h2>
      {alerta && <div className="mensaje-alerta">{alerta}</div>}

      <form onSubmit={enviarFormulario} className="formulario-login">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={usuario.nombre}
          onChange={actualizarCampo}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={usuario.email}
          onChange={actualizarCampo}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={usuario.password}
          onChange={actualizarCampo}
        />
        <button type="submit">Registrarse</button>
      </form>

      <div className="botones-navegacion">
        <Link to="/login" className="btn-secundario">¿Ya tienes cuenta? Inicia sesión</Link>
        <Link to="/" className="btn-secundario">Volver al Inicio</Link>
      </div>
    </section>
  );
};

export default Registro;
