// Led
const int LEDPIN = 8;
// button
const int buttonPin = 2;
// variable to record the value of phototransistor
int photoValue; 

//Servo
#include <Servo.h>
// creating servo object to control a servo
Servo myservo;
// Pointing value
int point = 0;

// for reading push button
int buttonState = 0;
int click = 0;

void setup() {
  Serial.begin(9600);

  // Led for scanning effect
  pinMode(LEDPIN, OUTPUT);
  digitalWrite(LEDPIN, LOW);
  
  // Button for switching space objects
  pinMode(buttonPin, INPUT);

  // Servo pin 9
  myservo.attach(9);
}

void loop() {
  // Spin control by a rotary potentiometer
  int spinRead = analogRead(A0);
  int mappedSpin = map(spinRead, 0, 1023,0, 255);
  String spinStr = "&" + String(mappedSpin) + "!";
  Serial.print(spinStr);
  delay(1);

  // Phototransistor - finger print
  photoValue = analogRead(A1);
  if (photoValue < 20){ //sensorLow-(sensorLow)
      scanning();
      Serial.write("*!");
      delay(10);
  }

  // Button
  buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH) {
    click = 1;
  } else {
    if (click == 1) {
      Serial.write("#!");
      delay(10);
      click = 0;
    }
  }

  serialCheck();

  // Servo pointer
  if (point == 0){
    myservo.write(0);  
  } else if (point == 1) {
    myservo.write(90);
  } else if (point == 2) {
    myservo.write(180);
  }
}

// Checks for serial communication
void serialCheck() {
  if (Serial.available() > 0) {
    int inCome = Serial.read();
    point = inCome;
  }
}

// Simulates scanning - blinking led
void scanning() {
  int scan = 20;
  for(int i=0; i < scan; i++) {
    digitalWrite(LEDPIN, HIGH);
    delay(100);
    digitalWrite(LEDPIN, LOW);
    delay(100);
  }
}
