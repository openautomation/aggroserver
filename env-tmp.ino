float read_env_tmp(void) {
  float v_out; 
  float temp;
  digitalWrite(A0, LOW); 
  digitalWrite(2, HIGH);
  delay(2); 
  v_out = analogRead(A0); 
  digitalWrite(2, LOW);
  v_out*=.0048; 
  v_out*=1000; 
  temp= 0.0512 * v_out -20.5128;
  return temp;
} 

void setup() { 
  analogReference(DEFAULT);
  //analogReference(INTERNAL);
  Serial.begin(38400);
  pinMode(2, OUTPUT);
} 
void loop() { 
  float temp = read_env_tmp();
  Serial.println(temp);
  delay(1000);
}

