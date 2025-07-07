
function Manual() {

    const name= "jairControle, que se vea bien chevere el pdf";
    return (
        <>
        <div className="manual">
            <h1>Manual de Usuario</h1>
            <p>Bienvenido al manual de usuario. Aquí encontrarás toda la información necesaria para utilizar nuestra aplicación.</p>
            
            <ul>
               
                <li>Cómo registrarse</li>
                <li>Cómo iniciar sesión</li>
                <li>Cómo navegar por la aplicación</li>
                <li>Cómo contactar con soporte</li>
            </ul>
            
        </div>
        <embed src="manual2.pdf" type="application/pdf" width="100%" height="600px"></embed>
        </>
    );
}

export default Manual;