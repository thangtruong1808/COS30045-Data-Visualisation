function init() {
  const w = 800;
  const h = 500;

  function showPieChart(data) {
    var outerRadius = h / 2;
    var innerRadius = 0;

    // To customise the size of our pie chart
    var arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);
    var color = d3.scaleOrdinal([...d3.schemeTableau10, ...d3.schemeSet3]); // Combined color schemes

    var pie = d3.pie().value((d) => d.Australia);

    // setup SVG canvas
    const svg = d3
      .select("#pieChartRealGDPAustralia")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // set up our arcs as follows
    var arcs = svg
      .selectAll("g.arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs
      .append("path")
      .attr("fill", function (d, i) {
        return color(i);
      })
      .attr("d", arc)
      // Add tooltips
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Quarter: ${d.data.quarter}<br>Australia: ${d.data.Australia}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add text labels
    arcs
      .append("text")

      .attr("transform", function (d) {
        var [x, y] = arc.centroid(d);
        var angle = (d.startAngle + d.endAngle) / 2;
        return `translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI - 90})`;
      })
      .text(function (d) {
        return d.data.Australia;
      })
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("fill", "black");

    // Add legend
    var legend = svg
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return (
          "translate(" + (outerRadius * 2 + 150) + "," + (i * 35 + 10) + ")"
        );
      });

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d, i) {
        return color(i);
      });

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d) {
        return d.quarter;
      })
      .attr("font-size", "14px");

    // Tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  d3.csv("./datasets/gdp_data.csv").then((data) => {
    showPieChart(data);
  });
}
window.addEventListener("load", init);
