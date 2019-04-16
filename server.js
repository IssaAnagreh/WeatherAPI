const express = require('express');
const fs = require('fs');
const axios = require('axios');
const mysql = require("mysql");

// Database config and connection
const dbConnection = mysql.createConnection({
  user: "admin",
  password: "1234567",
  database: "weather"
});
// Database inserting
const insertWeather = (
  last_updated,
  condition,
  temp_c,
  wind_kph
) => {
  dbconnection.query(
    `INSERT INTO weather (id, last_updated, condition, temp_c, wind_kph, createdAt) VALUES (null, \"${last_updated}\", \"${condition}\", \"${temp_c}\", \"${wind_kph}\", CURRENT_TIMESTAMP)`,
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

// use express
const app = express();

// any get request
app.get('/*', (req, res) => {
  // repeat
  setInterval(() => {
    axios.get('http://api.apixu.com/v1/current.json?key=2cb6b9c413914d02bc775202180507&q=Dubai')
      .then((response) => {
        // handle success
        async function f() {
          const data = {
            last_updated: (response.data.current.last_updated),
            condition: response.data.current.condition.text,
            temp_c: response.data.current.temp_c,
            wind_kph: response.data.current.wind_kph
          };
          // file filling
          new Promise((resolve, reject) => {
            resolve(fs.writeFile(`./weather.log`, JSON.stringify(data), (err) => {
              if (err) {res.sendStatus(500); return}
            }));
          });
          // database filling
          new Promise((resolve, reject) => {
            resolve(insertWeather(data, (err, res) => {
              if (err) {
                console.log('lel2asaf ma fy database')
                res.sendStatus(500)
                return
              }
              console.log('law fy database kaan 3abba feeha ya kbeer', res)
            }))
          });
          console.log("DONE!")
          res.sendStatus(200);
        }
        f()
      })
      .catch((error) => {
        // handle error
        res.status(400).send("Server Error")
      })
  }, 300000); // 5 mins
});

// listen to local host
var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('listening to port 3000!');
});
