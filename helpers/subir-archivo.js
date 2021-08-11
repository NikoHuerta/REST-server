const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif','pdf'], carpeta = '' ) => {


    return new Promise( (resolve, reject  ) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];

        //validar la extension
        if( !extensionesValidas.includes(extension) ){
            return reject(`La extension ${extension} no es soportada, su archivo no puede ser subido`);
        }

        const nombreFinal = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreFinal);


        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreFinal);
        });

    });

    

}


module.exports = {
    subirArchivo
}