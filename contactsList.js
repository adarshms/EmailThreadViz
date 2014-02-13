
function contactsList() {
	
	var emailData = [];

	var colors = ["#00C1C2", "#1D8290", "#1C517E", "#023255"];

	var margin = {top: 0, right: 10, bottom: 0, left: 10},
	    width = document.getElementById('chart-area').offsetWidth - 250,
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

	var contactsDiv = d3.select(".contactsDiv")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

	var contacts = d3.select(".list-group")
		.attr("width", 200)
		.attr("height", height)
			
	var graph = d3.select(".graphSvg")
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate("+margin.left+","+margin.top+")");
		
	var tooltipDiv = d3.select("body").append("div")
		.attr("class", "contooltip")
		.style("opacity", 0.8);
	 
	function dataLoaded() {
		contacts.attr("height", contactsData.length*25);

		var y = d3.scale.ordinal()
			.domain(contactsData.map(function(d) {return d.email;}))
			.rangeRoundBands([0, height], .1);

		contacts.selectAll("a")
			.data(contactsData)
			.enter().append("a")
			.attr("href", "#")
			.attr("y", function(d, i) {return i*25;})
			.attr("class", "list-group-item")
			.attr("id", function(i) {return "contact"+i.user_id;})
			.text(function(i) {return i.email;})
			.on("click", function(i) {
				contacts.selectAll("a").attr("class", "list-group-item");
				contacts.select("#contact"+i.user_id).attr("class", "list-group-item active");
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
				returnObject.numPeople = d[2];
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
			.enter().append("g");
		
		bar.append("rect")
			.attr("x", function(d) {return x(d.x);})
		    .attr("y", function(d) {return height/2-5*d.y;})
		    .attr("width", x.rangeBand())
		    .attr("height", function(d) {return 10*d.y;})
		    .style("fill", function(d) {
		    	if (d.numPeople >= 10)
		    		return colors[3];
		    	else if (d.numPeople >= 7)
		    		return colors[2];
		    	else if (d.numPeople >= 4)
		    		return colors[1];
		    	else
		    		return colors[0];
		    })
		    .on("mouseover", function(d) {
		    	tooltipDiv.transition()
		    		.duration(200)
		    		.style("opacity", .9);
		    	tooltipDiv.html(d.y + " messages<br>between<br>"+d.numPeople+ " people")
		    		.style("left", (d3.event.pageX + 10)+"px")
		    		.style("top", (d3.event.pageY + 10)+"px");
		    })
		    .on("mouseout", function(d) {
		    	tooltipDiv.transition()
		    		.duration(500)
		    		.style("opacity", 0);
		    });
		    	
		graph.append("g")
		    .attr("class", "conaxis")
		    .attr("transform", "translate(0," + height/2 + ")")
		    .call(xAxis);
	}

}