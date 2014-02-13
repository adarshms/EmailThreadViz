function threadLength() {
	var width = document.getElementById('chart-area').offsetWidth - 10,
		barHeight = 10;


	var x = d3.scale.linear()
		.range([0, width]);

	var chart = d3.select(".chart")
		.attr("width", width);

	var svg = d3.select("lengthchart").append("svg")
		.attr("width", width)
		.attr("height", 100)
	  .append("g")

	d3.csv("length.csv", type, function(error, data) {
	x.domain([0, d3.max(data, function(d) { return d.value; })]);
	data.sort(function(a,b) { return d3.descending(a.value,b.value);})
	chart.attr("height", barHeight * data.length);
	var bar = chart.selectAll("g")
		.data(data)
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar.append("rect")
		.attr("width", function(d) { return x(d.value); })
		.attr("height", barHeight - 1)
		.style("fill", function(d) {return d.color<4?"#CCFFFF":d.color<7?"#66FFFF":d.color<10?"#0099FF":d.color<20?"#0033CC":"#000066";});

	svg.append("g")
		.call(d3.svg.axis()
       	.orient("bottom"));
	bar.append("text")
		.attr("x", function(d) { return x(d.value) - 3; })
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d) { return d.value; });

	});

	function type(d) {
		d.value = +d.value;
		return d;
	}
}