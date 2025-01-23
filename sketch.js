let sketch = function(p){
  let canvas; // Variable para almacenar el lienzo
  let dMouse = []; // Array para almacenar las posiciones del mouse
  let closest; // Variable para almacenar el punto más cercano

  p.setup = function(){
    canvas = p.createCanvas(640, 480); // Crear un lienzo de 640x480 píxeles
    canvas.id("canvas"); // Asignar un ID al lienzo
    p.colorMode(p.HSB); // Establecer el modo de color a HSB

    p.stroke(255); // Establecer el color del trazo a blanco
    p.strokeWeight(3); // Establecer el grosor del trazo a 3
  }

  p.draw = function(){
    p.clear(); // Limpiar el lienzo
    if(detections != undefined){ // Verificar si hay detecciones
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){ // Verificar si hay al menos un rostro detectado
        p.faceMesh(); // Llamar a la función faceMesh para dibujar los puntos del rostro
      }
    }
  }

  p.faceMesh = function(){
    p.beginShape(p.POINTS); // Comenzar una nueva forma de puntos
    for(let j=0; j<detections.multiFaceLandmarks[0].length; j++){ // Iterar sobre los puntos del rostro detectado
      let x = detections.multiFaceLandmarks[0][j].x * p.width; // Calcular la posición x del punto
      let y = detections.multiFaceLandmarks[0][j].y * p.height; // Calcular la posición y del punto
      p.vertex(x, y); // Dibujar el punto en la posición calculada
    }
    p.endShape(); // Finalizar la forma
  }
}

let myp5 = new p5(sketch); // Crear una nueva instancia de p5 con la función sketch