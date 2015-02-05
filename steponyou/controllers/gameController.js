// Carpark controller:
// This controller is to manage all the functions related to the carparks. The
// controller will enable the following CRUD endpoints:
//
// GET /carpark         =>  getAllCarpark
// GET /carpark/:id     =>  getCarpark
// POST /carpark        =>  addCarpark
// PUT /carpark/:id     =>  updateCarpark
// DELETE /carpark/:id  =>  removeCarpark
// GET /carpark/search  =>  search
//
// =============================================================================

var mongoose = require('mongoose');
var Carpark = require('../models/carpark');
mongoose.connect('mongodb://localhost/surepark_dev');

// getAllCarparkCoordinate function retrieves locations for all the carparks in the database and sends
// it as a response to the GET request.
var getAllCarparkCoordinate = function(req,res){
	Carpark.find({},'name coordinate',function (err, carparks) {
		if (err){
			console.log(err);
			res.statusCode = 400;
			res.json({error: "No carpark(s) found"});
		}else{
			res.statusCode = 200;
			res.json(carparks);
		}
		res.end();
	});
}

// getAllCarpark function retrieves locations for all the carparks in the database and sends
// it as a response to the GET request.
var getAllCarpark = function(req,res){
	Carpark.find({},function (err, carparks) {
		if (err){
			console.log(err);
			res.statusCode = 400;
			res.json({error: "No carpark(s) found"});
		}else{
			res.statusCode = 200;
			res.json(carparks);
		}
		res.end();
	});
}

// getCarpark function retrieves a carpark from the database corresponding to
// the supplied ID
//
// it accepts the following parameters:
// id   =>  the carpark ID
// 
// Return values:
// json object containing the carpark instance corresponding to the received ID
var getCarpark = function(req,res){
	
    Carpark.findById(req.params.id,function (err, carpark) {
		if (err) {
			console.log(err);
			res.statusCode = 400;
			res.json({error: "Bad request"});
		}else if(!carpark){
			console.log(err);
			res.statusCode = 404;
			res.json({error: "No carpark found"});
		}else{
			res.statusCode = 200;
			res.json(carpark);
		}
		res.end();
	});
 
}

// addCarpark function inserts a carpark document in the database
// and returns the _id of the inserted document
//
// it accepts the following parameters:
// name     =>  the carpark name
// location =>  {"longitude":30.32322,"latitude":56.32443}
// tariff   => 
//
// [{
//      "startTime":{
//                      "day":1,
//                      "hour":9,
//                      "min":30
//      },
//      "endTime":{
//                      "day":1,
//                      "hour":10,
//                      "min":30
//      },
//      "cost":{
//                 "entry":2,
//                  "firstHour":1,
//                  "recur":{
//                              "max":20,
//                              "price":0.2,
//                              "pitch":30
//                          }
//             }
//  },
//  
//  ...
//  
//  ]
//
//
// remark   =>  [{"value":"remark"},{"value":"remark1"}, ... ]
// Return values:
// inserted document id
var addCarpark = function(req,res){
    carpark = new Carpark();
    carpark.name = req.body.name;
    carpark.address = req.body.address;
    carpark.lots = [];
    carpark.coordinate = JSON.parse(req.body.coordinate);
    carpark.costModels = JSON.parse(req.body.costModels);
    carpark.remarks = JSON.parse(req.body.remarks);
    console.log(carpark);
    carpark.save(function(err,car){
		if(err){
			res.statusCode = 400;
			res.json({error: err});
		}else{
			res.statusCode = 201;
			res.json({id: car._id});
		}
		res.end();
    });
}

// updateCarpark function updates an existing carpark document in the database
// and returns a status
//
// it accepts the following parameters:
// update   => E.g. { "name": "new name"} 
// 
// Return values:
// status   =>  1 for done successfully, 0 for error
var updateCarpark = function(req,res){

    var query = {"_id": req.params.id};
    var update = JSON.parse(req.body.update);
    Carpark.findOneAndUpdate(query, update, function(error, carpark) {
        if(error){
            console.log(error);
            res.statusCode = 422;
            res.json({error: "Failed to update"});
        }else{
            console.log(carpark);
            res.statusCode = 204;
        }
        res.end();
    });
	
}

// removeCarpark function removes an existing carpark document from the database
// and returns a status
//
// it accepts the following parameters:
// id   =>  The id of the carpark to be removed
// 
// Return values:
// status   =>  1 for done successfully, 0 for error
var removeCarpark = function(req,res){
	
    var query = {"_id": req.params.id};
    Carpark.findOneAndRemove(query, function (error) {
        if(error){
            console.log(error);
            res.statusCode = 400;
            res.json({error: "Failed to remove"});
        }else{
            res.statusCode = 204;
        }
        res.end();
	});

}

// search function retrieves an existing carpark(s) document(s) from the
// database and returns the json array string
//
// it accepts the following parameters:
// name         =>  name to search
// tariff       =>  net parking charge
// parkingTime  =>  desired parking time
// location     =>  the desired location
// 
// Return values:
// json array string of carparks
var search = function(req,res){
	res.write("hello from search");
	res.end();
}

// Export all the controller functions to be used by the router.
module.exports = {
	getAllCarparkCoordinate   :   getAllCarparkCoordinate,
	getAllCarpark   :   getAllCarpark,
	getCarpark      :   getCarpark,
	addCarpark      :   addCarpark,
	updateCarpark   :   updateCarpark,
	removeCarpark   :   removeCarpark,
	search          :   search
}
