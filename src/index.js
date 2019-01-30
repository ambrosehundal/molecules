const http = require('http');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');


//initialize app
const app = express();


//local port
const port = 3000;



//create connection with MySQL database
var con = mysql.createConnection({
    host:"localhost",
    user: "ambrose",
    password: "",
    database: 'molecules'

});


//check if db is connected
con.connect(function(err){
    if (err) throw err;
    console.log("Connected to molecules database");
    console.log("connected!");
   // var sql = "CREATE TABLE plate"
    
});










app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    //res.write('Hello Molecules!');
});