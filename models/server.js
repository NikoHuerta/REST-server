const express = require('express'); //minimalist web framework for Node.js applications
const cors = require('cors'); //CORS-> Cross-origin resource sharing (CORS) 
const fileUpload = require('express-fileupload');

const { validarJSON } = require('../middlewares/validar-json');



const { dbConnection } = require('../db/config');


class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            usuarios:   '/api/usuarios',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads',
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

        //Fileupload -- carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));


    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

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