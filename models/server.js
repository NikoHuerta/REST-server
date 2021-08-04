const express = require('express'); //minimalist web framework for Node.js applications
const cors = require('cors'); //CORS-> Cross-origin resource sharing (CORS) 


class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    middlewares(){

        //CORS-> Cross-origin resource sharing (CORS) 
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio Público
        this.app.use(express.static('public'));

    }

    routes(){

        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    listen(){

        this.app.listen(this.port, () => {
            console.log("Server running in port ", this.port);
        });

    }
}



module.exports = {
    Server
}