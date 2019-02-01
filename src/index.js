const http = require('http');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLint = require('ejs-lint');

//router
//var routes = require('./routes');

//var router = express.Router();






//initialize app
const app = express();


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));



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
    con.query("ALTER TABLE plate CHANGE `384_plate_ID` `plate_ID_384` VARCHAR(45)", function (err, result) {
        if (err) {
        throw err;
        } 
       console.log("column name changed.");
      });

   
    
});


var plate_obj = {};

//plate page
app.get('/plate', function (req, res){

    //query to get plate table from molecules db

    con.query("SELECT * FROM plate", function (err, result) {
        if (err) {
        throw err;
        } else {
            plate_obj = {print: result};
            console.log(plate_obj);
            res.render('plate', plate_obj);
            
        }
       // console.log(result);
      });

   // res.render(__dirname + '/plate.ejs' );

})


//code snipped to check code syntax errors
var fs = require('fs');
var check = require('syntax-error');

var file = __dirname + '/views/plate.ejs';
var src = fs.readFileSync(file);

var err = check(src, file);
if (err) {
    console.error('ERROR DETECTED' + Array(62).join('!'));
    console.error(err);
    console.error(Array(76).join('-'));
}





app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    //res.write('Hello Molecules!');
});