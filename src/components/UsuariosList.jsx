import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const irA = useNavigate();

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = () => {
    fetch('https://34.227.104.48/usuarios/obtener', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          setMensaje(data.error);
        } else {
          setUsuarios(data);
        }
      })
      .catch(err => {
        console.error('Error al traer usuarios:', err);
        setMensaje('No se pudieron cargar los usuarios.');
      });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('access_token');
    irA('/login');
  };

  const eliminarUsuario = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    fetch(`https://34.227.104.48/usuarios/eliminar/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMensaje(data.message);
          obtenerUsuarios(); // recargar lista
        } else {
          setMensaje(data.error || 'Error al eliminar');
        }
      })
      .catch(err => {
        console.error('Error al eliminar:', err);
        setMensaje('No se pudo eliminar el usuario.');
      });
  };

  return (
    <div className="lista-usuarios">
      <img src="/usuarios.png" alt="Lista" className="imagen-usuarios" />
      <h2>Usuarios Registrados</h2>

      <button onClick={cerrarSesion} className="btn-cerrar-sesion">Salir</button>

      {mensaje && <p className="texto-error">{mensaje}</p>}

      {usuarios.length > 0 ? (
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => eliminarUsuario(u.id)} className="btn-eliminar">Eliminar</button>
                  {/* Si luego quieres implementar editar, puedes agregar aquí también el botón */}
                  {/* <button onClick={() => editarUsuario(u.id)} className="btn-editar">Editar</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="sin-datos">No hay usuarios para mostrar.</p>
      )}
    </div>
  );
};

export default UsuariosList;
