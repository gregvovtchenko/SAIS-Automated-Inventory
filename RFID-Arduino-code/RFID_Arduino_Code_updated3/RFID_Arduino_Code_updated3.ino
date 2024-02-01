#include <Wire.h>
#include <Adafruit_PN532.h>
#include <WiFi.h>
#include <ESPAsyncWebSrv.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>


#define SDA_PIN 21 
#define SCL_PIN 22 

const char* ssid = "iPhoneGreg";
const char* password = "SYSC4907";

Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);
AsyncWebServer server(3001);

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
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, data);
    int productID = doc["productID"];
    String productName = doc["productName"].as<String>();
    int productType = doc["productType"];
    int supplierID = doc["supplierID"];
    int activeStatus = doc["activeStatus"];
    bool writeSuccess = writeDataToNFC(productID, productName, productType, supplierID, activeStatus); 

    serializeJsonPretty(doc, Serial);
    Serial.println(); // New line after JSON output
    if (writeSuccess) {
      request->send(200, "application/json", "{\"success\":true}");
    } else {
      request->send(500, "application/json", "{\"success\":false}");
    }
  });

 server.on("/read", HTTP_GET, [](AsyncWebServerRequest *request) {
  int productID;
  String productName;
  int productType;
  int supplierID;
  int activeStatus;
  if (readDataFromNFC(productID, productName, productType, supplierID, activeStatus)) {
      String payload = "{";
      payload += "\"productID\":" + String(productID) + ",";
      payload += "\"productName\":\"" + productName + "\",";
      payload += "\"productType\":" + String(productType) + ",";
      payload += "\"supplierID\":" + String(supplierID) + ",";
      payload += "\"activeStatus\":" + String(activeStatus);
      payload += "}";


      Serial.println("Read Data from NFC:");
      Serial.println(payload);
      
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

bool readDataFromNFC(int &productID, String &productName, int &productType, int &supplierID, int &activeStatus) {
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
              productID = String((char *)data).toInt();
          }
        }

        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 5, 0, keya)) {
          uint8_t data[16];
          if (nfc.mifareclassic_ReadDataBlock(5, data)) {
            productName = String((char *)data);
            
          }
        }
    
        // Assume block 6 stores weight as a float.
        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 7, 0, keya)) {
          uint8_t data[16];
          if (nfc.mifareclassic_ReadDataBlock(7, data)) {
            productType = String((char *)data).toInt();
            
          }
        }
        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 8, 0, keya)) {
          uint8_t data[16];
          if (nfc.mifareclassic_ReadDataBlock(8, data)) {
            supplierID = String((char *)data).toInt();
            
          }
        }
        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 9, 0, keya)) {
          uint8_t data[16];
          if (nfc.mifareclassic_ReadDataBlock(9, data)) {
            activeStatus = String((char *)data).toInt();
            
          }
        }
        return true;
    } else {
        return false;
    }
}

bool writeDataToNFC(int productID, String productName, int productType, int supplierID, int activeStatus) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;

  // Initialize NFC card reading
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.println("Found an NFC card!");

    // Blocks to write to (ensure these are safe to write to!)
    uint8_t blockProductID = 4;
    uint8_t blockProductName = 5;
    uint8_t blockProductType = 7;
    uint8_t blockSupplierID = 8;
    uint8_t blockActiveStatus = 9;

    // Authenticate and write product name
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
    
      // Write product type
    if (!authenticateAndWriteBlock(uid, uidLength, blockProductType, String(productType))) {
      Serial.println("Failed to write Product Type to NFC card.");
      return false;
    }

    // Write supplier ID
    if (!authenticateAndWriteBlock(uid, uidLength, blockSupplierID, String(supplierID))) {
      Serial.println("Failed to write Supplier ID to NFC card.");
      return false;
    }

    // Write active status
    if (!authenticateAndWriteBlock(uid, uidLength, blockActiveStatus, String(activeStatus))) {
      Serial.println("Failed to write Active Status to NFC card.");
      return false;
    }
    return true;  // All data written successfully
  } else {
    Serial.println("Failed to find an NFC card!");
    return false; // No card found
  }
}

// make a function to reset the NFC card

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
