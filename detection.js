let detections = []; // Array para almacenar las detecciones de rostros

const videoElement = document.getElementById('video'); // Obtener el elemento de video del DOM

function gotFaces(results) {
  detections = results; // Actualizar el array de detecciones con los resultados obtenidos
  // console.log(detections); // Comentado: imprimir las detecciones en la consola
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`; // Configurar la ruta para los archivos de FaceMesh
}});

faceMesh.setOptions({
  maxNumFaces: 1, // Número máximo de rostros a detectar
  minDetectionConfidence: 0.5, // Confianza mínima para considerar una detección
  minTrackingConfidence: 0.5 // Confianza mínima para el seguimiento de rostros
});
faceMesh.onResults(gotFaces); // Asignar la función gotFaces para manejar los resultados

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement}); // Enviar el frame actual del video a FaceMesh para su procesamiento
  },
  width: 640, // Ancho del video
  height: 480 // Alto del video
});
camera.start(); // Iniciar la cámara