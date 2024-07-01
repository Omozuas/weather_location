
const express = require('express');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv').config()
const cron = require("node-cron");



cron.schedule("*/3 * * * * ", async () => {
    try {
      const currentTime = new Date();
      console.log(`Current time: ${currentTime}`);
      
      const response = await axios.get('https://weather-location-ea5a.onrender.com/weather');
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  });

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the public folder as static files
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null ,greeting:null,clientIp:null});
});
app.get("/weather", (req, res) => {
    res.send("hello from weather app",);});

app.set('trust proxy', true);

app.get('/api/get-temprature', async (req, res) => {
    const visitorName = req.query.visitor_name ;
    const location1 = req.query.location;
   let clientIp ;
    let error = null;
    let greeting;
    let weather
    if(!visitorName){
        error = 'Failed to fetch weather data'
    }

    try {
       
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=2172797`, {
            params: {
                q: location1,
                units: 'metric',
                appid:process.env.OPENWEATHERMAP_API_KEY
            }
        });
        weather=weatherResponse.data

        const temperature = weatherResponse.data.main.temp;
        const location = weatherResponse.data.name;

       greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`;
       clientIp=`your ip address is ${req.ip}`
       
    } catch (error) {
        console.error(error);
        weather=null
        greeting=null
        error = 'Failed to fetch weather data'
      
    }
    res.render("index",{
        weather,
        greeting,
        error,
        clientIp,
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});