
const express = require('express');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv').config()
const cron = require("node-cron");



cron.schedule("*/3 * * * * ", async () => {
    try {
      const currentTime = new Date();
      console.log(`Current time: ${currentTime}`);
      
      const response = await axios.get('https://weather-location-ea5a.onrender.com/');
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  });



app.set('trust proxy', true);

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name ||"Mark";
   let clientIp ;
    let error = null;
    let greeting;
    let weather
    let location
    if(!visitorName){
        error = 'Failed to fetch weather data'
    }

    try {
        const locationResponse = await axios.get(`http://ip-api.com/json/${req.ip}`);
        location = locationResponse.data.city;
     
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=2172797`, {
            params: {
                q: location,
                units: 'metric',
                appid:process.env.OPENWEATHERMAP_API_KEY
            }
        });
        weather=weatherResponse.data

        const temperature = weatherResponse.data.main.temp;

       greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`;
       clientIp=`your ip address is ${req.ip}`;
       res.json({
       "location":location,
      "greeting":  greeting,
      "client_ip":clientIp,
    });
       
    } catch (error) {
        console.error(error);
        res.json({
            error :'Failed to fetch weather data'
         });
       
      
    }
    
});
app.get("/", (req, res) => {
    res.send("hello from weather app",);});
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});