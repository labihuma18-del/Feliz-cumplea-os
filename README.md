# Feliz cumpleaños, tío Jadiel 🍷

Un regalo digital: se abre una caja, estalla el confeti y aparecen la torta de chocolate y la botella de vino de la tradición familiar. Después vienen la felicitación con fecha, la carta con sello de lacre, el carrusel de fotos, los deseos y un brindis final.

## Qué hay en la carpeta

```
index.html            ← la página
css/styles.css        ← el diseño
js/config.js          ← TODO lo que se personaliza (textos, fecha, fotos, música)
js/main.js            ← animaciones e interacción
assets/images/        ← aquí van foto-1.jpg, foto-2.jpg, foto-3.jpg
assets/audio/         ← aquí va musica.mp3
.nojekyll             ← para que GitHub Pages sirva todo tal cual
```

## Personalizar

1. **Fotos**: copia tres fotos a `assets/images/` con estos nombres exactos: `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg`. Funcionan mejor en vertical (proporción 4:5). Si falta alguna, se muestra un marco elegante con la inicial.
2. **Música**: copia la canción a `assets/audio/musica.mp3`. Si no la pones, el reproductor toca una caja musical con «Feliz cumpleaños».
3. **Textos y fecha**: abre `js/config.js` y cambia lo que está entre comillas: la fecha (`"2026-10-15"`, formato AAAA-MM-DD), la carta, los pies de foto, los deseos y el título de la canción.
4. **Fecha desde la página**: tocando la fecha aparece un calendario. Ese cambio se guarda solo en ese navegador. Para que todos vean la misma fecha, cámbiala en `config.js`, o comparte el enlace con `?fecha=2026-10-20` al final.

> Los nombres de archivo distinguen mayúsculas: `Foto-1.JPG` no es lo mismo que `foto-1.jpg` en GitHub Pages.

## Probar en tu computadora

Abre `index.html` con doble clic. Para que todo funcione igual que en internet, mejor con un servidor local:

```bash
cd cumple-tio-jadiel
python3 -m http.server 8000
# luego abre http://localhost:8000
```

(En VS Code también sirve la extensión «Live Server».)

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `cumple-tio-jadiel` (público).
2. Sube **el contenido** de esta carpeta (que `index.html` quede en la raíz del repositorio). Desde la web: *Add file → Upload files*, arrastra todo y confirma con *Commit changes*. O por terminal:
   ```bash
   git init
   git add .
   git commit -m "Regalo para el tío Jadiel"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/cumple-tio-jadiel.git
   git push -u origin main
   ```
3. En el repositorio ve a **Settings → Pages**, en *Build and deployment* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
4. En uno o dos minutos la página estará en `https://TU-USUARIO.github.io/cumple-tio-jadiel/`.

## Detalles de la experiencia

- **El regalo** se abre con un toque. El interruptor «Abrir con música» decide si la música empieza al abrirlo; si está apagado, se activa con el botón dorado de la esquina.
- **La vela**: tócala para soplarla (y otra vez para volver a encenderla).
- **La botella**: tócala para descorcharla y servir la copa.
- **El nombre** «Tío Jadiel» lanza destellos al tocarlo.
- **La carta** se abre rompiendo el sello de lacre.
- **El brindis** final choca las copas.
- Se adapta a celular, respeta la opción «reducir movimiento» del sistema y no usa librerías externas (solo Google Fonts).
