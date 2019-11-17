// Using d3-tip to add tooltips to a d3 bar chart.

var margin = {top: 40, right: 20, bottom: 100, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Releases:</strong> <span style='color:red'>" + d.Releases + "</span>";
  })

//
// Change this line: var svg = d3.select("body").append("svg") to use the div you want. 
// You can do var svg = d3.select("div").append("svg"), but this will append the SVG in 
// the first div. You can select the div by class or ID, though. For instance, if the 
// div has an ID of someDiv, do this: var svg = d3.select("#someDiv").append("svg")
//

// d3.select("body")
var svg = d3.select("#section1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.tsv("data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.Genre; }));
  y.domain([0, d3.max(data, function(d) { return d.Releases; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Releases");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Genre); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Releases); })
      .attr("height", function(d) { return height - y(d.Releases); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});

function type(d) {
  d.Releases = +d.Releases;
  return d;
}