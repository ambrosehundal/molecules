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

   // con.query("ALTER TABLE plate MODIFY COLUMN plate_ID_384 varchar(255)"
   // ,function (err, result) {
   //     if (err) {
   //     throw err;
    //    } 
            
    //    console.log("plate columns changed");
    //  });
    

   
    
});



//Home page
app.get('/', function (req, res){
    res.render(__dirname + '/index.ejs');
    

})


var plate_obj = {};

//plate page
app.get('/plate', function (req, res){

    //query to get plate table from molecules db

    con.query("SELECT * FROM plate ORDER BY UCSC_CSC_plate_ID ASC", function (err, result) {
        if (err) {
        throw err;
        } else {
            plate_obj = {print: result};
            //console.log(plate_obj);
            res.render('plate', plate_obj);
            
        }
       console.log(result);
      });

   // res.render(__dirname + '/plate.ejs' );

})

app.get('/plate/id', function (req, res){

    //query to get plate table from molecules db
    var var_id = req.params.id;

    var queryString = 'SELECT * FROM plate WHERE id=' + var_id;



    con.query(queryString, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_plate_obj = {single_plate: result};
                res.render('oneplate', single_plate_obj);
                
            }
           console.log(result);
     
    });

})



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    //res.write('Hello Molecules!');
});