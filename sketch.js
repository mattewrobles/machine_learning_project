let sketch = function(p){
  let canvas; // Variable para almacenar el lienzo
  let dMouse = []; // Array para almacenar las distancias del mouse a los puntos
  let closest = 0; // Variable para almacenar el punto más cercano
  let isEditMode = false; // Variable para controlar el modo de edición

  let fill_H_Slider, fill_S_Slider, fill_B_Slider, fill_O_Slider; // Sliders para los valores de relleno
  let fill_H_Value, fill_S_Value, fill_B_Value, fill_O_Value; // Valores de relleno
  let stroke_H_Slider, stroke_S_Slider, stroke_B_Slider, stroke_O_Slider; // Sliders para los valores de contorno
  let stroke_H_Value, stroke_S_Value, stroke_B_Value, stroke_O_Value; // Valores de contorno

  let edit_button; // Botón para alternar el modo de edición
  let screenshot_button; // Botón para tomar una captura de pantalla
  let save_drawing_button; // Botón para guardar el dibujo
  let index_UP_button; // Botón para aumentar el índice de la forma
  let index_DOWN_button; // Botón para disminuir el índice de la forma
  let complete_button; // Botón para completar una forma
  let undo_button; // Botón para deshacer la última acción
  let delete_button; // Botón para borrar el dibujo

  let shapes = [{
    fill_H : p.random(255), // Valor aleatorio para el tono de relleno
    fill_S : 50, // Saturación de relleno
    fill_B : 100, // Brillo de relleno
    fill_O : 100, // Opacidad de relleno
    stroke_H : p.random(255), // Valor aleatorio para el tono de contorno
    stroke_S : 50, // Saturación de contorno
    stroke_B : 100, // Brillo de contorno
    stroke_O : 100, // Opacidad de contorno
    indices : [] // Array para almacenar los índices de los puntos de la forma
  }];

  let shapeIndex = 0; // Índice de la forma actual
  let tParameters; // Parámetros temporales
  let capture; // Variable para capturar el video
  let shapesData; // Datos de las formas
  let isDraggedOver = false; // Variable para controlar si se está arrastrando un archivo sobre el lienzo

  p.setup = function(){
    canvas = p.createCanvas(640, 480);
    canvas.id('canvas');
    canvas.parent('canvas-container');
    canvas.dragOver(() => {
      isDraggedOver = true; // Establecer isDraggedOver a true cuando se arrastra un archivo sobre el lienzo
    });
    canvas.dragLeave(() => {
      isDraggedOver = false; // Establecer isDraggedOver a false cuando se deja de arrastrar un archivo sobre el lienzo
    });

    canvas.drop((file) => {
      if(file.subtype == 'json'){ // Verificar si el archivo es de tipo JSON
        shapes = file.data.shapes; // Actualizar las formas con los datos del archivo
        shapeIndex = shapes.length-1; // Establecer el índice de la forma actual al último índice
        isDraggedOver = false; // Establecer isDraggedOver a false
      }else{
        isDraggedOver = false; // Establecer isDraggedOver a false si el archivo no es de tipo JSON
      }
    });

    p.colorMode(p.HSB, 255, 100, 100, 100); // Establecer el modo de color a HSB

    edit_button = p.createButton("Edit mode off");
    edit_button.mousePressed(p.toggleEdit);
    edit_button.class("Buttons");
    edit_button.id("edit_button");
    edit_button.parent("controls-edit");

    fill_H_Value = p.createDiv();
    fill_H_Value.class('valueDisplay');
    fill_H_Value.parent('controls-fill');
    fill_H_Slider = p.createSlider(0, 255, p.random(255), 5);
    fill_H_Slider.class('Slider');
    fill_H_Slider.parent('controls-fill');

    fill_S_Value = p.createDiv();
    fill_S_Value.class('valueDisplay');
    fill_S_Value.parent('controls-fill');
    fill_S_Slider = p.createSlider(0, 100, 50, 5);
    fill_S_Slider.class('Slider');
    fill_S_Slider.parent('controls-fill');

    fill_B_Value = p.createDiv();
    fill_B_Value.class('valueDisplay');
    fill_B_Value.parent('controls-fill');
    fill_B_Slider = p.createSlider(0, 100, 100, 5);
    fill_B_Slider.class('Slider');
    fill_B_Slider.parent('controls-fill');

    fill_O_Value = p.createDiv();
    fill_O_Value.class('valueDisplay');
    fill_O_Value.parent('controls-fill');
    fill_O_Slider = p.createSlider(0, 100, 100, 5);
    fill_O_Slider.class('Slider');
    fill_O_Slider.parent('controls-fill');

    stroke_H_Value = p.createDiv();
    stroke_H_Value.class('valueDisplay');
    stroke_H_Value.parent('controls-stroke');
    stroke_H_Slider = p.createSlider(0, 255, p.random(255), 5);
    stroke_H_Slider.class('Slider');
    stroke_H_Slider.parent('controls-stroke');

    stroke_S_Value = p.createDiv();
    stroke_S_Value.class('valueDisplay');
    stroke_S_Value.parent('controls-stroke');
    stroke_S_Slider = p.createSlider(0, 100, 50, 5);
    stroke_S_Slider.class('Slider');
    stroke_S_Slider.parent('controls-stroke');

    stroke_B_Value = p.createDiv();
    stroke_B_Value.class('valueDisplay');
    stroke_B_Value.parent('controls-stroke');
    stroke_B_Slider = p.createSlider(0, 100, 100, 5);
    stroke_B_Slider.class('Slider');
    stroke_B_Slider.parent('controls-stroke');

    stroke_O_Value = p.createDiv();
    stroke_O_Value.class('valueDisplay');
    stroke_O_Value.parent('controls-stroke');
    stroke_O_Slider = p.createSlider(0, 100, 100, 5);
    stroke_O_Slider.class('Slider');
    stroke_O_Slider.parent('controls-stroke');

    screenshot_button = p.createButton("");
    screenshot_button.mousePressed(p.screenShot);
    screenshot_button.class("imageButtons");
    screenshot_button.id("screenshot_button");
    screenshot_button.parent("controls-extra");

    save_drawing_button = p.createButton("");
    save_drawing_button.mousePressed(p.saveDrawing);
    save_drawing_button.class("imageButtons");
    save_drawing_button.id("save_drawing_button");
    save_drawing_button.parent("controls-extra");

    index_UP_button = p.createButton("");
    index_UP_button.mousePressed(p.upIndex);
    index_UP_button.class("imageButtons");
    index_UP_button.id("index_UP_button");
    index_UP_button.parent("controls-extra");

    index_DOWN_button = p.createButton("");
    index_DOWN_button.mousePressed(p.downIndex);
    index_DOWN_button.class("imageButtons");
    index_DOWN_button.id("index_DOWN_button");
    index_DOWN_button.parent("controls-extra");

    complete_button = p.createButton("Completado");
    complete_button.mousePressed(p.complete);
    complete_button.class("Buttons");
    complete_button.id("complete_button");
    complete_button.parent("controls-shape");

    undo_button = p.createButton("Retroceder");
    undo_button.mousePressed(p.undo);
    undo_button.class("Buttons");
    undo_button.id("undo_button");
    undo_button.parent("controls-shape");

    delete_button = p.createButton("Borrar");
    delete_button.mousePressed(p.deleteDrawing);
    delete_button.class("Buttons");
    delete_button.id("delete_button");
    delete_button.parent("controls-shape");

    tParameters = {
      fill_H : fill_H_Slider.value(), // Valor del tono de relleno
      fill_S : fill_S_Slider.value(), // Valor de la saturación de relleno
      fill_B : fill_B_Slider.value(), // Valor del brillo de relleno
      fill_O : fill_O_Slider.value(), // Valor de la opacidad de relleno
      stroke_H : stroke_H_Slider.value(), // Valor del tono de contorno
      stroke_S : stroke_S_Slider.value(), // Valor de la saturación de contorno
      stroke_B : stroke_B_Slider.value(), // Valor del brillo de contorno
      stroke_O : stroke_O_Slider.value() // Valor de la opacidad de contorno
    }

    capture = p.createCapture(p.VIDEO); // Crear una captura de video
    capture.size(p.width, p.height); // Establecer el tamaño de la captura de video
    capture.hide(); // Ocultar la captura de video

    p.textAlign(p.CENTER, p.CENTER); // Alinear el texto al centro
    p.textSize(24); // Establecer el tamaño del texto a 24
  }

  p.draw = function(){
    p.clear(); // Limpiar el lienzo
    if(detections != undefined){ // Verificar si hay detecciones
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){ // Verificar si hay al menos un rostro detectado
        p.drawShapes(); // Llamar a la función drawShapes para dibujar las formas
        if(isEditMode == true){
          p.faceMesh(); // Llamar a la función faceMesh para dibujar los puntos del rostro
          p.editShapes(); // Llamar a la función editShapes para editar las formas
        }

        if(isDraggedOver == true){
          p.noStroke(); // No dibujar el contorno
          p.fill(0, 0, 100, 10); // Establecer el color de relleno a blanco con opacidad
          p.rect(0, 0, p.width, p.height); // Dibujar un rectángulo sobre el lienzo
          p.fill(0, 0, 100); // Establecer el color de relleno a blanco
          p.text('Drag your drawing here', p.width/2, p.height/2); // Mostrar el texto "Drag your drawing here" en el centro del lienzo
        }
      }
    }

    fill_H_Value.html("Relleno color: " + fill_H_Slider.value()); // Actualizar el valor del tono de relleno
    fill_S_Value.html("Saturación: " + fill_S_Slider.value()); // Actualizar el valor de la saturación de relleno
    fill_B_Value.html("Brillo: " + fill_B_Slider.value()); // Actualizar el valor del brillo de relleno
    fill_O_Value.html("Opacidad: " + fill_O_Slider.value()); // Actualizar el valor de la opacidad de relleno

    stroke_H_Value.html("Contorno: " + stroke_H_Slider.value()); // Actualizar el valor del tono de contorno
    stroke_S_Value.html("Saturación borde: " + stroke_S_Slider.value()); // Actualizar el valor de la saturación de contorno
    stroke_B_Value.html("Brillo borde: " + stroke_B_Slider.value()); // Actualizar el valor del brillo de contorno
    stroke_O_Value.html("Opacidad borde: " + stroke_O_Slider.value()); // Actualizar el valor de la opacidad de contorno
  }

  p.faceMesh = function(){
    p.stroke(0, 0, 100); // Establecer el color del trazo a blanco
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
        if(isEditMode == true){
          shapes[shapeIndex].indices.push(closest); // Agregar el punto más cercano al array de índices de la forma actual
          console.log(shapes); // Imprimir las formas en la consola
        }
      }
    }
  }

  p.drawShapes = function(){
    for(let s = 0; s < shapes.length; s++){ // Iterar sobre las formas
      p.fill(
        shapes[s].fill_H, // Establecer el tono de relleno
        shapes[s].fill_S, // Establecer la saturación de relleno
        shapes[s].fill_B, // Establecer el brillo de relleno
        shapes[s].fill_O // Establecer la opacidad de relleno
      );
      p.stroke(
        shapes[s].stroke_H, // Establecer el tono de contorno
        shapes[s].stroke_S, // Establecer la saturación de contorno
        shapes[s].stroke_B, // Establecer el brillo de contorno
        shapes[s].stroke_O // Establecer la opacidad de contorno
      );
      p.strokeWeight(3); // Establecer el grosor del contorno a 3

      if(isEditMode == true){
        if(s == shapeIndex) p.glow('rgba(255, 255, 255, 100)'); // Establecer el brillo de la forma actual
        else p.glow('rgba(255, 255, 255, 0)'); // Establecer el brillo de las demás formas
      }else if(isEditMode == false){
        p.glow('rgba(255, 255, 255, 100)'); // Establecer el brillo de todas las formas
      }

      p.beginShape(); // Comenzar una nueva forma
        for(let i = 0; i < shapes[s].indices.length; i++){ // Iterar sobre los índices de los puntos de la forma
          p.vertex(
            detections.multiFaceLandmarks[0][shapes[s].indices[i]].x * p.width, // Dibujar el punto en la posición x
            detections.multiFaceLandmarks[0][shapes[s].indices[i]].y * p.height // Dibujar el punto en la posición y
          );
        }
      p.endShape(); // Finalizar la forma
    }
  }

  p.editShapes = function(){
    // --- fill ---
    if(tParameters.fill_H != fill_H_Slider.value()){
      tParameters.fill_H = fill_H_Slider.value();
      shapes[shapeIndex].fill_H = fill_H_Slider.value();
    }
    if(tParameters.fill_S!= fill_S_Slider.value()){
      tParameters.fill_S = fill_S_Slider.value();
      shapes[shapeIndex].fill_S = fill_S_Slider.value();
    }
    if(tParameters.fill_B != fill_B_Slider.value()){
      tParameters.fill_B = fill_B_Slider.value();
      shapes[shapeIndex].fill_B = fill_B_Slider.value();
    }
    if(tParameters.fill_O != fill_O_Slider.value()){
      tParameters.fill_O = fill_O_Slider.value();
      shapes[shapeIndex].fill_O = fill_O_Slider.value();
    }

    // --- stroke ---
    if(tParameters.stroke_H != stroke_H_Slider.value()){
      tParameters.stroke_H = stroke_H_Slider.value();
      shapes[shapeIndex].stroke_H = stroke_H_Slider.value();
    }
    if(tParameters.stroke_S != stroke_S_Slider.value()){
      tParameters.stroke_S = stroke_S_Slider.value();
      shapes[shapeIndex].stroke_S = stroke_S_Slider.value();
    }
    if(tParameters.stroke_B != stroke_B_Slider.value()){
      tParameters.stroke_B = stroke_B_Slider.value();
      shapes[shapeIndex].stroke_B = stroke_B_Slider.value();
    }
    if(tParameters.stroke_O != stroke_O_Slider.value()){
      tParameters.stroke_O = stroke_O_Slider.value();
      shapes[shapeIndex].stroke_O = stroke_O_Slider.value();
    }
  }

  p.keyTyped = function(){
    if(p.key === 'e') p.toggleEdit();
    if(p.key === 'c') p.complete();
    if(p.key === 'z') p.undo();
    if(p.key === 'd') p.deleteDrawing();
    if(p.key === 's') p.screenShot();
    if(p.key === 'j') p.saveDrawing();
  }

  p.toggleEdit = function(){
    isEditMode = !isEditMode;

    if(isEditMode == true){
      edit_button.html("Crear filtro On");
    }else if(isEditMode == false){
      edit_button.html("Crear filtro off");
    }
  }

  p.complete = function(){
    if(shapes[shapes.length-1].indices.length > 0){
      if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);

      shapes.push(
        {
          fill_H : p.random(255),
          fill_S : 50,
          fill_B : 100,
          fill_O : 100,
          stroke_H : p.random(255),
          stroke_S : 50,
          stroke_B : 100,
          stroke_O : 100,
          indices : []
        }
      );
      shapeIndex = shapes.length-1;
    }
    console.log(shapes);
  }

  p.undo = function(){
    if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].indices.length > 0) shapes[shapeIndex].indices.pop();
    }
    console.log(shapes[shapeIndex].indices);
  }

  p.deleteDrawing = function(){
    shapes = [
      {
        fill_H : p.random(255),
        fill_S : 50,
        fill_B : 100,
        fill_O : 100,
        stroke_H : p.random(255),
        stroke_S : 50,
        stroke_B : 100,
        stroke_O : 100,
        indices : []
      }
    ];
    shapeIndex = 0;
    console.log(shapes);
  }

  p.screenShot = function(){
    p.image(capture.get(0, 0, p.width, p.height), 0, 0, p.width, p.height);
    // p.faceMesh();
    p.drawShapes();
    p.glow();
    p.saveCanvas('screenShot', 'png');
  }

  p.saveDrawing = function(){
    let s = {shapes};
    p.saveJSON(s, 'untitled_shapes.json');
  }

  p.keyPressed = function(){
    if(p.keyCode === p.UP_ARROW) p.upIndex();
    else if(p.keyCode === p.DOWN_ARROW) p.downIndex();
  }

  p.upIndex = function(){
    if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
      if(shapeIndex < shapes.length-1) shapeIndex++;
      p.resetSliders();
      console.log(shapeIndex);
    }
  }

  p.downIndex = function(){
    if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
      if(shapeIndex > 0) shapeIndex--;
      p.resetSliders();
      console.log(shapeIndex);
    }
  }

  p.resetSliders = function(){
    fill_H_Slider.value(shapes[shapeIndex].fill_H);
    fill_S_Slider.value(shapes[shapeIndex].fill_S);
    fill_B_Slider.value(shapes[shapeIndex].fill_B);
    fill_O_Slider.value(shapes[shapeIndex].fill_O);
    stroke_H_Slider.value(shapes[shapeIndex].stroke_H);
    stroke_S_Slider.value(shapes[shapeIndex].stroke_S);
    stroke_B_Slider.value(shapes[shapeIndex].stroke_B);
    stroke_O_Slider.value(shapes[shapeIndex].stroke_O);
  }

  p.glow = function(glowColor){
    p.drawingContext.shadowOffsetX = 0;
    p.drawingContext.shadowOffsetY = 0;
    p.drawingContext.shadowBlur = 20;
    p.drawingContext.shadowColor = glowColor;
  }
}

let myp5 = new p5(sketch);