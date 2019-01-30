const http = require('http');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

//router
var routes = require('./routes');




//initialize app
const app = express();


app.set('view engine', 'ejs');



//Home page
app.get('/', function (req, res){
    res.render(__dirname + '/index.ejs');
})



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
    con.query("SELECT * FROM plate", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
    
});










app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    //res.write('Hello Molecules!');
});