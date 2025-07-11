

function DataAdmin({user}){
    return (
        <>
        <div>
        <h1>Bienvenido Administrador</h1>
        <p>UID: {user.uid}</p>
        <p>Nombre: {user.username || 'No definido'}</p>
        <p>Nombre: {user.email|| 'No definido'}</p>
      {/* Aquí puedes ponerles mensajes al  admin */}
    </div>
        </>
    )
}
export default DataAdmin;