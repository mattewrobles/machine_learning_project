let sketch = function(p){
  let canvas; // Variable para almacenar el lienzo
  let dMouse = []; // Array para almacenar las distancias del mouse a los puntos
  let closest = 0; // Variable para almacenar el punto más cercano
  let isEditMode = false; // Variable para controlar el modo de edición

  let shapes = [[]]; // Array para almacenar las formas dibujadas

  /*
  let sample2DArray =[
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 200, 300],
  200,
  300
  ]
  */

  let shapeIndex = 0;



  p.setup = function(){
    canvas = p.createCanvas(640, 480); // Crear un lienzo de 640x480 píxeles
    canvas.id('canvas'); // Asignar un ID al lienzo

    p.colorMode(p.HSB); // Establecer el modo de color a HSB
  }

  p.draw = function(){
    p.clear(); // Limpiar el lienzo 
    if(detections != undefined){ // Verificar si hay detecciones
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){ // Verificar si hay al menos un rostro detectado
        p.drawShapes(); // Llamar a la función drawShapes para dibujar las formas
        if(isEditMode == true) p.faceMesh(); // Si el modo de edición está activado, llamar a la función faceMesh
      }
    }
  }

  p.faceMesh = function(){
    p.stroke(255); // Establecer el color del trazo a blanco
    p.strokeWeight(3); // Establecer el grosor del trazo a 3

    p.beginShape(p.POINTS); // Comenzar una nueva forma de puntos
    for(let i=0; i<detections.multiFaceLandmarks[0].length; i++){ // Iterar sobre los puntos del rostro detectado
      let x = detections.multiFaceLandmarks[0][i].x * p.width; // Calcular la posición x del punto
      let y = detections.multiFaceLandmarks[0][i].y * p.height; // Calcular la posición y del punto
      p.vertex(x, y); // Dibujar el punto en la posición calculada

      let d = p.dist(x, y, p.mouseX, p.mouseY); // Calcular la distancia del mouse al punto
      dMouse.push(d); // Agregar la distancia al array dMouse
    }
    p.endShape(); // Finalizar la forma

    let minimum = p.min(dMouse); // Encontrar la distancia mínima en el array dMouse
    closest = dMouse.indexOf(minimum); // Encontrar el índice del punto más cercano

    p.stroke(0, 100, 100); // Establecer el color del trazo a rojo
    p.strokeWeight(10); // Establecer el grosor del trazo a 10
    p.point(
      detections.multiFaceLandmarks[0][closest].x * p.width, // Dibujar el punto más cercano en la posición x
      detections.multiFaceLandmarks[0][closest].y * p.height // Dibujar el punto más cercano en la posición y
    );

    dMouse.splice(0, dMouse.length); // Vaciar el array dMouse
  }

  p.mouseClicked = function(){
    if(isEditMode == true) shapes[shapeIndex].push(closest); // Si el modo de edición está activado, agregar el punto más cercano al array shapes
    console.log(shapes); // Imprimir el array shapes en la consola
  }

  p.drawShapes = function(){
    for(let s = 0; s < shapes.length; s++){
      p.fill(0, 0, 0); // Establecer el color de relleno a negro
    p.stroke(0, 0, 100); // Establecer el color del trazo a blanco
    p.strokeWeight(3); // Establecer el grosor del trazo a 3

    p.beginShape(); // Comenzar una nueva forma
      for(let i = 0; i < shapes[s].length; i++){ // Iterar sobre los puntos en el array shapes
        p.vertex(
          detections.multiFaceLandmarks[0][shapes[s][i]].x * p.width, // Dibujar el punto en la posición x
          detections.multiFaceLandmarks[0][shapes[s][i]].y * p.height // Dibujar el punto en la posición y
        );
      }
    p.endShape(); // Finalizar la forma
    }
    
  }

  p.keyTyped = function(){
    if(p.key === 'e') isEditMode = !isEditMode; // Alternar el modo de edición cuando se presiona la tecla 'e'
    if(p.key == 'c'){
      if(shapes[shapes.length-1].length > 0){
        shapes.push([]);
        shapeIndex++;
      }
      console.log(shapes);
    }
  }
}

let myp5 = new p5(sketch); // Crear una nueva instancia de p5 con la función sketch