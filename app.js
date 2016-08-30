//set up express and handlebars 
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3001);
app.use(express.static('public'));


//pool setup
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

//selecting data
app.get('/', function(req, res, next){
	var context = {}
	pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date,'%Y-%m-%d') AS date, lbs FROM `workouts`", function(err, rows, fields){ //select all data from table
		if(err){
			next(err);
			return;
		}
		
		var workoutData = [];
		for (var d in rows){
			workoutData.push({'id':rows[d].id, 'name': rows[d].name, 'reps':rows[d].reps, 'weight':rows[d].weight, 'date':rows[d].date, 'pound':rows[d].lbs})
		}
		
		context.workout = workoutData; //set context
		res.render('home', context); //render data from workouts table 
	});
});

//insert data
app.get('/insert',function(req,res,next){
  pool.query("INSERT INTO `workouts` (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.pound], function(err, result){
    if(err){
      next(err);
      return;
    }
	var context = {};
	context.workID = result.insertId; //get insert ID
    res.send(JSON.stringify(context)); //send insert ID so that table can be updated 
  });
});


//edit data form
app.get('/editForm', function(req, res, next){
	var context = {};
    pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date,'%Y-%m-%d') AS date, lbs FROM `workouts` WHERE id=?",[req.query.id],function(err, rows, fields){ //pull data from proper row to prefill form with
	if(err){
	   next(err);
	   return;
	}	
	var workoutData = [];
   	for(var d in rows){
	    workoutData.push({'id':rows[d].id, 'name': rows[d].name, 'reps':rows[d].reps, 'weight':rows[d].weight, 'date':rows[d].date, 'pound':rows[d].lbs})
   }
   	context.workout = workoutData[0]; //set context
	res.render('edit',context); //render editform page with prepopulated table data
  });
});


//apply edit to database
app.get('/edit', function(req, res, next) {
    var context = {};
    pool.query("UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id = ?", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.pound, req.query.id], function(err, result) {
		pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date,'%Y-%m-%d') AS date, lbs FROM `workouts`", function(err, rows, fields){ //after update, run select all query
            if(err){
                next(err);
                return;
            } 
	   var workoutData = [];
	   for(var d in rows){
	   workoutData.push({'id':rows[d].id, 'name': rows[d].name, 'reps':rows[d].reps, 'weight':rows[d].weight, 'date':rows[d].date, 'pound':rows[d].lbs})
  	   }	
   	    context.workout = workoutData;
    	res.render('home',context); //render updated table data 
	 });   
    });
});

//delete entry from database
app.get('/delete', function(req, res, next) {
    var context = {};
    pool.query("DELETE FROM `workouts` WHERE id = ?", [req.query.id], function(err, result) {
        if(err){
            next(err);
            return;
        }
    });   
});


//reset table pulled from the lecture
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
    context.results = "Table reset";
    res.render('home',context);
    })
  });
});

//404 Handler pulled from lecture
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//500 Handler pulled from lecture
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log("Express started. CTRL-C to terminate")
});