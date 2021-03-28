let regionGenres_width = MAX_WIDTH, regionGenres_height = 600;

// regionGenres
var radius = Math.min(regionGenres_width - margin.left - margin.right, regionGenres_height - margin.top - margin.bottom) / 2
//// TODO: Barplot w/interactivity
let svg_regionGenres = d3.select("#regionGenres")      // HINT: div id for div containing scatterplot
    .append("svg")
    .attr("width", regionGenres_width)     // HINT: width
    .attr("height", regionGenres_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${(regionGenres_width - margin.right - margin.left)/2}, ${(regionGenres_height - margin.top - margin.bottom)/2})`);    // HINT: transform

// Set up reference to count SVG group
let countRef_regionGenres = svg_regionGenres.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label_regionGenres = svg_regionGenres.append("g");
// Since this text will not update, we can declare it outside of the setData function

// TODO: Add chart title
let title_regionGenres = svg_regionGenres.append("text")
    .attr("transform", `translate(${(regionGenres_width - margin.right - margin.left)/2} , ${-10})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

let region_list = ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"];
update_Select(region_list, "regionGenresSelect");
/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */
function setData_regionGenres(region) {
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv("../data/video_games.csv").then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
    if (region == "All") {
      region = "Global_Sales";
    }

    var f = d3.format(".2f");
    data = d3.nest()
      .key(function(d) {return d.Genre})
      .rollup(function(d) {
        return Math.round(d3.sum(d, function(g) {return g[region]}) * 100) / 100
      }).entries(data);

    data = cleanData(
          data,
          function(a, b) {
            return parseInt(b.value) - parseInt(a.value);
          }, 10
    );

    let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d.key }))
      .range(d3.schemeDark2);

    let tooltip = d3.select("#regionGenres")     // HINT: div id for div containing scatterplot
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let mouseover = function(d) {
      // console.log(d);
      let color_span = `<span style="color: ${color(d.data.key)};">`;
      let html = `${d.data.value.key}<br/>
              Total Sales ($Million): ${d.data.value.value}`;

      var currX = window.event.clientX;
      var currY = window.event.clientY;
      tooltip.html(html)
          .style("left", `${currX}px`)
          .style("top", `${currY}px`)
          // .style("box-shadow", `2px 2px 5px ${color(d.data.key)}`)    // OPTIONAL for students
          .transition()
          .duration(200)
          .style("opacity", 0.9)
    };

    let mouseout = function(d) {
        // Set opacity back to 0 to hide
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    };

    var pie = d3.pie()
      .value(function(d) {return d.value.value})
      .sort(function(a, b) {return d3.ascending(a.value.key, b.value.key)});

    var data_ready = pie(d3.entries(data));

    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    var u = svg_regionGenres.selectAll("path")
      .data(data_ready);

    u.enter()
      .append('path')
      .merge(u)
      .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
      )
      .attr('fill', function(d){return(color(d.data.key))})
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    // let labels = countRef_regionGenres.selectAll("text").data(data_ready);
    //
    // labels.enter()
    //   .append('text')
    //   .merge(labels)
    //   .text(function(d){return d.data.value.key})
    //   .attr("transform", function(d) {let arc = arcGenerator.centroid(d); console.log(`translate(${120 + parseInt(arc[0])},${120 + parseInt(arc[1])})`); return `translate(${parseInt(arc[0])},${parseInt(arc[1])})`;  })
    //   .style("text-anchor", "middle")
    //   .style("font-size", 17);


      title_regionGenres.text("Top 10 Genres in Region: " + document.getElementById("regionGenresSelect").value);

      u.exit().remove();
})
};

function setData_regionGenresButton(){
  let value = document.getElementById("regionGenresSelect").value;
  setData_regionGenres(value);
};

setData_regionGenres("All");
