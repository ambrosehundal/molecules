//dependencies

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

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));



//set the view engine
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
    console.log("Running in :"  + process.env.NODE_ENV);
    console.log("Connected to molecules database");
    console.log("connected!");
});



//****************PAGE ROUTES********************** */

//Home page
app.get('/', function (req, res){
    res.render(__dirname + '/index.ejs');
})


var plate_obj = {};

//plate page
app.get('/plates', function (req, res){

    //query to get plate table from molecules db

    con.query("SELECT * from plate_directory", function (err, result) {
        if (err) {
        throw err;
        } else {
            plate_obj = {print: result};
            //console.log(plate_obj);
            res.render('plates', plate_obj);
            
        }
       console.log(result);
      });

   

})




//individual page for a plate
app.get('/plates/:id', function (req, res){

    //query to get plate table from molecules db
    var var_id = req.params.id;
    console.log("Var ID is: " + var_id);

    var queryString = 'SELECT * FROM plate WHERE id=' + var_id;



    con.query(queryString, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_plate_obj = {single_plate: result};
                res.render('oneplate', single_plate_obj);
                
            }
         //  console.log(result);
     
    });

})

//test page
app.get('/test', function (req, res){


    var req_id = req.params.id;

    console.log(req_id);
   
  

  //var queryString = 'SELECT * FROM plate WHERE id=' + var_id;
   
   con.query("SELECT * FROM plate WHERE UCSC_CSC_plate_ID = 'SP0127' ", function (err, result) {
       if (err) {
       throw err;
       } else {
           
           test_obj = {testing: result};
           

           res.render('test', test_obj);
           
       }
       
      // console.log(result);
     
     });

  

})

app.get('/wells/:id', function (req, res){

    //query to get plate table from molecules db
    var well_id = req.params.id;
    

    var queryString = 'SELECT * FROM Wells WHERE id=' + well_id;



    con.query(queryString, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_well_obj = {single_well: result};
                res.render('onewell', single_well_obj);
                
            }
           console.log(result);
     
    });

})

app.get('/plate/plateid/', function (req, res){

    //query to get plate table from molecules db
    var well_id = req.params.id;
    

    var queryString = 'SELECT * FROM Wells WHERE UCSC_CSC_plate_ID = SP0127'; 



    con.query(queryString, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_well_obj = {single_well: result};
                res.render('onewell', single_well_obj);
                
            }
           console.log(result);
     
    });

})






app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    //res.write('Hello Molecules!');
});