var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;
var formatTime = d3.time.format("%e %B");

// Set the ranges
var x6 = d3.scale.linear().range([0, width]);
var y6 = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis6 = d3.svg.axis().scale(x6)
    .orient("bottom").ticks(10);

var yAxis6 = d3.svg.axis().scale(y6)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x6(d.date); })
    .y(function(d) { return y6(d.close); });

// Define the div for the tooltip
var div = d3.select("#brushandzoom").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// Adds the svg canvas
var svg6 = d3.select("#brushandzoom")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("static/data/yearvsreleases.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = +d.year;
        d.close = +d.movies;
    });

    // Scale the range of the data
    x6.domain(d3.extent(data, function(d) { return d.year; }));
    y6.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    svg6.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the scatterplot
    svg6.selectAll("dot")	
        .data(data)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d) { return x6(d.date); })		 
        .attr("cy", function(d) { return y6(d.close); })		
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("yr: " + d.date + "<br/>"  + "#: " + d.close)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    // Add the X Axis
    svg6.append("g")
        .attr("class", "x6 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis6);

    // Add the Y Axis
    svg6.append("g")
        .attr("class", "y6 axis")
        .call(yAxis6);

});