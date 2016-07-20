
/*THIS BLOCK OF CODE IS INITIAL SETUP AND PULLED FROM THE LECTURES*/
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*END OF BLOCK*/


app.get('/', function(req, res){
	var dataSent = []; //array to hold passed data
	var context = {}; //context object
	for (var d in req.query)
	{
		dataSent.push({'name': d, 'value': req.query[d]});
	}
	
	context.dataGet = dataSent;
	res.render('get', context);
});

app.post('/', function(req, res){
	var dataSent = []; //array to hold passed data
	var context = {};
	
	for (var d in req.body)
	{
		dataSent.push({"name": d, "value": req.body[d]});
	}
	
	context.dataPost = dataSent;
	res.render('post', context);
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