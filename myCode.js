
//Width and height
var w = 900;
var h = 560;
var barPadding = 0;
var marginBottom = 20;
var marginLeft = 50;
var marginRight = 5;

var svg = d3.select("body")
  .append("svg")
  .attr("width", w + marginLeft + marginRight)
  .attr("height", h + marginBottom)

var tooltip = d3.select(".tooltipDiv").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(json => {
  var barWidth = w / json.data.length;
  var yearsQuarters = json.data.map(function (item) { //item: ["2014-10-01", 17615.9]
    var quarter;
    var month = item[0].substring(5, 7);
    switch (month) {
      case '01':
        quarter = 'Q1';
        break;
      case '04':
        quarter = 'Q2';
        break;
      case '07':
        quarter = 'Q3';
        break;
      case '10':
        quarter = 'Q4';
        break;
      default:
    }
    return item[0].substring(0, 4) + ' ' + quarter
  });

  var allDates = json.data.map(function (item) {
    return new Date(item[0]);
  });

  var xMax = new Date(d3.max(allDates));
  xMax.setMonth(xMax.getMonth() + 3);
  var xScale = d3.scaleTime()
    .domain([d3.min(allDates), xMax])
    .range([0, w]);

  var xAxis = d3.axisBottom()
    .scale(xScale);

  var xAxisGroup = svg.append('g')
    .call(xAxis)
    .attr("class", "axis")
    .attr('id', 'x-axis')
    .attr('transform', `translate(${marginLeft}, 560)`);

  var GDPs = json.data.map(function (item) {
    return item[1]
  });

  var scaledGDP = []; //the GDPs after being scaled (not reversed)

  var gdpMin = d3.min(GDPs);
  var gdpMax = d3.max(GDPs);

  var linearScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([0, h]);

  scaledGDP = GDPs.map(function (item) {
    return linearScale(item);
  });

  var yScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([h, 0]); // reverse

  var yAxis = d3.axisLeft(yScale);

  var yAxisGroup = svg.append('g')
    .call(yAxis)
    .attr("class", "axis")
    .attr('id', 'y-axis')
    .attr('transform', 'translate(50, 0)');

  svg.selectAll("rect")
    .data(scaledGDP)
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .attr("x", (d, i) => xScale(allDates[i]) + marginLeft)
    .attr("y", d => h - d)
    .attr("width", barWidth - barPadding)
    .attr("height", d => d)
    .attr('data-date', (d, i) => json.data[i][0])
    .attr('data-gdp', (d, i) => json.data[i][1])
    .on('mouseover', (d, i) => {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(yearsQuarters[i] + '<br>' + '$' + GDPs[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
        .attr('data-date', json.data[i][0])
        .style('left', (i * barWidth) + 60 + 'px')
        .style('top', h - 50)
        .style('transform', 'translateX(60px)');
    })
    .on('mouseout', d => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    })



})