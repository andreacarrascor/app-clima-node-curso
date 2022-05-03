require('dotenv').config()

const { readInput, inquirerMenu, inquirerPause, listPlaces } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {

    const busquedas = new Busquedas();
    let opt;
    
    do {
        opt = await inquirerMenu();

        switch(opt) {

            case 1:
                //Mostrar mensaje
                const terminoDeBusqueda = await readInput('Ciudad: ');
                //Buscar los lugares
                const lugares = await busquedas.ciudad(terminoDeBusqueda);
                //Seleccionar el lugar
                const id = await listPlaces(lugares);
                if(id === '0') continue;
                const lugarSelec = lugares.find(l => l.id === id); 
                // Guardar en DB
                busquedas.agregarHistorial(lugarSelec.nombre);

                //Datos del clima
                const clima = await busquedas.climaLugar(lugarSelec.lat, lugarSelec.lng)
                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.brightGreen);
                console.log('Ciudad:', lugarSelec.nombre.brightMagenta);
                console.log('Lat:', lugarSelec.lat);
                console.log('Lon:', lugarSelec.lng);
                console.log('Temperatura:', clima.temp );
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Descripción:', clima.desc.brightMagenta);
            break;
    
            case 2:
                busquedas.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.brightMagenta;
                    console.log(`${idx} ${lugar}`);
                })
            break;
    
        }

        await inquirerPause();

    } while (opt !== 0);
    

}




main();