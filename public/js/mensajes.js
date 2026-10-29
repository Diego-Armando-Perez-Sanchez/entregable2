// El formulario sigue funcionando con Express y Handlebars sin JavaScript.
// Esta mejora permite animar los mensajes sin recargar toda la página.
const formulario = document.querySelector('.formulario');
const campo = document.querySelector('#mensaje');
const caja = document.querySelector('.caja-mensajes');
const conversacion = document.querySelector('.conversacion');
const botonEnviar = document.querySelector('.boton-enviar');
const errorMensaje = document.querySelector('#error-mensaje');
const estado = document.querySelector('.estado-formulario');
const caracteres = document.querySelector('[data-caracteres]');
const botonPausa = document.querySelector('[data-pausar]');
const preferenciaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

function irAlUltimoMensaje(animar = false) {
    const reducir = preferenciaMovimiento.matches
        || document.documentElement.classList.contains('movimiento-pausado');
    caja.scrollTo({
        top: caja.scrollHeight,
        behavior: animar && !reducir ? 'smooth' : 'instant'
    });
}

function actualizarCaracteres() {
    caracteres.textContent = `${campo.value.length} / 500`;
}

actualizarCaracteres();
irAlUltimoMensaje();
campo.addEventListener('input', actualizarCaracteres);

// Las animaciones pueden detenerse además de respetar la preferencia del sistema.
botonPausa.hidden = false;
botonPausa.addEventListener('click', () => {
    const pausado = document.documentElement.classList.toggle('movimiento-pausado');
    botonPausa.setAttribute('aria-pressed', String(pausado));
    botonPausa.querySelector('[data-texto-pausa]').textContent = pausado
        ? 'Reanudar movimiento'
        : 'Pausar movimiento';
    botonPausa.querySelector('[data-icono-pausa]').textContent = pausado ? '▶' : 'Ⅱ';
});

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (botonEnviar.disabled) return;

    botonEnviar.disabled = true;
    campo.readOnly = true;
    formulario.setAttribute('aria-busy', 'true');
    conversacion.classList.add('enviando');
    errorMensaje.hidden = true;
    estado.textContent = 'Enviando tu mensaje…';

    try {
        // Se usa la misma ruta POST: Express valida y Handlebars genera el HTML.
        const respuesta = await fetch(formulario.action, {
            method: 'POST',
            body: new URLSearchParams(new FormData(formulario))
        });
        const html = await respuesta.text();
        const pagina = new DOMParser().parseFromString(html, 'text/html');

        if (!respuesta.ok) {
            throw new Error(pagina.querySelector('#error-mensaje')?.textContent
                || 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
        }

        const nuevaCaja = pagina.querySelector('.caja-mensajes');
        const nuevoTotal = pagina.querySelector('[data-total-mensajes]');
        if (!nuevaCaja || !nuevoTotal) {
            throw new Error('No se pudo actualizar la lista. Recarga la página para ver tus mensajes.');
        }

        // El texto ingresado ya viene escapado por Handlebars.
        caja.replaceChildren(...Array.from(nuevaCaja.childNodes,
            (nodo) => document.importNode(nodo, true)));
        document.querySelectorAll('[data-total-mensajes]').forEach((contador) => {
            contador.textContent = nuevoTotal.textContent;
        });
        campo.value = '';
        campo.removeAttribute('aria-invalid');
        campo.setAttribute('aria-describedby', 'ayuda-mensaje');
        errorMensaje.textContent = '';
        actualizarCaracteres();
        estado.textContent = `Mensaje ${nuevoTotal.textContent} enviado.`;
        irAlUltimoMensaje(true);
    } catch (error) {
        const falloDeRed = error instanceof TypeError;
        errorMensaje.textContent = falloDeRed
            ? 'No pudimos confirmar el envío. Recarga la página para revisar tus mensajes antes de volver a enviarlo.'
            : error.message;
        errorMensaje.hidden = false;
        campo.setAttribute('aria-describedby', 'ayuda-mensaje error-mensaje');
        estado.textContent = 'Revisa el aviso antes de continuar.';
    } finally {
        botonEnviar.disabled = false;
        campo.readOnly = false;
        formulario.removeAttribute('aria-busy');
        conversacion.classList.remove('enviando');
        campo.focus({ preventScroll: true });
    }
});
