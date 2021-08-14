const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();


const socketController = async ( socket = new Socket(), io )=> {
    
    const usuario = await comprobarJWT(socket.handshake.headers['api-key']);
    if(!usuario){
        socket.disconnect();
    }
    
    //agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //conectarlo a una sala especial
    //3 salas, Global, socket.id, usuario.id
    socket.join( usuario.id ); //


    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });
    
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if(uid){
            //mensaje privado
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre , mensaje })
        }else{
            chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

        
    });

    

    
    
    

    



}

module.exports = {
    socketController
}