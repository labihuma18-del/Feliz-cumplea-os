/* =========================================================
   PERSONALIZA AQUÍ TU REGALO
   Cambia los textos entre comillas. No borres las comas.
   ========================================================= */
window.GIFT_CONFIG = {

  // Nombre y cómo lo llaman
  nombre: "Jadiel",
  tratamiento: "Tío",

  // Fecha del cumpleaños (formato AAAA-MM-DD)
  fecha: "2026-10-15",

  // Quién envía el regalo
  deParte: "tus sobrinos",

  // ¿El interruptor "Abrir con música" empieza activado?
  musicaAlAbrir: true,

  // Música: pon tu canción en assets/audio/musica.mp3
  // Si el archivo no existe, suena una caja musical con "Feliz cumpleaños".
  musica: {
    archivo: "assets/audio/musica.mp3",
    titulo: "happy birthday"
  },

  // Fotografías del carrusel (si falta alguna, se muestra un marco elegante)
  fotos: [
    { src: "assets/images/foto-1.jpg", pie: "Encontramos apenas fotitos jejeje" },
    { src: "assets/images/foto-2.jpg", pie: "Momentos juntos" },
    { src: "assets/images/foto-3.jpg", pie: "Gracias por apoyarnos desde que eramos pequeños" }
  ],

  // La carta
  carta: {
    saludo: "Querido tío Jadiel:",
    parrafos: [
      "Hoy quisimos regalarte un pequeño rincón hecho solo para ti, con la torta de chocolate y la botella de vino que nunca faltan en nuestros cumpleaños solo falto el chanchito. Porque hay tradiciones que no se explican, se celebran.",
      "Gracias por todo tu apoyo. Por estar siempre presente, por tus consejos, tu paciencia y esa manera tan tuya de hacernos sentir en casa. Muchas de las cosas buenas que hemos vivido llevan un poquito de ti.",
      "En este nuevo año te deseamos felicidad y muchas cosas bonitas",
      "Que la vida te devuelva multiplicado todo el cariño que tú das. Te queremos muchísimo."
    ],
    despedida: "Con todo nuestro cariño,",
    firma: "Tus sobrinos"
  },

  // Las tres tarjetas de deseos
  deseos: [
    { icono: "sol",    titulo: "Felicidad",      texto: "Que tengas dias llenos de alegría" },
    { icono: "hoja",   titulo: "Salud",          texto: "Salud y bienestar" },
    { icono: "brillo", titulo: "Cosas bonitas",  texto: "Sorpresas, viajes y la gente que quieres siempre cerca." }
  ],

  // Mensajes de la escena
  mensajes: {
    deseo: "Que se cumpla todo lo que deseaste!",
    vino: "Servido!",
    brindis: "Chin Chin!"
  }
};
