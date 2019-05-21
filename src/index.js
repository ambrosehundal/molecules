//dependencies

const http = require('http');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLint = require('ejs-lint');
const GeoTIFF = require('geotiff');

//router
//var routes = require('./routes');

//var router = express.Router();




//initialize app
const app = express();

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

//to use css files
//app.use(express.static(__dirname, 'stylesheets'));

//set the view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

var imageDir = require('path').join(__dirname,'/4447');

app.use(express.static(imageDir));


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

app.get('/', function (req, res){

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
        
     var plate_datasets = 'SELECT platelist.unique_plate_id, c1.dataset_id, c1.pairset_A, c1.pairset_B, c1.UCSC_CSC_plate_ID, c1.Magnification, c1.TimePoint, c1.Cell_lines, c1.experiment_date FROM cell_plate_pairs c1 INNER JOIN platelist ON (platelist.UCSC_CSC_plate_ID = c1.UCSC_CSC_plate_ID)  WHERE platelist.unique_plate_id=' + plate_unique_id ;
 
 
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

    var datasetQuery = 'SELECT plate_wells.well_name, plate_wells.UCSC_CSC_plate, plate_wells.Cell_lines, plate_wells.TimePoint, plate_wells.Magnification, plate_wells.experiment_date, compounds.molecule_name FROM plate_wells INNER JOIN cell_plate_pairs ON (cell_plate_pairs.UCSC_CSC_plate_ID=plate_wells.UCSC_CSC_plate AND cell_plate_pairs.Cell_lines = plate_wells.Cell_lines AND cell_plate_pairs.experiment_date = plate_wells.experiment_date ) INNER JOIN compounds ON (plate_wells.UCSC_CSC_plate=compounds.UCSC_CSC_plate_ID AND plate_wells.well_name = compounds.well)  WHERE cell_plate_pairs.dataset_id=' + dataset_id;



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
   
   con.query("SELECT * FROM cell_plate_pairs ", function (err, result) {
       if (err) {
       throw err;
       } else {
           
           test_obj = {testing: result};
           

           res.render('test', test_obj);
           
       }
       
       console.log(result);
     
     });

  

})



app.get('/wells/:id', function (req, res){

    //query to get plate table from molecules db
    var well_id = req.params.id;
    

    var queryString = 'SELECT w1.w1_filepath, w1.stainset_number, w1.site_number, p1.id, p1.well_name, p1.UCSC_CSC_plate, p1.Cell_lines, p1.Magnification, p1.TimePoint, p1.experiment_date, compounds.molecule_name FROM plate_wells p1 INNER JOIN wavelength_1 w1 ON (p1.UCSC_CSC_plate = w1.plate_name AND p1.well_name = w1.well_name AND p1.Cell_lines = w1.cell_line AND p1.timepoint = w1.timepoint ) INNER JOIN compounds ON (p1.UCSC_CSC_plate = compounds.UCSC_CSC_plate_ID AND p1.well_name = compounds.Well)  WHERE p1.id=' + well_id;
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


//*****************************************MOLECULE COMPOUND SEARCH PAGE */
app.get('/compounds', function (req, res){

    //query to get plate table from molecules db
    var well_id = req.params.id;
    

    var compoundQuery = 'SELECT DISTINCT molecule_name FROM compounds LIMIT 10';
    // WHERE id=' + well_id; 

    con.query(compoundQuery, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_well_obj = {well: result};
                res.render('compounds', single_well_obj);
                
            }
           console.log(result);
     
    });

})


//*****************************COMPOUND SEARCH RESULTS PAGE ************************/

app.get('/mycompound', function (req, res){

    var search_text = req.query.compound;
    
    var cats = "%";

    var search_name = search_text.concat(cats);

    var double_up = cats.concat(search_name);

    var compound_search = "'" + double_up + "'";

    console.log(double_up);

    var compoundQuery = 'SELECT * FROM compounds WHERE molecule_name LIKE ' + compound_search;
    // WHERE id=' + well_id; 

    con.query(compoundQuery, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_well_obj = {well: result};
                res.render('one_compound', single_well_obj);
                
            }
           console.log(result);
     
    });

})





//******************************************ROUTES END HERE*********************************************** */




app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    
});