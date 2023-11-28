#include <Wire.h>
#include "HX711.h"
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebSrv.h>
#include <ArduinoJson.h>

const char* ssid = "iPhoneGreg";
const char* password = "greg2011";

HX711 scale;
AsyncWebServer server(80);

// Define the pins for HX711 module
const int DOUT_PIN = 17;  // DT pin connected to IO17
const int SCK_PIN = 16;   // SCK pin connected to IO16

bool calibrationMode = false;  // Set this to true when calibrating

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");

  // Print the ESP32's IP address to the serial monitor
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Initialize the HX711 scale with defined pins
  scale.begin(DOUT_PIN, SCK_PIN);

  if (calibrationMode) {
    Serial.println("Calibration Mode: Place known weights on the load cell.");
  } else {
    Serial.println("Normal Mode: Weighing enabled.");
  }

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    if (scale.is_ready()) {
      if (calibrationMode) {
        // In calibration mode, display raw readings
        long rawReading = scale.read();
        String html = "<html><body>";
        html += "<h1>Raw Reading: " + String(rawReading) + "</h1>";
        html += "</body></html>";
        request->send(200, "text/html", html);
      } else {
        // In normal mode, display calibrated weight
        long weight = scale.get_units(10);  // Read the weight (average of 10 readings)
        float weight_kg = weight / 1000.0;  // Convert to kilograms

        String html = "<html><body>";
        html += "<h1>Weight: " + String(weight_kg, 2) + " kg</h1>";
        html += "</body></html>";

        request->send(200, "text/html", html);
      }
    } else {
      request->send(500, "text/plain", "Scale not ready");
    }
  });

  server.begin();
}

void loop() {
  // You don't need to handle clients manually in the loop when using AsyncWebServer.
  // AsyncWebServer takes care of this internally.
}