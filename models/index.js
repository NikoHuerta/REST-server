const Categoria = require('./categoria');
const Role = require('./role');
const Usuario = require('./usuario');
const Server = require('./server');
const Producto = require('./producto');
const ChatMensajes = require('./chat-mensajes');


// No se exporta un objeto, sino que directamente se exporta el modelo y no es necesario usar la desestructuración:
module.exports = {
    Categoria,
    Role,
    Server,
    Usuario,
    Producto,
    ChatMensajes
}