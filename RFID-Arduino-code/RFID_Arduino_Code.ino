#include <Wire.h>
#include <Adafruit_PN532.h>
#include <WiFi.h>
#include <ESPAsyncWebSrv.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>


#define SDA_PIN 21 
#define SCL_PIN 22 

const char* ssid = "iPhoneGreg";
const char* password = "greg2011";

Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);
AsyncWebServer server(3000);

void setup(void) {
  Serial.begin(115200);
  
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1);
  }
  nfc.SAMConfig();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/write", HTTP_POST, [](AsyncWebServerRequest *request) {},
  NULL,
  [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, data);
    String productName = doc["productName"].as<String>();
    int productID = doc["productID"];
    int weight = doc["weight"];
    bool writeSuccess = writeDataToNFC(productName, productID, weight); 
    if (writeSuccess) {
      request->send(200, "application/json", "{\"success\":true}");
    } else {
      request->send(500, "application/json", "{\"success\":false}");
    }
  });

  server.on("/read", HTTP_GET, [](AsyncWebServerRequest *request) {
    String productName;
    int productID;
    int weight;
    if (readDataFromNFC(productName, productID, weight)) {
        String payload = "{";
        payload += "\"productName\":\"" + productName + "\",";
        payload += "\"productID\":" + String(productID) + ",";
        payload += "\"weight\":" + String(weight);
        payload += "}";
        request->send(200, "application/json", payload);
    } else {
        request->send(500, "application/json", "{\"error\":\"Failed to read from NFC\"}");
    }
  });

  server.begin();
}

void loop(void) {
  // Empty loop
}

bool readDataFromNFC(String &productName, int &productID, int &weight) {
    uint8_t success;
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
    uint8_t uidLength;
    
    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

    if (success) {
        Serial.println("Found an NFC card!");
        
        uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
        
        // Read product name (string)
        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, keya)) {
          uint8_t data[16];
          if (nfc.mifareclassic_ReadDataBlock(4, data)) {
              productName = String((char *)data);
          }
        }

        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 5, 0, keya)) {
          uint8_t data[16];
          if (nfc.mifareclassic_ReadDataBlock(5, data)) {
            productID = String((char *)data).toInt();
            
          }
        }
    
        // Assume block 6 stores weight as a float.
        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 6, 0, keya)) {
          uint8_t data[16];
          if (nfc.mifareclassic_ReadDataBlock(6, data)) {
            weight = String((char *)data).toInt();
            
          }
        }
        return true;
    } else {
        return false;
    }
}

bool writeDataToNFC(String productName, int productID, int weight) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;

  // Initialize NFC card reading
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.println("Found an NFC card!");

    // Blocks to write to (ensure these are safe to write to!)
    uint8_t blockProductName = 4;
    uint8_t blockProductID = 5;
    uint8_t blockWeight = 6;

    // Authenticate and write product name
    if (!authenticateAndWriteBlock(uid, uidLength, blockProductName, productName)) {
      Serial.println("Failed to write Product Name to NFC card.");
      return false; // Write failed
    }

    // Authenticate and write product ID (as string)
    if (!authenticateAndWriteBlock(uid, uidLength, blockProductID, String(productID))) {
      Serial.println("Failed to write Product ID to NFC card.");
      return false; // Write failed
    }

    // Authenticate and write weight (as string)
    if (!authenticateAndWriteBlock(uid, uidLength, blockWeight, String(weight))) {
      Serial.println("Failed to write Weight to NFC card.");
      return false; // Write failed
    }

    // If all data was written successfully to the NFC card, send data to the backend

    return true;  // All data written successfully
  } else {
    Serial.println("Failed to find an NFC card!");
    return false; // No card found
  }
}



bool authenticateAndWriteBlock(uint8_t* uid, uint8_t uidLength, uint8_t block, String data) {
  // Assuming a default MIFARE Classic key
  uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };

  if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, block, 0, keya)) {
    Serial.println("Authentication successful for block " + String(block));

    byte dataToWrite[16];
    data.getBytes(dataToWrite, 16);

    if (nfc.mifareclassic_WriteDataBlock(block, dataToWrite)) {
      // Print data in HEX for verification
      Serial.print("Data written (HEX): ");
      for (int i = 0; i < 16; i++) {
        Serial.print(dataToWrite[i], HEX);
        Serial.print(" ");
      }
      Serial.println();
      return true;
    } else {
      Serial.println("Write failed for block " + String(block));
      return false;
    }
  } else {
    Serial.println("Authentication failed for block " + String(block));
    return false;
  }
}
