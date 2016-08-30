var workForm = document.getElementById("workForm");

workForm.addEventListener("submit",function(event){
    var req = new XMLHttpRequest();
    var qStr = '/insert';
    
	var queryExt= "name="+workForm.elements.name.value+
				"&reps="+workForm.elements.reps.value+
				"&weight="+workForm.elements.weight.value+
				"&date="+workForm.elements.date.value+
				"&pound="+workForm.elements.pound.value;
    req.open("GET", qStr + "?" + queryExt,true);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	
    req.addEventListener('load',function(){
	if(req.status >= 200 && req.status < 400){
	    var response = JSON.parse(req.responseText);
		var id = response.workID;
		var table = document.getElementById("rwout"); 
	    updateTable(table, id);
	} 
	else
	{
		console.log("Error: " + req.statusText);
	}
    });
    req.send(qStr + "?" + queryExt);
	
	event.preventDefault();

});

function updateTable(table, id){
	
	    var row = table.insertRow(-1);		
		
	    var wid = document.createElement('td');
	    wid.textContent = id;
		wid.id="hidden";
	    row.appendChild(wid);
	    
	    var wname = document.createElement('td');
	    wname.textContent =workForm.elements.name.value;
	    row.appendChild(wname);

	    var wrep = document.createElement('td');
	    wrep.textContent = workForm.elements.reps.value;
	    row.appendChild(wrep);

	    var wweight = document.createElement('td');
	    wweight.textContent = workForm.elements.weight.value;
	    row.appendChild(wweight);

	    var wpound = document.createElement('td');
	    wpound.textContent = workForm.elements.pound.value;
	    row.appendChild(wpound);


	    var wdate = document.createElement('td');
	    wdate.textContent = workForm.elements.date.value;
	    row.appendChild(wdate);

	    var wedit = document.createElement('td');
	    wedit.innerHTML = '<input type="button" value="Edit" onclick="window.location.href=\'editForm?id='+id+'\';">';
	    row.appendChild(wedit);

	
	    var wdelete = document.createElement('td');
	    wdelete.innerHTML = '<input type="button" value="Delete" onclick="deleteRow(this, '+id+')">';
	    row.appendChild(wdelete);			
}

function deleteRow(thisbutton, id){
	var rowtoDel = thisbutton.parentNode.parentNode; //parentnode of button is data cell. parent of datacell is the row we want to delete
	var table = document.getElementById("rwout"); 
	var rowNums = table.rows.length; //number of rows to iterate through 
	
	var req = new XMLHttpRequest();
    var qStr = '/delete?id=' + id; //create query string
	
	req.open("GET", qStr, true); //make delete request
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.addEventListener('load',function(){
	if(req.status >= 200 && req.status < 400){
	    console.log('request sent');
	} else {
	    console.log('error. request not sent.');
	}
    });
    req.send(qStr); 
	//update table on page 
	for(var i = 0; i < rowNums; i++){ //loop through rows
		 if (table.rows[i] == rowtoDel) //when we get to row we want to delete
		 {
			 table.deleteRow(i); //delete row 
		 }
	}
};