const fs = require('fs');
const express = require('express');
const morgan = require('morgan')
const { response } = require('express');

const app = express();

app.get('/', (request, response) => {
    response.send(`<h1>Pagina Principal</h1>`);
})

app.get('/productos', async (request, response) => {
    const productos = await datos.getAll();
    response.send(productos);
})

app.get('/productoRamdom', async (request, response) =>{
    const productos = await datos.getAll();
    const seleccion = productos[Math.floor(Math.random() * productos.length)];
    response.send(seleccion);
})

const server = app.listen(8080, () => {
    console.log(`servidor escuchando en http://localhost:8080`);
})

class Contenedor {
    constructor(ruta) {
        this.ruta = ruta;
    }

    
    async getById(id) {
        const encontrado = await this.getAll();
        const indexObj = encontrado.findIndex((o) => o.id == id);

        if (indexObj == -1) {
            return 'Elemento no encontrado';
        } else {
            const resultado = JSON.stringify(encontrado[indexObj])
            console.log(JSON.parse(resultado))
            return 'Elementro mostrado con éxito';
        }

        
    }
    
    
    async getAll() {
        try {
            const objeto = await fs.promises.readFile(this.ruta, 'utf-8'); // se puede hacer require('fs/promises') y luego utilizar solo fs que utilizarar solo el metodo promises de fs
            // console.log(objeto);
            // console.log(JSON.parse(objeto));
            return JSON.parse(objeto)
        } catch (error) {
            return [];
        }
    }

    async save(obj){
        try {
            const objs = await this.getAll();

            let newId;
            if (objs.length == 0) {
                newId = 1
            } else {
                newId = objs[objs.length - 1].id + 1
            }
    
            const newObj = {id: newId, ...obj}
            objs.push(newObj);
    
            await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2));
            return 'elemento creado: ' + newId;
        } catch (error) {
            console.log('error al guardar')
        }
    }

    
    async deleteById(id) {
        try {
            const objs = await this.getAll();
            const indexObj = objs.findIndex((o)=> o.id == id);
            // console.log('elemento a eliminar ' + indexObj)
            
            if (indexObj == -1) {
        
            return 'Elemento no encontrado'
        } else {
            objs.splice(indexObj, 1);
            await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2)); 
            
        }
    } catch (error) {
        return 'Elemento no eliminado: '+ error;
    }
}
    async deleteAll() {
        const objs = [];
        await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2)); 

        return 'Eliminado todo'
}
}


const datos = new Contenedor('./productos.txt/');
// async function main() {
    
    // console.log(datos.ruta);
    // console.log('Se crean dos elementos');
    // console.log(await datos.save({"title": "poducto 4", "price": 1004, "thumbnail": "(url de la foto del producto)"}));
    // console.log(await datos.save({"title": "poducto 5", "price": 1005, "thumbnail": "(url de la foto del producto)"}));
    // console.log('Se muestran los elementos que ahora existen en el archivo: ')
    // console.log(await datos.getAll());
    // console.log('Se eleminia el primer elemento')
    // console.log(await datos.deleteById(1));
    // console.log('Ahora no existe el elemento con id: 1')
    // console.log(await datos.getAll());
    // console.log('Ahora se muestra el elemento id: 2')
    // console.log(await datos.getById(2));
    // console.log('Ahora se eliminan todos los objetos del archivo')
    // console.log(await datos.deleteAll());
    // console.log('Se muestran los elementos que ahora existen en el archivo: ')
    // console.log(await datos.getAll());
// }

// main();