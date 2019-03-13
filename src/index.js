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
    console.log("Running in :"  + process.env.NODE_ENV);
    console.log("Connected to molecules database");
    console.log("connected!");
});



//***************************INDIVIDUAL PAGE ROUTES******************************************* */

//Home page
app.get('/', function (req, res){
    res.render(__dirname + '/index.ejs');
})




var plate_obj = {};

//page to display all plates with all datasets

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
            //console.log(plate_obj);
            res.render('platelist', platelist_obj);  
        }
       console.log(result);
      });
})


// GET ALL PLATES RELATED from plate table that are linked TO UNIQUE PLATE NAME in platelist table
/*app.get('/platelist/:id', function (req, res){

    //query to get all plates related to a unique_plate_ID eg. SP0127 gets all 16 instances
    var plate_unique_id = req.params.id;
    console.log("plate unique ID is: " + plate_unique_id);
   
    var pair_order = ' ORDER BY plate_pair_id ASC' 
   
    var platelistquery = 'SELECT plate.plate_pair_id, plate.UCSC_CSC_plate_ID, plate.Cell_lines, plate.TimePoint, plate.Magnification, plate.experiment_date FROM plate INNER JOIN platelist ON (platelist.unique_plate_id=plate.unique_plate_id) WHERE plate.unique_plate_id=' + plate_unique_id + pair_order;
   


    con.query(platelistquery, function (err, result) {
        if (err) {
        throw err;
        } else {
            platelist_obj = {print: result};
            res.render('oneplatelist', platelist_obj);
            
        }
       console.log(result);
      });   

})
*/

app.get('/platelist/:id', function (req, res){

    //query to get all plates related to a unique_plate_ID eg. SP0127 gets all 16 instances
   /* var plate_unique_id = req.params.id;
    console.log("plate unique ID is: " + plate_unique_id);
   
    var pair_order = ' ORDER BY plate_pair_id ASC' 
   
    var platelistquery = 'SELECT plate.plate_pair_id, plate.UCSC_CSC_plate_ID, plate.Cell_lines, plate.TimePoint, plate.Magnification, plate.experiment_date FROM plate INNER JOIN platelist ON (platelist.unique_plate_id=plate.unique_plate_id) WHERE platelist.unique_plate_id=' + plate_unique_id + pair_order;
   
   
    

   // INNER JOIN platelist ON (plate.unique_plate_id=platelist.unique_plate_id)
    con.query(platelistquery, function (err, result) {
        if (err) {
        throw err;
        } else {
            platelist_obj = {print: result};
            res.render('oneplatelist', platelist_obj);
            
        }
       console.log(result);
      });   

      */

     var plate_unique_id = req.params.id;
     console.log("plate unique ID is: " + plate_unique_id);
    
     var pair_order = ' ORDER BY plate_pair_id ASC' 
    
    // var platelistquery = 'SELECT DISTINCT plate.unique_plate_id, plate.UCSC_CSC_plate_ID, plate.Cell_lines, plate.TimePoint, plate.Magnification, plate.experiment_date, plate.plate_pair_id FROM plate INNER JOIN platelist ON (platelist.unique_plate_id=plate.unique_plate_id) WHERE plate.unique_plate_id=' + plate_unique_id + pair_order;
    
     var plate_datasets = 'SELECT paired_plates.plate_pair_id, platelist.UCSC_CSC_plate_ID FROM platelist INNER JOIN paired_plates ON (platelist.unique_plate_id = paired_plates.unique_plate_id) WHERE platelist.unique_plate_id=' + plate_unique_id + pair_order;
 
 
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

app.get('/platelist/:id/datasets', function (req, res){


    //try creating a separate table for pair plates

    //query to get all plates related to a unique_plate_ID eg. SP0127 gets all 16 instances
    var plate_unique_id = req.params.id;
    console.log("plate unique ID is: " + plate_unique_id);
   
    var pair_order = ' ORDER BY plate_pair_id ASC' 
   
   // var platelistquery = 'SELECT DISTINCT plate.unique_plate_id, plate.UCSC_CSC_plate_ID, plate.Cell_lines, plate.TimePoint, plate.Magnification, plate.experiment_date, plate.plate_pair_id FROM plate INNER JOIN platelist ON (platelist.unique_plate_id=plate.unique_plate_id) WHERE plate.unique_plate_id=' + plate_unique_id + pair_order;
   
    var plate_datasets = 'SELECT paired_plates.plate_pair_id, platelist.UCSC_CSC_plate_ID FROM platelist INNER JOIN paired_plates ON (platelist.unique_plate_id = paired_plates.unique_plate_id) WHERE platelist.unique_plate_id=' + plate_unique_id + pair_order;


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
app.get('/platelist/:id/datasets/:id', function (req, res){

   
    var pair_order = ' ORDER BY plate_pair_id ASC' ;
   
    
    var pair_id = req.params.id;

    var pairQuery = 'SELECT plate.plate_pair_id, plate.UCSC_CSC_plate_ID, plate.Cell_lines, plate.TimePoint, plate.Magnification, plate.experiment_date  FROM plate INNER JOIN paired_plates ON (plate.plate_pair_id=paired_plates.plate_pair_id) WHERE paired_plates.plate_pair_id=' + pair_id;



    con.query(pairQuery, function (err, result) {
        if (err) {
        throw err;
        } else {
            
            paired_test_obj = {pairedtest: result};
            
 
            res.render('oneset', paired_test_obj);
            
        }
        
        console.log(result);
      
      });
 
   
 
 })

 app.get('/platelist/:id/datasets/:id/wells', function (req, res){

   
  //  var pair_order = ' ORDER BY plate_pair_id ASC' ;
   
    
    var pair_id = req.params.id;
   // console.log("Cell_Well_Id is" + well_id);

    var wellQuery = 'SELECT single_well_id, well_name, cell_well_id FROM paired_plates p1 INNER JOIN platewells cw ON p1.plate_pair_id=cw.plate_pair_id INNER JOIN Wells w on w.cell_well_id=cw.plate_well_id WHERE p1.plate_pair_id=' + pair_id;



    con.query(wellQuery, function (err, result) {
        if (err) {
        throw err;
        } else {
            
            paired_test_obj = {wells: result};
            
 
            res.render('welltally', paired_test_obj);
            
        }
        
        console.log(result);
      
      });
 
   
 
 })




//*******************************Plates by pair page*************************************
app.get('/datasets', function (req, res){

   con.query("SELECT * FROM paired_plates", function (err, result) {
       if (err) {
       throw err;
       } else {
           
           paired_plates_obj = {paired: result};
           

           res.render('datasets', paired_plates_obj);
           
       }
       
       console.log(result);
     
     });

  

})

//******************************ACCESSING A INDIVIDUAL PAIR **************************/
app.get('/datasets/:id', function (req, res){

   
    var pair_order = ' ORDER BY plate_pair_id ASC' ;
   
    
    var pair_id = req.params.id;

    var pairQuery = 'SELECT plate.plate_pair_id, plate.UCSC_CSC_plate_ID, plate.Cell_lines, plate.TimePoint, plate.Magnification, plate.experiment_date FROM plate INNER JOIN paired_plates ON (plate.plate_pair_id=paired_plates.plate_pair_id) WHERE paired_plates.plate_pair_id=' + pair_id;



    con.query(pairQuery, function (err, result) {
        if (err) {
        throw err;
        } else {
            
            paired_test_obj = {pairedtest: result};
            
 
            res.render('pairedtest', paired_test_obj);
            
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