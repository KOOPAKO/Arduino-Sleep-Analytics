/*  */

//Libraries
#include <DHT.h>
#include <Wire.h>
#include "RTClib.h"
#include <string.h>

//Constants
#define DHTPIN 2     // what pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE); // Initialize DHT sensor for normal 16mhz Arduino

#define LOG_INTERVAL  1000 // mills between entries. 
// how many milliseconds before writing the logged data permanently to disk
// set it to the LOG_INTERVAL to write each time (safest)
// set it to 10*LOG_INTERVAL to write all data every 10 datareads, you could lose up to
// the last 10 reads if power is lost but it uses less power and is much faster!
#define SYNC_INTERVAL 1000 // mills between calls to flush() - to write data to the card
uint32_t syncTime = 0; // time of last sync()

//Variables
float hum;  //Stores humidity value
float temp; //Stores temperature value
char currentMotion; // Motion function output
long previousMillis; // Used to calculate delay
long currentMillis; // Used to calculate delay
long requiredDelay; // used for added delay if nessesary
String output;

RTC_DS1307 RTC; // define the Real Time Clock object

// for the data logging shield, we use digital pin 10 for the SD cs line
const int chipSelect = 10;




void setup()
{
    Serial.begin(9600);

    /**
     * connect to RTC
       Now we kick off the RTC by initializing the Wire library and poking the RTC to see if its alive.
    */
    initRTC();
  
  
    /**
       Now we print the header. The header is the first line of the file and helps your spreadsheet or math program identify whats coming up next.
       The data is in CSV (comma separated value) format so the header is too: "millis,stamp, datetime,hum,temp" the first item millis is milliseconds since the Arduino started,
       stamp is the timestamp, datetime is the time and date from the RTC in human readable format, hum is the humidity and temp is the temperature read.
    */
    // Serial.println("millis,stamp,datetime,motion,temp,hum"); <- order of output
  
    pinMode(6, INPUT);
    dht.begin();
}

void loop()
{
    DateTime now;
    output = "";
    // delay for the amount of time we want between readings
    requiredDelay = (LOG_INTERVAL - 1) - (millis() % LOG_INTERVAL);
    previousMillis = millis();
    // Determine motion until delay is over
    while(requiredDelay - (currentMillis - previousMillis) > 0) { // check for any motion in the delay time (likely more accurate due to built in sensor time delay)
      currentMillis = millis();
      if (digitalRead(6) == HIGH) {
        currentMotion = true;
     }
    }
    if (currentMotion != true){
      currentMotion = false;
    }   

    // log milliseconds since starting
    uint32_t m = millis();
    
    output.concat(String(m));         // milliseconds since start
    output.concat(", ");

    // fetch the time
    now = RTC.now();
    // log time
    output.concat(String(now.unixtime())); // seconds since 2000
    output.concat(", ");
    output.concat(String(now.year(), DEC));
    output.concat("/");
    output.concat(String(now.month(), DEC));
    output.concat("/");
    output.concat(String(now.day(), DEC));
    output.concat(" ");
    output.concat(String(now.hour(), DEC));
    output.concat(":");
    output.concat(String(now.minute(), DEC));
    output.concat(":");
    output.concat(String(now.second(), DEC));

    output.concat(", ");
    if(currentMotion == true){ // add motion to log
      output.concat("Active");
    }
    else {
      output.concat("Inactive");
    }
    
    //Read data and store it to variables hum and temp
    hum = dht.readHumidity();
    temp= dht.readTemperature();

    //Print temp and humidity values to serial monitor
    
    output.concat(", ");
    output.concat(temp);
    output.concat(", ");
    output.concat(hum);    
    
    // reset motionVar
    currentMotion = false;

    if ((millis() - syncTime) < SYNC_INTERVAL) return;
      Serial.println(output);
    
      
}

/**
   The error() function, is just a shortcut for us, we use it when something Really Bad happened.
   For example, if we couldn't write to the SD card or open it.
   It prints out the error to the Serial Monitor, and then sits in a while(1); loop forever, also known as a halt
*/
void error(char const *str)
{
  Serial.print("error: ");
  Serial.println(str);

  while (1);
}

void initRTC()
{
  Wire.begin();
  if (!RTC.begin()) {
    Serial.println("RTC failed");

  }
}
