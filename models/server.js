const express = require('express'); //minimalist web framework for Node.js applications
const cors = require('cors'); //CORS-> Cross-origin resource sharing (CORS) 

const { validarJSON } = require('../middlewares/validar-json');



const { dbConnection } = require('../db/config');


class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
        }

        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';
        // this.categoriasPath = '/api/categorias';
        
        //Conectar a DB
        this.connectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async connectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS-> Cross-origin resource sharing (CORS) 
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Validacion de JSON req
        this.app.use(validarJSON);

        //Directorio Público
        this.app.use(express.static('public'));

    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));

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