

const url = (window.location.href.includes('localhost')) ? 
'http://localhost:8080/api/auth/' 
: 'https://rest-server-nhf.herokuapp.com/api/auth/';


let usuario = null;
let socket = null;

//Referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const ulMensajesPrivados = document.querySelector("#ulMensajesPrivados");
const btnSalir = document.querySelector("#btnSalir");


//validar token de localstorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';
    
    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: {'api-key': token}
    });


    const { usuario: userDB, token: tokenDB  } = await resp.json();
    console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    await conectarSocket();


}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'api-key': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes); //se envia payload de respuesta

    socket.on('usuarios-activos', dibujarUsuarios); //se envia payload de respuesta

    socket.on('mensaje-privado', dibujarMensajePrivado);
}

const dibujarUsuarios= ( usuarios = [] ) => {
    let usersHTML = '';
    usuarios.forEach(({ nombre, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${ nombre }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHTML;

    // console.log(ulUsuarios.children.length);
    // console.log(ulUsuarios.children);
    // console.log(ulUsuarios.children[0].);
    // console.log(ulUsuarios.children[1]);

}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    
    const mensaje = txtMensaje.value.trim();
    const uid = txtUid.value;
    
    if(keyCode !== 13) return ;
    if(mensaje.length === 0) return;

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';

});

const dibujarMensajes= ( mensajes = [] ) => {
    let mensajesHTML = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }:</span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;
}

const dibujarMensajePrivado = ( {de, mensaje} )  => {
    
    const mensajesPrivadosHTML = ulMensajesPrivados.innerHTML;
    let mensajePrivado =    `<li>
                                <p>
                                    <span class="text-info">${ de }: </span>
                                    <span>${ mensaje }</span>
                                </p>
                            </li>`;
    ulMensajesPrivados.innerHTML = mensajesPrivadosHTML + mensajePrivado;
};

btnSalir.addEventListener('click', () => {
    localStorage.clear();
    window.location = 'index.html';
});






const main = async () => {

    await validarJWT();    
}


main();

//validar si JWT es correcto
// const socket = io();