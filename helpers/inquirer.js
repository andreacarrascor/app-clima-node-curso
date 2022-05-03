const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1'.brightMagenta}. Buscar ciudad` 
            },
            {
                value: 2,
                name: `${'2'.brightMagenta}. Historial`
            },
            {
                value: 0,
                name: `${'0'.brightMagenta}. Salir` 
            }

        ]
    }
]

const inquirerMenu = async() => {
    console.clear();
    console.log('================================'.brightMagenta);
    console.log('     Seleccione una opción     '.brightWhite);
    console.log('================================\n'.brightMagenta);

    const {opcion} = await inquirer.prompt(questions);

    return opcion;
}

const inquirerPause = async() => {

    const questionToContinue = [
        {
            type: 'input',
            name: 'input',
            message: `Presione ${'ENTER'.brightGreen} para continuar`,
        }
    ]
    console.log('\n');
    await inquirer.prompt(questionToContinue);

}

const readInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;

}

const listPlaces = async (places = []) => {

    const choices = places.map((place, i) => {
        const idx = `${i+1}.`.brightMagenta;
        return {
            value: place.id,
            name:`${idx} ${place.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.brightMagenta + 'Cancelar'
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(questions);
    return id;

}








module.exports = {
    inquirerMenu,
    inquirerPause,
    readInput,
    listPlaces
}