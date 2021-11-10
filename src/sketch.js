// Setup for receiving data
let serial;
let portName = 'COM5';

function setup() {
  var canvas = createCanvas(1200, 900, WEBGL);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
  canvas.parent('sketch-holder');
  angleMode(DEGREES);

  // Setting up serial for the data from arduino
  serial = new p5.SerialPort();
  serial.on('data', dataReceived);
  serial.open(portName);
}

var earthSize = 350;
// Values that are altered
var fingerScanned = false;
var spin = 0;
var spaceObject = 0;


function preload() {
	earthImage = loadImage("images/earth.jpg");
  moonImage = loadImage("images/moon.jpg");
  marsImage = loadImage("images/mars.png");
  fprintImage = loadImage("images/fingerprint.jpg");
  font = loadFont("font/Begok v15_2015___free.ttf")
}

function draw() {
  if (fingerScanned) {
    if(spaceObject == 0) {
      background(0,0,0,0);

      //Earth
      translate(0,0,0);
    
      rotateY(millis() / 100 + spin);
    
      texture(earthImage);
      sphere(earthSize, 25, 24);

    } else if (spaceObject == 1){
      background(0,0,0,0);

      // Moon
      translate(0,0,0);
    
      rotateY(millis() / 100 + spin);
    
      texture(moonImage);
      sphere(earthSize/4, 25, 24);
    } else if (spaceObject == 2){
      background(0,0,0,0);

      // Mars
      translate(0,0,0)
    
      rotateY(millis() / 100 + spin);
    
      texture(marsImage);
      sphere(earthSize/2, 25, 24);
    }


  } else {
    //scan your finger
    background(0,0,0,0);
    textAlign(CENTER);
    fill(255);
    textSize(70);
    textFont(font);
    text("scan your finger",0,-200);
    image(fprintImage,-120, -100,200,200);
  }

}

function dataReceived() {
  let inString = serial.readStringUntil("!");
  console.log(inString);

  // Receive that scanning was done
  if (inString.charAt(0) == '*') {
    if (fingerScanned) {
      fingerScanned = false;
    } else {
      fingerScanned = true;
    }
  }

  // Accepting spin values from potentiometer
  if(inString.charAt(0) == '&') {
    inString = inString.substring(1);
    inString = trim(inString);
    spin = Number(inString);
  }

  // Button was pressed
  if (inString.charAt(0) == '#') {
    spaceObject++;
    if (spaceObject == 3) {
      spaceObject = 0;
    }
    // Sending info about current space object to arduino
    serial.write(spaceObject);
  }
}
