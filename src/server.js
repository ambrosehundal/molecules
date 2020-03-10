//dependencies

const https = require('https');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLint = require('ejs-lint');
const moment = require('moment');

// module to serve static files 
var serveStatic = require('serve-static')





//initialize app
const app = express();

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));


//set the view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/JS'));


//set up for using static image files from another directory, change file path to borg1 server directory appropriately
app.use(serveStatic('/Users/ambrose/Desktop/'));





//local port
const port = 3000;


//create connection with MySQL database, change credentials when deploying, use ENV variables?
var con = mysql.createConnection({
    
    host:"localhost",
    user: "ambrose",
    password: "Molecules82",
    database: 'molecules',
    multipleStatements: true
});


//check if db is connected
con.connect(function(err){
    if (err) throw err;
   
    console.log("Connected to molecules database");
    console.log("connected!");
});



//***************************INDIVIDUAL PAGE ROUTES******************************************* */





var plate_obj = {};





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


   

    // var compoundQuery = '' + compound_search;

    var sql = "SELECT * from platelist;";

    //query to get platelist table from molecules db which has plate names by unique name
    con.query(sql,  function (err, result) {
        if (err) {
        throw err;
        } else {
            platelist_obj = {print: result};
            res.render('homepage', platelist_obj);  
        }
    //    console.log(result);
      });
})




//***************SINGLE PLATELIST PAGE THAT DISPLAYS ALL ITS DATASETS */
app.get('/platelist/:id', function (req, res){
    var plate_unique_id = req.params.id;
        
     var plate_datasets = 'SELECT distinct p1.plate_pair_id, p1.UCSC_CSC_plate_ID, p1.Cell_lines, p1.TimePoint, p1.Magnification, p1.experiment_date FROM molecules.plate p1 INNER JOIN molecules.platelist p2 ON (p1.UCSC_CSC_plate_ID = p2.UCSC_CSC_plate_ID) where p2.unique_plate_id=' + plate_unique_id ;
 
 
     con.query(plate_datasets, function (err, result) {
         if (err) {
         throw err;
         } else {
             platelist_obj = {print: result};
            //  console.log(result[0].experiment_date);

            //loop through all experiment dates to convert date format to 'YYYY-MM-DD'

            for(let i = 0; i < result.length; i++){
                result[i].experiment_date = moment(Date.parse(result[i].experiment_date)).format('YYYY-MM-DD');
            }
             res.render('datasets', platelist_obj);
             
         }

        
       });

})



//*************************SINGLE DATASET RETRIEVING PAGE **************************/
app.get('/dataset/:id', function (req, res){

   
   // var pair_order = ' ORDER BY plate_pair_id ASC' ;
   
    
    var dataset_id = req.params.id;

    var datasetQuery = 'SELECT distinct plate_wells.id, plate_wells.well_name, plate_wells.UCSC_CSC_plate, plate_wells.Cell_lines, plate_wells.TimePoint, plate_wells.Magnification, plate_wells.experiment_date, compounds.molecule_name, compounds.Concentration FROM plate_wells INNER JOIN plate ON (plate.UCSC_CSC_plate_ID=plate_wells.UCSC_CSC_plate AND plate.Cell_lines = plate_wells.Cell_lines AND plate.experiment_date = plate_wells.experiment_date AND plate.Magnification = plate_wells.Magnification ) INNER JOIN compounds ON (plate_wells.UCSC_CSC_plate=compounds.UCSC_CSC_plate_ID AND plate_wells.well_name = compounds.well)  WHERE plate.plate_pair_id=' + dataset_id;



    con.query(datasetQuery, function (err, result) {
        if (err) {
        throw err;
        } else {
            
            dataset_obj = {dataset: result};
            for(let i = 0; i < result.length; i++){
                result[i].experiment_date = moment(Date.parse(result[i].experiment_date)).format('YYYY-MM-DD');
            }
            
            res.render('wells', dataset_obj);
            
        }
        
        console.log(result);
      
      });
 
   
 
 })




