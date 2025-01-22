// let video; // Variable para capturar el video
// let faceMesh; // Variable para el modelo faceMesh
// let faces = []; // Array para almacenar las caras detectadas
// let options = { maxFaces: 1, refineLandmarks: false, flipped: false }; // Opciones para faceMesh

// function preload() {
//   faceMesh = ml5.faceMesh(options); // Cargar el modelo faceMesh con las opciones especificadas
// }

// function mousePressed() {
//   console.log(faces); // Imprimir las caras detectadas en la consola cuando se presiona el mouse
// }

// function gotFaces(results) {
//   faces = results; // Actualizar el array de caras con los resultados de faceMesh
// }

// function setup() {
//   createCanvas(640, 480); // Crear un lienzo de 640x480 píxeles
//   video = createCapture(VIDEO); // Capturar video desde la cámara web
//   video.size(640, 480); // Establecer el tamaño del video a 640x480 píxeles
//   video.hide(); // Ocultar el elemento de video (mostrar solo el lienzo)
//   faceMesh.detectStart(video, gotFaces); // Iniciar la detección de caras en el video

//   // Función de callback para cuando faceMesh emite datos
//   function gotFaces(results) {
//     faces = results; // Guardar la salida en la variable faces
//   }
// }

// function draw() {
//   background(0); // Establecer el color de fondo a negro
//   image(video, 0, 0, width, height); // Dibujar el video en el lienzo
//   if (faces.length > 0) { // Si se detectan caras
//     let face = faces[0]; // Obtener la primera cara detectada
//     for (let i = 0; i < face.keypoints.length; i++) { // Recorrer todos los puntos clave de la cara
//       let keypoint = face.keypoints[i]; // Obtener el punto clave actual
//       stroke(55, 5, 0); // Establecer el color del trazo
//       strokeWeight(5); // Establecer el grosor del trazo
//       point(keypoint.x, keypoint.y); // Dibujar un punto en la ubicación del punto clave
//     }
//   }
// }


// Demo

let sketch = function(p){
  let canvas;
  let dMouse = [];
  let closest;

  p.setup = function(){
    canvas = p.createCanvas(640, 480);
    canvas.id("canvas");
    p.colorMode(p.HSB);

    p.stroke(255);
    p.strokeWeight(3);
  }

  p.draw = function(){
    p.clear();
    if(detections != undefined){
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){
        p.faceMesh();
      }
    }
  }

  p.faceMesh = function(){

    p.beginShape(p.POINTS);
    for(let j=0; j<detections.multiFaceLandmarks[0].length; j++){
      let x = detections.multiFaceLandmarks[0][j].x * p.width;
      let y = detections.multiFaceLandmarks[0][j].y * p.height;
      p.vertex(x, y);
    }
    p.endShape();
  }
}

let myp5 = new p5(sketch);