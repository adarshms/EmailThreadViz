function threadLength() {
	var width = document.getElementById('chart-area').offsetWidth - 10,
		barHeight = 8;


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
		.style("fill", function(d) {return d.color<4?"#00C1C2":d.color<7?"#1D8290":d.color<10?"#1C517E":"#023255";});

	svg.append("g")
		.call(d3.svg.axis()
       	.orient("bottom"));
	/*bar.append("text")
		.attr("x", function(d) { return x(d.value) - 3; })
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d) { return d.value; });*/

	});

	function type(d) {
		d.value = +d.value;
		return d;
	}
}