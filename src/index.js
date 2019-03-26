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
    password: "Molecules82",
    database: 'molecules'
});


//check if db is connected
con.connect(function(err){
    if (err) throw err;
   
    console.log("Connected to molecules database");
    console.log("connected!");
});



//***************************INDIVIDUAL PAGE ROUTES******************************************* */

//Home page
app.get('/', function (req, res){
    res.render(__dirname + '/views/platelist.ejs');
})




var plate_obj = {};

//***************page to display all plates with all datasets***********************************

app.get('/plates', function (req, res){

    //query to get plate table from molecules db

    con.query("SELECT * from plate", function (err, result) {
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


//**************************individual page for a plate*******************************
app.get('/plates/:id', function (req, res){

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



//*********************** HOME PAGE and UNIQUE PLATE NAME LIST PAGE**************************************** 

app.get('/platelist', function (req, res){

    //query to get platelist table from molecules db which has plate names by unique name
    con.query("SELECT * from platelist", function (err, result) {
        if (err) {
        throw err;
        } else {
            platelist_obj = {print: result};
            res.render('platelist', platelist_obj);  
        }
       console.log(result);
      });
})

//***************SINGLE PLATELIST PAGE THAT DISPLAYS ALL ITS DATASETS */
app.get('/platelist/:id', function (req, res){
    var plate_unique_id = req.params.id;
        
     var plate_datasets = 'SELECT platelist.unique_plate_id, c1.dataset_id, c1.pairset_A, c1.pairset_B, c1.UCSC_CSC_plate_ID, c1.Magnification, c1.TimePoint, c1.Cell_lines, c1.experiment_date FROM cell_plate_identical c1 INNER JOIN platelist ON (platelist.UCSC_CSC_plate_ID = c1.UCSC_CSC_plate_ID)  WHERE platelist.unique_plate_id=' + plate_unique_id ;
 
 
     con.query(plate_datasets, function (err, result) {
         if (err) {
         throw err;
         } else {
             platelist_obj = {print: result};
             res.render('datasets', platelist_obj);
             
         }
        console.log(result);
       });

})



//*************************SINGLE DATASET RETRIEVING PAGE **************************/
app.get('/platelist/:id/dataset/:id', function (req, res){

   
   // var pair_order = ' ORDER BY plate_pair_id ASC' ;
   
    
    var dataset_id = req.params.id;

    var datasetQuery = 'SELECT plate.UCSC_CSC_plate_ID, plate.Cell_lines, plate.TimePoint, plate.Magnification, plate.experiment_date FROM plate INNER JOIN cell_plate_identical ON (cell_plate_identical.UCSC_CSC_plate_ID=plate.UCSC_CSC_plate_ID AND cell_plate_identical.Cell_lines = plate.Cell_lines AND cell_plate_identical.experiment_date = plate.experiment_date ) WHERE cell_plate_identical.dataset_id=' + dataset_id;



    con.query(datasetQuery, function (err, result) {
        if (err) {
        throw err;
        } else {
            
            dataset_obj = {dataset: result};
            
            res.render('dataset', dataset_obj);
            
        }
        
        console.log(result);
      
      });
 
   
 
 })



//test page
app.get('/pairtest', function (req, res){


    var req_id = req.params.id;

  

  //var queryString = 'SELECT * FROM plate WHERE id=' + var_id;
   
   con.query("SELECT * FROM cell_plate_identical ", function (err, result) {
       if (err) {
       throw err;
       } else {
           
           test_obj = {testing: result};
           

           res.render('test', test_obj);
           
       }
       
       console.log(result);
     
     });

  

})

app.get('/wellset', function (req, res){

    //query to get plate table from molecules db
    var well_id = req.params.id;
    

    var queryString = 'SELECT * FROM platewells';
    // WHERE id=' + well_id;

    con.query(queryString, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_well_obj = {well: result};
                res.render('wellset', single_well_obj);
                
            }
           console.log(result);
     
    });

})

app.get('/wells', function (req, res){

    //query to get plate table from molecules db
    var well_id = req.params.id;
    

    var queryString = 'SELECT * FROM Wells';
    // WHERE id=' + well_id;

    con.query(queryString, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_well_obj = {well: result};
                res.render('wells', single_well_obj);
                
            }
           console.log(result);
     
    });

})


//******************************************ROUTES END HERE*********************************************** */




app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    
});