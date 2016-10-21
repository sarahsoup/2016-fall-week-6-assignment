console.log('6.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data and parse
d3.csv('../data/olympic_medal_count.csv',parse,dataLoaded);

function parse(row){
  return{
    country: row.Country,
    //medals1900: +row['1900'],
    //medals1960: +row['1960'],
    medals2012: (+row['2012'])
  };
};

function dataLoaded(err,row){
  console.table(row);

  //sort medal count and take top 5
  row.sort(function(b,a){
    return a.medals2012 - b.medals2012;
  });

  var top5 = row.slice(0,5);

  //find max/min and create scales
  var maxMin = d3.extent(row, function(d){ return d.medals2012; });

  var scaleY = d3.scaleLinear()
  .domain(maxMin)
  .range([h,0]);

  var scaleX = d3.scaleOrdinal()
  .domain(top5.map(function (d) {return d.country;}))
  .range(d3.range(0, w, w/5));

  //create bars
  var bars = plot.selectAll('rect')
  .data(top5)
  .enter()
  .append('rect')
  .attr('class','bar')
  .attr('width', 50)
  .attr('height', function(d){return h-scaleY(d.medals2012); })
  .attr('x', function(d){return scaleX(d.country); })
  .attr('y', function(d){return scaleY(d.medals2012); })
  .style('fill-opacity', .75);

  //create axes
  var axisX = d3.axisBottom()
    .scale(scaleX)
    .tickSize(0)
    .tickPadding(10);
  plot.append('g').attr('class','xAxis')
    .attr('transform','translate(25,'+h+')')
    .call(axisX);

  var axisY = d3.axisLeft()
    .scale(scaleY)
    .tickSize(-w)
    .tickPadding(30);
  plot.append('g').attr('class','yAxis')
    .attr('transform','translate(0,0)')
    .call(axisY);
};
