let sketch = function(p){
  let canvas; // Variable para almacenar el lienzo
  let dMouse = []; // Array para almacenar las distancias del mouse a los puntos
  let closest = 0; // Variable para almacenar el punto más cercano
  let isEditMode = false; // Variable para controlar el modo de edición

  let fill_H_Slider;
  let fill_H_Value;
  let stroke_H_Slider;
  let stroke_H_value;

  let shapes = [{
    fill_H : p.random(360),
    stroke_H : p.random(360),
    indices : []
  }]; // Array para almacenar las formas dibujadas



  let shapeIndex = 0;



  p.setup = function(){
    canvas = p.createCanvas(640, 480); // Crear un lienzo de 640x480 píxeles
    canvas.id('canvas'); // Asignar un ID al lienzo

    p.colorMode(p.HSB); // Establecer el modo de color a HSB

    fill_H_Value = p.createDiv();
    fill_H_Value.class('valueDisplay');
    fill_H_Slider = p.createSlider(0, 360, p.random(360), 5);
    fill_H_Slider.class('Slider');

    stroke_H_Value = p.createDiv();
    stroke_H_Value.class('valueDisplay');
    stroke_H_Slider = p.createSlider(0, 360, p.random(360), 5);
    stroke_H_Slider.class('Slider');
  }

  p.draw = function(){
    p.clear(); // Limpiar el lienzo 
    if(detections != undefined){ // Verificar si hay detecciones
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){ // Verificar si hay al menos un rostro detectado
        p.drawShapes(); // Llamar a la función drawShapes para dibujar las formas
        if(isEditMode == true){
          p.faceMesh(); 
          p.editShapes();
        } 
        p.glow();
      }
    }

    fill_H_Value.html("fill hue: " + fill_H_Slider.value());
    stroke_H_Value.html("stroke hue: " + fill_H_Slider.value());

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
    if(p.mouseX >= 0 && p.mouseX <= p.width){
      if(p.mouseY >= 0 && p.mouseY <= p.height){
        if(isEditMode == true) { // Si el modo de edición está activado, agregar el punto más cercano al array shapes
          shapes[shapeIndex].indices.push(closest); 
          console.log(shapes); // Imprimir el array shapes en la consola
      }
    }
    
  }
}

  p.drawShapes = function(){
    for(let s = 0; s < shapes.length; s++){
    if(s == shapeIndex) p.fill(shapes[s].fill_H, 50, 100);
    else p.fill(shapes[s].fill_H, 100, 100); // Establecer el color de relleno a negro
    p.stroke(shapes [s].stroke_H, 100, 100); // Establecer el color del trazo a blanco
    p.strokeWeight(3); // Establecer el grosor del trazo a 3

    p.beginShape(); // Comenzar una nueva forma
      for(let i = 0; i < shapes[s].indices.length; i++){ // Iterar sobre los puntos en el array shapes
        p.vertex(
          detections.multiFaceLandmarks[0][shapes[s].indices[i]].x * p.width, // Dibujar el punto en la posición x
          detections.multiFaceLandmarks[0][shapes[s].indices[i]].y * p.height, // Dibujar el punto en la posición y
        );
      }
    p.endShape(); // Finalizar la forma
    }
  }

  p.editShapes = function(){
    shapes[shapeIndex].fill_H = fill_H_Slider.value();
    shapes[shapeIndex].fill_H = fill_H_Slider.value();
  }


  p.keyTyped = function(){
    if(p.key === 'e') isEditMode = !isEditMode; // Alternar el modo de edición cuando se presiona la tecla 'e'
    if(p.key === 'c'){
      if(shapes[shapes.length-1].indices.length > 0){
        shapes.push(
          {
          fill_H : p.random(360),
          stroke_H : p.random(360),
          indices : []
        }
      );
        shapeIndex = shapes.length-1;
      }
      console.log(shapes);
    }

    if (p.key === 'z'){
      if(shapes[shapeIndex] != undefined){
        if(shapes[shapeIndex].indices.length > 0) shapes[shapeIndex].indices.pop();
      }
      console.log(shapes[shapeIndex].indices);
    }

    if (p.key === 'd'){
      shapes = [
        {
          fill_H : p.random(360),
          stroke_H : p.random(360),
          indices : []
        }
      ];
      shapeIndex = 0;
      console.log(shapes);
    }
  }

  p.keyPressed = function(){
    if(p.keyCode === p.UP_ARROW){
      if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
      if(shapeIndex < shapes.length-1) shapeIndex++;
      }
    } else if(p.keyCode === p.DOWN_ARROW){
      if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
      if(shapeIndex > 0) shapeIndex--;

      }
  }
  console.log(shapeIndex);
}


  p.glow = function(){
    p.drawingContext.shadowOffsetX = 0;
    p.drawingContext.shadowOffsetY = 0;
    p.drawingContext.shadowBlur = 20;
    p.drawingContext.shadowColor = 'rgba(255, 255, 255, 100)';
  }

}

let myp5 = new p5(sketch); // Crear una nueva instancia de p5 con la función sketch