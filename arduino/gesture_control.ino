// Arduino code for gesture-controlled home automation
// Connect LED to pin 7 and relay for motor to pin 8

const int LED_PIN = 7;
const int MOTOR_PIN = 8;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Set pin modes
  pinMode(LED_PIN, OUTPUT);
  pinMode(MOTOR_PIN, OUTPUT);
  
  // Initialize both devices as OFF
  digitalWrite(LED_PIN, LOW);
  digitalWrite(MOTOR_PIN, LOW);
  
  Serial.println("Arduino ready for gesture commands");
}

void loop() {
  // Check if data is available to read
  if (Serial.available() > 0) {
    // Read the incoming byte
    String input = Serial.readStringUntil('\n');
    int fingerCount = input.toInt();
    
    Serial.print("Received finger count: ");
    Serial.println(fingerCount);
    
    // Control devices based on finger count
    if (fingerCount == 1) {
      // 1 finger: Turn on LED
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED ON");
    } 
    else if (fingerCount == 2) {
      // 2 fingers: Turn on motor
      digitalWrite(MOTOR_PIN, HIGH);
      Serial.println("Motor ON");
    } 
    else if (fingerCount == 5) {
      // 5 fingers: Turn off all devices
      digitalWrite(LED_PIN, LOW);
      digitalWrite(MOTOR_PIN, LOW);
      Serial.println("All devices OFF");
    }
  }
  
  // Small delay to avoid excessive CPU usage
  delay(50);
}