import express from 'express';
import { engine } from 'express-handlebars';
import { __dirname } from './util.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Estas variables se envían a la plantilla, como en el ejemplo de clase.
const username = 'EJEMPLO';
const cajaMensajes = [];

app.engine('handlebars', engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Permite leer los campos del formulario y servir el archivo CSS.
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/../public`));

function mostrarInicio(res, cajaTexto = '', error = '') {
    res.render('index', {
        title: 'Caja de mensajes',
        publicidad: 'PUBLICIDAD',
        username: username,
        placeholder: 'INGRESE EL MENSAJE',
        cajaTexto: cajaTexto,
        cajaMensajes: cajaMensajes,
        error: error
    });
}

app.get('/', (req, res) => {
    mostrarInicio(res);
});

app.post('/mensajes', (req, res) => {
    const cajaTexto = typeof req.body?.mensaje === 'string'
        ? req.body.mensaje.trim()
        : '';

    if (!cajaTexto) {
        res.status(400);
        return mostrarInicio(res, cajaTexto, 'Escribe un mensaje antes de enviarlo.');
    }

    if (cajaTexto.length > 500) {
        res.status(400);
        return mostrarInicio(res, cajaTexto, 'El mensaje debe tener máximo 500 caracteres.');
    }

    cajaMensajes.push({ numero: cajaMensajes.length + 1, texto: cajaTexto });

    // Volver por GET evita repetir el envío al actualizar la página.
    res.redirect(303, '/');
});

const server = app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${server.address().port}`);
});