app.get('/wells/:id', function (req, res){

    // WELL ID NUMBER
    var well_id = req.params.id;

   
    // QUERY WITH MULTIPLE SQL STATEMENTS to obtain images from both stain sets (8 queries total)
    var well_images_sql = "SELECT distinct w1.w1_filepath, w1.w1, w1.site_number, w1.image_folder_name, p1.id, p1.well_name, p1.UCSC_CSC_plate, p1.Cell_lines, p1.Magnification, p1.TimePoint, p1.experiment_date FROM plate_wells p1 INNER JOIN wavelength_1 w1 ON (p1.UCSC_CSC_plate = w1.plate_name AND p1.well_name = w1.well_name AND p1.Cell_lines = w1.cell_line AND p1.timepoint = w1.timepoint ) WHERE w1.stainset_number = 1 and  p1.id=?; SELECT distinct w2.w2_filepath, w2.w2, w2.site_number, w2.image_folder_path, p1.id, p1.well_name, p1.UCSC_CSC_plate, p1.Cell_lines, p1.Magnification, p1.TimePoint, p1.experiment_date FROM plate_wells p1 INNER JOIN wavelength_2 w2 ON (p1.UCSC_CSC_plate = w2.plate_name AND p1.well_name = w2.well_name AND p1.Cell_lines = w2.cell_line AND p1.timepoint = w2.timepoint ) WHERE w2.stainset_number = 1 and w2.w2 = 'Golgi' and  p1.id =?; SELECT distinct w3.w3_filepath, w3.w3, w3.site_number, w3.stainset_number,  p1.id, p1.well_name, p1.UCSC_CSC_plate, p1.Cell_lines, p1.Magnification, p1.TimePoint, p1.experiment_date FROM plate_wells p1 INNER JOIN wavelength_3 w3 ON (p1.UCSC_CSC_plate = w3.plate_name AND p1.well_name = w3.well_name AND p1.Cell_lines = w3.cell_line AND p1.timepoint = w3.timepoint ) WHERE w3.stainset_number = 1  and p1.id=?; SELECT distinct w4.w4_filepath, w4.w4, w4.site_number, p1.id, p1.well_name, p1.UCSC_CSC_plate, p1.Cell_lines, p1.Magnification, p1.TimePoint, p1.experiment_date FROM plate_wells p1 INNER JOIN wavelength_4 w4 ON (p1.UCSC_CSC_plate = w4.plate_name AND p1.well_name = w4.well_name AND p1.Cell_lines = w4.cell_line AND p1.timepoint = w4.timepoint ) WHERE w4.stainset_number = 1  and  p1.id=?;SELECT c2.total_cells_Edu, c2.positive_ph3, c2.positive_edu, c2.similar_compounds, c2.corelation_score, c2.colorbar_filename, c1.molecule_name FROM compounds c1 INNER JOIN molecules.similar_compounds c2 INNER JOIN plate_wells w1 ON (c1.UCSC_CSC_plate_ID = w1.UCSC_CSC_plate AND c1.Well = w1.well_name) WHERE w1.id=?";
   
 con.query(well_images_sql, [well_id, well_id, well_id, well_id, well_id], function(err, results, fields) {   
    if (err) {
            throw err;
    } else {
            single_well_obj = {well: results};
            // for(let i = 0; i < results.length; i++){
            //     results[i].experiment_date = moment(Date.parse(results[i].experiment_date)).format('YYYY-MM-DD');
            // }
            res.render('images', single_well_obj);
                
            }
           console.log(results[0]);
        //    console.log(results[1]);
        //    console.log(results[2]);
        //    console.log(results[3]);

        //    console.log(results[4]);
      
    });


   



})


app.get('/search', function(req,res){
    console.log("Query is");
    var search_text = req.query.key;
    
    var cats = "%";

    var search_name = search_text.concat(cats);

    var double_up = cats.concat(search_name);

    var compound_search = "'" + double_up + "'";

    console.log(compound_search);

    con.query('SELECT molecule_name from compounds where molecule_name LIKE ' + compound_search,
    function(err, rows, fields) {

    if (err) throw err;
   
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].molecule_name);
    }
    var json_data = JSON.stringify(data);
    res.end(json_data);
    console.log(json_data);
    });
    

})






//*****************************COMPOUND SEARCH RESULTS PAGE ************************/

app.get('/mycompound', function (req, res){

    // WHERE id=' + well_id; 

    var search_text = req.query.compound;
    
    var cats = "%";

    var search_name = search_text.concat(cats);

    var double_up = cats.concat(search_name);

    var compound_search = "'" + double_up + "'";

    console.log(double_up);

    var compoundQuery = ' SELECT distinct c1.UCSC_CSC_plate_ID, c1.Concentration, c1.molecule_name, c1.Well, w1.Cell_lines, w1.Magnification, w1.TimePoint, w1.experiment_date, p1.plate_pair_id, w1.id as `well_id` FROM compounds c1 INNER JOIN plate_wells w1 on (c1.UCSC_CSC_plate_ID = w1.UCSC_CSC_plate) and (c1.Well = w1.well_name) INNER JOIN plate p1 on(p1.UCSC_CSC_plate_ID = w1.UCSC_CSC_plate) and (p1.Cell_lines = w1.Cell_lines) and (p1.TimePoint = w1.TimePoint) and (p1.Magnification = w1.Magnification) and (p1.experiment_date = w1.experiment_date) WHERE c1.molecule_name LIKE ' + compound_search;
    // WHERE id=' + well_id; 

    con.query(compoundQuery, function(err, result, fields) {
        if (err) {
            throw err;
            } else {
                single_well_obj = {well: result};
                for(let i = 0; i < result.length; i++){
                    result[i].experiment_date = moment(Date.parse(result[i].experiment_date)).format('YYYY-MM-DD');
                }
                res.render('compounds', single_well_obj);
                
            }
           console.log(result);
     
    });


})





//******************************************ROUTES END HERE*********************************************** */




app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    
});