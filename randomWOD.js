// initialize the database connection
var mysql = require('mysql');
var db = require('./dbconfig.js')
var pool = mysql.createPool(db.config); 

// express web application framework
var express = require('express');  // typeof express is a function
var app = express();     // calls the express function and returns a function/object

// handlebars template engine
//   default layout is set to layouts/main.handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// glue express and handlebars together
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');

// http request post body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// chose endpoint (port) for the web application
const PORT = process.env.PORT || 5883;
app.set('port', PORT);

// static content in public folder
app.use(express.static('public'));

app.get('/',function(req,res){

	pool.query('SELECT equipment_name FROM Equipment ORDER BY equipment_name ASC ', function(err, rows, fields){
		
		if(err) {
		  console.log(err);
		  res.status(500);
		  res.render('500');
		  return;
		}
		console.log(rows);

		var eArray = [];
		rows.forEach((item) => { eArray.push(item.equipment_name)});

		// home.handlebars
		res.render('home', {equipment: eArray}); 

	});
});

app.get('/previous',function(req,res){

	pool.query('SELECT movement_name FROM wodmovements ORDER BY movement_name ASC', function(err, rows, fields){
		
		if(err){
		  console.log(err);
		  res.status(500);
		  res.render('500');
		  return;
		}

		// array of row objects
		// [ { movement_name: 'Handstand Hold' }, ... ]
		console.log(rows);

		// create array of strings
		var mArray = [];
		rows.forEach((item) => { mArray.push(item.movement_name)});

		pool.query('SELECT WOD_name FROM WOD ORDER BY WOD_name ASC', function(err, rows, fields){
			
			if(err){
			  console.log(err);
			  res.status(500);
			  res.render('500');
			  return;
			}
			
			// array of row objects
			// [{ WOD_name: 'CINDY' },{ WOD_name: 'HAVANA' },...]{
			console.log(rows);
	
			// create array of strings
			var wArray = [];
			rows.forEach((item) => { wArray.push(item.WOD_name)});

			// previous.handlebars
			res.render('previous', {id: ['1','2','3'], movements:mArray, wodNames:wArray}); 
		});
	});
});

app.get('/about',function(req,res){
	res.render('about');
});

app.get('/terms',function(req,res){
	res.render('terms');
});

app.get('/privacy',function(req,res){
	res.render('privacy');
});
app.get('/findwod',function(req,res){

	console.log(req.query.wodName);

	pool.query('SELECT * FROM WOD WHERE WOD_name = ?', [req.query.wodName], function(err, rows, fields){
		
		if(err){
		  console.log(err);
		  res.status(500);
		  res.send("Something has gone wrong");
		  return;
		}
		console.log(rows);

		res.send(JSON.stringify(rows[0]));
	});

});

app.post('/getwod', function(req,res){

	console.log("received post request to get WOD");

	// logs the post body
	for (var p in req.body)
	{
		console.log(req.body[p]);
	}

	equipmentArray = req.body["checkedEquip"];
	var WODExes = [{}, {}, {}];

	//query database
	pool.query('SELECT * FROM WODMovements JOIN Equipment ON Equipment.equipment_id = WODMovements.equipment_id WHERE Equipment.equipment_name IN (?) ORDER BY Equipment.equipment_name ASC', [equipmentArray], function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}

		if (rows.length < 3)
		{
			WODExes.length = rows.length;
		}
		console.log(rows[0].movement_name);

		//check that there is enough variation in movements
		var moveTypes = [];
		var exists;
		for (var i = 0; i < rows.length; i++)
		{
			exists = false;
			if (moveTypes.includes(rows[i].move_type_id))
			{
				exists = true;
			}
			if (exists == false)
			{
				moveTypes.push(rows[i].move_type_id);
			}
		}
		if (moveTypes.length < WODExes.length)
		{
			WODExes.length = moveTypes.length;
		}
		  
		var randNum = 0;
		var exerciseIdArray = [];
		 
		var randReps = "0";
		
		moveTypes = [];
		for (var i = 0; i < WODExes.length; i++)
		{
			do 
			{
				var randNum = Math.floor(Math.random() * rows.length);
				console.log("randNum: " + randNum);
				console.log("movement type: " + rows[randNum].move_type_id);
			}
			while(exerciseIdArray.includes(randNum) || moveTypes.includes(rows[randNum].move_type_id));
			//not enough data to make movement types unique right now ^
			exerciseIdArray.push(randNum);
			moveTypes.push(rows[randNum].move_type_id);
		
			//prepare exercise reps/name/weight to send to client
			WODExes[i].reps = randReps;
			WODExes[i].name = rows[randNum].movement_name;
			WODExes[i].weight = rows[randNum].movement_weight;
			WODExes[i].move_type_id = rows[randNum].move_type_id;

		}
		console.log("Debugging Info:\n");
		console.log(WODExes);
		console.log(moveTypes);
		console.log(exerciseIdArray);
		
		// sends exercises back to client
	  	res.send(JSON.stringify(WODExes));
	});
});

app.post('/savewod', function(req,res){

	console.log("received post request to save WOD");

	var WODtoSave = req.body["movement"];
	WODtoSave.push(req.body['WODname']);
	WODtoSave.push(req.body['time']);

	console.log(WODtoSave);

	var sql = "INSERT into WOD (movement_1, movement_2, movement_3, WOD_name, time) VALUES (?)";

	pool.query(sql, [WODtoSave], function (err, result) {
		if (err)
		{
			console.log(err);
			res.status(500);

			if (err.code == "ER_DUP_ENTRY")
			{
				res.send(req.body.WODname + " already exists! Please choose a new name.");
			}
			else
			{
				res.send("Invalid input");
			}
			
			return;
		}
		console.log("saved WOD inserted into database");

		res.send("success");
	});
});

app.post('/savemove', function(req,res) {

	console.log(req.body);
	req.body.WODname = req.body.WODname.toUpperCase();
	var movements = [];
	for (var i = 1; i < 4; i++)
	{
		if (((req.body["Mweight_"+i] == 0) && (req.body["Wweight_"+i] == 0)) || ((req.body["Mweight_"+i] === "") && (req.body["Wweight_"+i] === "")))
		{
			movements.push(req.body["reps_"+i] + " " + req.body["units_"+i] + " " + req.body["movement_"+i]);
		}
		else 
		{
			movements.push(req.body["reps_"+i] + " " + req.body["units_"+i] + " " + req.body["movement_"+i] + " (" + req.body["Mweight_"+i] + " / " + req.body["Wweight_"+i] + " lbs)");
		}
	}
	movements.push(req.body.WODname);
	movements.push(req.body.time);
	console.log(movements);

	var sql = "INSERT into WOD (movement_1, movement_2, movement_3, WOD_name, time) VALUES (?)";

	pool.query(sql, [movements], function (err, result) {
		if (err)
		{
			console.log(err);
			res.status(500);

			if (err.code == "ER_DUP_ENTRY")
			{
				res.send(req.body.WODname + " already exists! Please choose a new name.");
			}
			else
			{
				res.send("Invalid input");
			}
			
			return;
		}
		console.log("saved WOD inserted into database");
		res.send("success");
	});	
});

app.get('/dogs',function(req,res){
	res.render('dogs');
});



// error handler for missing page
app.use(function(req,res){
	res.status(404);
	res.render('404');
});

// general error handler
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

// start listening for client requests
app.listen(app.get('port'), () => {
    console.log(`Our app is running on port ${ PORT }`);
});

