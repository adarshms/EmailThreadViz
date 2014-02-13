
function contactsList() {
	
	var emailData = [];
	
	var colors = ["#20e2e4", "#00c1c2", "#30a2a9", "#1d8290", "#1d6a87", "#1d6a87", "#1c517e", "#0f426a", "#023255", "#01223b"];
	
	var margin = {top: 40, right: 10, bottom: 20, left: 10},
	    width = 860 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
	
	var contactsData = [];
	d3.csv("contacts.csv", function(data) {
		contactsData = data.map(function(d) {
			var returnObject = new Object();
			returnObject.user_id = d.user_id;
			returnObject.email = d.email;
			return returnObject;
		});
		dataLoaded();
	});
	
	var contacts = d3.select(".contactsSvg")
		.attr("width", 100)
		.attr("height", height)
		.style("float", "left");
		
	var graph = d3.select(".graphSvg")
		.attr("width", width)
		.attr("height", height);
	 
	function dataLoaded() {
		contacts.attr("height", contactsData.length*25);
	
		var y = d3.scale.ordinal()
			.domain(contactsData.map(function(d) {return d.email;}))
			.rangeRoundBands([0, height], .1);
	
		contacts.selectAll("text")
			.data(contactsData)
			.enter().append("text")
			.attr("y", function(d, i) {return i*25;})
			.attr("class", "contactName")
			.attr("name", function(i) {return i.email;})
			.text(function(i) {return i.email;})
			.on("click", function(i) {
				console.log(i.user_id + " clicked");
				loadEmailLength(i.user_id);
			});
	}
	
	function loadEmailLength(user_id) {
		d3.text("emailData/"+user_id+".csv", function(data) {
			var counter = 0;
			emailData = d3.csv.parseRows(data).map(function(d) {
				var returnObject = new Object();
				returnObject.timeStamp = d[0];
				returnObject.y = d[1];
				returnObject.x = counter;
				counter = counter + 1;
				return returnObject;
			});
			console.log(emailData);
			layers = emailData;
			emailLengthLoaded();
		});
	}
	
	function emailLengthLoaded() {
	
		graph.selectAll("g").remove();
	
		var x = d3.scale.ordinal()
		    .domain(emailData.map(function(d) {return d.x;}))
		    .rangeRoundBands([0, width], .08);
		
		var y = d3.scale.linear()
		    .domain([0, d3.max(emailData, function(d) {return d.y;})])
		    .range([height, 0]);
		
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .tickSize(0)
		    .orient("bottom");
		    
		var bar = graph.selectAll("g")
			.data(emailData)
			.enter().append("g")
			.attr("transform", function(d) {return "translate("+d.x+",0)";});
		
		bar.append("rect")
			.attr("x", function(d) {return x(d.x);})
		    .attr("y", function(d) {return height/2-5*d.y;})
		    .attr("width", x.rangeBand())
		    .attr("height", function(d) {return 10*d.y;})
		    .style("fill", function(d) {
		    	if (d.y >20)
		    		return colors[4];
		    	else if (d.y >9)
		    		return colors[3];
		    	else if (d.y > 6)
		    		return colors[2];
		    	else if (d.y > 3)
		    		return colors[1];
		    	else
		    		return colors[0];
		    });
		    	
		graph.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height/2 + ")")
		    .call(xAxis);
	}

}