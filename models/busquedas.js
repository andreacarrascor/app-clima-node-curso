const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath= './db/database.json';

    constructor(){
        // TODO: leer DB si existe
        this.leerDB();
        
    }

    get paramsMapbox() {
        return {
            'proximity': 'ip',
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get paramsWeather() {
        return  {
            'appid': process.env.OPENWEATHER_KEY,
            'units':'metric',
            'lang':'es'
        }
    }

    // este será el primer método para buscar un lugar
    //es asíncrono porque requiere hacer una petición http
    async ciudad (lugar = ''){

        try {
            // petición http
            const instance = axios.create({
                // hacemos una interpolación de strings para colocar el lugar que recibimos como argumento
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }        
    }

    async climaLugar(lat, lon) {

        try{

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            }) 
            
            const resp = await instance.get();
            const {weather, main} = resp.data
            
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = ''){

        if(this.historial.includes(lugar)){
            return;
        }
        this.historial = this.historial.splice(0, 5);
        
        this.historial.unshift(lugar);

        // Grabar en DB
        this.guardarDB();

    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {

        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {encoding : 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

    }
}




module.exports = Busquedas;