let topGames_width = MAX_WIDTH, topGames_height = 350;

// topGames
//// TODO: Barplot w/interactivity
let svg_topGames = d3.select("#topGames")      // HINT: div id for div containing scatterplot
    .append("svg")
    .attr("width", topGames_width)     // HINT: width
    .attr("height", topGames_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left + 100}, ${margin.top})`);    // HINT: transform

// TODO: Create a linear scale for the x axis (number of occurrences)
let x_topGames = d3.scaleLinear()
    .range([0, topGames_width - margin.left - margin.right - 100]);

// TODO: Create a scale band for the y axis (artist)
let y_topGames = d3.scaleBand()
    .range([0, topGames_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability

// Set up reference to count SVG group
let countRef_topGames = svg_topGames.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label_topGames = svg_topGames.append("g");
// TODO: Add x-axis label
svg_topGames.append("text")
    .attr("transform", `translate(${(topGames_width - margin.right - margin.left)/2} , ${(topGames_height - margin.top - margin.bottom) + 10})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Total Worldwide Sales ($Million)");
// Since this text will not update, we can declare it outside of the setData function

// TODO: Add y-axis label
let y_axis_text_topGames = svg_topGames.append("text")
    .attr("transform", `translate(${-220} , ${(topGames_height - margin.top - margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title_topGames = svg_topGames.append("text")
    .attr("transform", `translate(${(topGames_width - margin.right - margin.left)/2} , ${-10})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */
function setData_topGames(year) {
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv("../data/video_games.csv").then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
    let years = getUniques(data, "Year");

    update_Select(years, "topGamesSelect");

    data = filterVG(data, year, "Year");

    data = cleanData(
          data,
          function(a, b) {
            return parseInt(b.Global_Sales) - parseInt(a.Global_Sales);
          }, 10
    );

    // TODO: Update the x axis domain with the max count of the provided data
    x_topGames.domain([0, d3.max(data, function(d) {return d.Global_Sales})]);

    // TODO: Update the y axis domains with the desired attribute
    y_topGames.domain(data.map(function(d) {return d.Name}));
    // HINT: Use the attr parameter to get the desired attribute for each data point

    // TODO: Render y-axis label
    y_axis_label_topGames.call(d3.axisLeft(y_topGames).tickSize(0).tickPadding(10));

    /*
        This next line does the following:
            1. Select all desired elements in the DOM
            2. Count and parse the data values
            3. Create new, data-bound elements for each data value
     */
    let bars = svg_topGames.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d.Name }))
      .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    // TODO: Render the bar elements on the DOM
    /*
        This next section of code does the following:
            1. Take each selection and append a desired element in the DOM
            2. Merge bars with previously rendered elements
            3. For each data point, apply styling attributes to each element

        Remember to use the attr parameter to get the desired attribute for each data point
        when rendering.
     */
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d.Name) })
        .transition()
        .duration(1000)
        .attr("x", x_topGames(0))
        .attr("y", function(d) { return y_topGames(d.Name) })               // HINT: Use function(d) { return ...; } to apply styles based on the data point
        .attr("width", function(d) { return x_topGames(d['Global_Sales']) * 0.3 } )
        .attr("height",  y_topGames.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

    /*
        In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
        bar plot. We will be creating these in the same manner as the bars.
     */
    let counts = countRef_topGames.selectAll("text").data(data);

    // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x_topGames(d.Global_Sales) *0.3 + 10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y_topGames(d.Name) + 10})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) { return d.Global_Sales});           // HINT: Get the count of the artist

    y_axis_text_topGames.text("Name");
    title_topGames.text("Top 10 Video Games by Year: " + document.getElementById("topGamesSelect").value);

    // Remove elements not in use if fewer groups in new dataset
    bars.exit().remove();
    counts.exit().remove();

})
};

function setData_topGamesButton(){
  let value = document.getElementById("topGamesSelect").value;
  setData_topGames(value);
};

setData_topGames("All");
