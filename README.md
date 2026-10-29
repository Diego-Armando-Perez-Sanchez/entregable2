# Entregable 2: caja de mensajes

Interfaz basada en la imagen del profesor, siguiendo la configuración de
`clase_motor_plantilla`: módulos ES, Express, `express-handlebars`, vistas y layout.

## Diseño

La referencia visual es [It's Not Violent, escenario 4](https://itsnotviolent.com/scenarios/4).
Se adaptaron su paleta coral (`#c75e5e` y `#f77171`), rosa (`#ffbecf`), amarillo
(`#f7c749`), verde (`#35af60`) y negro (`#231f20`), junto con la composición de
burbujas, cintas inclinadas y stickers.

El CSS recrea el desplazamiento de la cinta, el movimiento del sticker,
los puntos de escritura y la aparición del último
mensaje. El botón «Pausar movimiento» permite detener las animaciones. También
se respeta `prefers-reduced-motion`.

La fuente Sporting Grotesque se sirve localmente desde `public/fonts`, junto con
su licencia SIL OFL y créditos de [Velvetyne](https://github.com/velvetyne/Sporting-Grotesque).

La interfaz utiliza todo el ancho y alto disponible (`100%` y `100dvh`), sin un
ancho máximo para el contenedor. La conversación está centrada y conserva las
dimensiones que tenía en la distribución de dos columnas. La cinta animada pasa
por detrás y el sticker «TU VOZ CUENTA» está abajo a la derecha. En móviles el
sticker queda debajo de la caja para no tapar los controles. La caja de mensajes
tiene desplazamiento interno.

## Ejecutar

Clona el repositorio y entra en la carpeta del proyecto:

```powershell
git clone https://github.com/Diego-Armando-Perez-Sanchez/entregable2.git
cd entregable2
```

Instala las dependencias y ejecuta el servidor:

```powershell
npm install
npm start
```

Abre http://localhost:3000. Para reiniciar automáticamente al editar el servidor,
usa `npm run dev` en lugar de `npm start`.

## Variables y funcionamiento

- `username`: contiene `EJEMPLO`. Puedes cambiarlo en `src/index.js`.
- `cajaTexto`: contiene el texto recibido del formulario. Se envía también a la
  vista para conservarlo si hay un error de validación.
- `cajaMensajes`: arreglo de objetos con el número y el texto de cada mensaje.
  Sus títulos se muestran como `MENSAJE 1`, `MENSAJE 2`, etc.
- `publicidad` y `placeholder`: textos enviados desde Express a la vista.

1. `GET /` renderiza `index.handlebars` dentro de `layouts/main.handlebars`.
2. El formulario envía el campo `mensaje` mediante `POST /mensajes`.
3. `express.urlencoded` permite leerlo desde `req.body`.
4. El servidor rechaza mensajes vacíos o de más de 500 caracteres.
5. El mensaje válido se agrega a `cajaMensajes` y el servidor redirige a `/`.
6. Handlebars recorre el arreglo con `{{#each cajaMensajes}}` para mostrarlo abajo.
   Las expresiones `{{this.texto}}` escapan el HTML ingresado por el usuario.

El texto de ayuda del campo se oculta al seleccionarlo con el mouse o con Tab.
Si el campo queda vacío, vuelve a aparecer al salir. El contenido que escribas no
se borra al volver a seleccionar el campo. Esto se controla con CSS usando
`:focus::placeholder`.

Los mensajes se guardan en memoria: permanecen al actualizar la página, se
comparten entre quienes abran este servidor y se borran al reiniciarlo. Para esta
tarea no se utiliza una base de datos.

`public/js/mensajes.js` mejora el formulario con `fetch`: envía a la misma ruta
de Express, recibe el HTML renderizado por Handlebars y actualiza la lista sin
recargar toda la página. Así se anima únicamente la última burbuja. También
muestra el contador de caracteres y el estado del envío. Sin JavaScript, el
formulario sigue funcionando mediante POST y redirección.

## Archivos

- `src/index.js`: servidor, variables, validación y rutas.
- `src/util.js`: ruta absoluta de la carpeta `src`, igual al ejemplo de clase.
- `src/views/layouts/main.handlebars`: estructura HTML y enlace al CSS.
- `src/views/index.handlebars`: interfaz y variables de Handlebars.
- `public/css/styles.css`: colores, distribución y adaptación a pantallas pequeñas.
- `public/js/mensajes.js`: envío sin recarga, contador y control de movimiento.
- `public/fonts/`: Sporting Grotesque, licencia y créditos.
