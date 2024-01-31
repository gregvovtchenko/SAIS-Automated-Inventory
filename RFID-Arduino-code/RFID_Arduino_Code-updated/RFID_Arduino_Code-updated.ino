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


bool readBlock(uint8_t* uid, uint8_t uidLength, uint8_t block, int &data) {
    uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
    uint8_t dataBlock[16];

    if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, block, 0, keya)) {
        if (nfc.mifareclassic_ReadDataBlock(block, dataBlock)) {
            // Convert first 4 bytes of dataBlock to an integer
            data = (int(dataBlock[0]) << 24) | (int(dataBlock[1]) << 16) | (int(dataBlock[2]) << 8) | int(dataBlock[3]);
            return true;
        }
    }
    return false;
}

bool readBlock(uint8_t* uid, uint8_t uidLength, uint8_t block, String &data) {
    uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
    uint8_t dataBlock[16];

    if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, block, 0, keya)) {
        if (nfc.mifareclassic_ReadDataBlock(block, dataBlock)) {
            Serial.print("Block ");
            Serial.print(block);
            Serial.print(": ");

            data = "";
            for (int i = 0; i < 16; i++) {
                Serial.print(dataBlock[i], HEX);
                Serial.print(" ");
                if (dataBlock[i] != 0) {
                    data += (char)dataBlock[i];
                }
            }
            Serial.println();
            return true;
        }
    }
    return false;
}


bool readDataFromNFC(String &jsonData) {
    uint8_t success;
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
    uint8_t uidLength;

    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

    if (success) {
        Serial.println("Found an NFC card!");
        jsonData = "";
        String dataBlock;
        for (uint8_t block = 4; block <= 9; block++) { // Adjust the block range as needed
            if (readBlock(uid, uidLength, block, dataBlock)) {
                jsonData += dataBlock;
            } else {
                Serial.println("Failed to read block " + String(block) + " from NFC card.");
                return false;
            }
        }
        return true;
    } else {
        Serial.println("Failed to find an NFC card!");
        return false;
    }
}



bool writeDataToNFC(const String& jsonData) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;

  DynamicJsonDocument doc(1024);
    deserializeJson(doc, jsonData);

    int productID = doc["productID"];
    String productName = doc["productName"].as<String>();
    int productType = doc["productType"];
    int supplierID = doc["supplierID"];
    int activeStatus = doc["activeStatus"];

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
      // If all data was written successfully to the NFC card, send data to the backend

    String jsonData = "{";
    jsonData += "\"productID\":" + String(productID) + ",";
    jsonData += "\"productName\":\"" + productName + "\",";
    jsonData += "\"productType\":" + String(productType) + ",";
    jsonData += "\"supplierID\":" + String(supplierID) + ",";
    jsonData += "\"activeStatus\":" + String(activeStatus);
    jsonData += "}";
    bool success = writeDataToNFC(jsonData);

    // Print JSON data to Serial
    Serial.println("Data being written to NFC card: " + jsonData);

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
    int productID = doc["productID"];
    String productName = doc["productName"].as<String>();
    int productType = doc["productType"];
    int supplierID = doc["supplierID"];
    int activeStatus = doc["activeStatus"];

    // Construct JSON data from the parameters
    String jsonData = "{";
    jsonData += "\"productID\":" + String(productID) + ",";
    jsonData += "\"productName\":\"" + productName + "\",";
    jsonData += "\"productType\":" + String(productType) + ",";
    jsonData += "\"supplierID\":" + String(supplierID) + ",";
    jsonData += "\"activeStatus\":" + String(activeStatus);
    jsonData += "}";

    bool writeSuccess = writeDataToNFC(jsonData); // Call the modified function

    if (writeSuccess) {
        request->send(200, "application/json", "{\"success\":true}");
    } else {
        request->send(500, "application/json", "{\"success\":false}");
    }
});


server.on("/read", HTTP_GET, [](AsyncWebServerRequest *request) {
    String jsonData;
    if (readDataFromNFC(jsonData)) {
        // Parse the JSON string
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, jsonData);

        // Extracting individual fields from the JSON object
        int productID = doc["productID"];
        String productName = doc["productName"].as<String>();
        int productType = doc["productType"];
        int supplierID = doc["supplierID"];
        int activeStatus = doc["activeStatus"];

        // Construct the response payload
        String payload = "{";
        payload += "\"productID\":" + String(productID) + ",";
        payload += "\"productName\":\"" + productName + "\",";
        payload += "\"productType\":" + String(productType) + ",";
        payload += "\"supplierID\":" + String(supplierID) + ",";
        payload += "\"activeStatus\":" + String(activeStatus);
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