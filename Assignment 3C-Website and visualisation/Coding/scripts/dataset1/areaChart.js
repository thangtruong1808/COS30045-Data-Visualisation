function showCharAndActiveButtont(index) {
  const figures = document.querySelectorAll(".figure-container");
  figures.forEach((figure) => {
    figure.style.display = "none";
  });

  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  document.getElementById(`figure${index}`).style.display = "block";

  buttons[index - 1].classList.add("active");
}

function loadDataAreaChart(callback) {
  d3.csv("./datasets/Economic-growth-recovered-strongly.csv", function (d) {
    return {
      date: new Date(d.Date), // Convert to Date object
      year: new Date(d.Date).getFullYear(), // Extract year
      Realdomesticdemand: +d.Realdomesticdemand, // Convert to number
    };
  }).then(callback);
}

function createScales(dataset, w, h) {
  const xScale = d3
    .scaleTime()
    // .domain(d3.extent(dataset, (d) => d.date))
    .domain([new Date(2016, 0, 1), new Date(2025, 11, 31)]) // Set domain from 2016 to 2025
    .range([0, w]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.Realdomesticdemand)])
    .range([h, 0]);

  return { xScale, yScale };
}

function createSvg(w, h, margin) {
  return d3
    .select("#myAreaChart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function drawAreaChart(svg, dataset, xScale, yScale) {
  // Turn line chart into an area chart
  var area = d3
    .area()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.Realdomesticdemand));

  svg
    .append("path")
    .datum(dataset)
    .attr("fill", "#a8a29e")
    .attr("d", area)
    .style("opacity", 0)
    .transition()
    .duration(2000)
    .style("opacity", 1);
}

function addAnnotation(svg, xScale, yScale, dataset) {
  const halfDemand = d3.mean(dataset, (d) => d.Realdomesticdemand) / 2;

  svg
    .append("line")
    .attr("x1", 0)
    .attr("x2", xScale(d3.max(dataset, (d) => d.date)))
    .attr("y1", yScale(halfDemand))
    .attr("y2", yScale(halfDemand))
    .attr("stroke", "red")
    .attr("stroke-dasharray", "4");

  svg
    .append("text")
    .attr("x", xScale(d3.max(dataset, (d) => d.date)) - 10)
    .attr("y", yScale(halfDemand) - 10)
    .attr("text-anchor", "end")
    .style("fill", "red")
    .text("Half Real domestic demand");
}

function addAxes(svg, xScale, yScale, h) {
  // const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(1));
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(d3.timeYear.every(1))
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale);

  svg.append("g").attr("transform", `translate(0, ${h})`).call(xAxis);
  svg.append("g").call(yAxis);
}

function addLegend(svg, w, margin) {
  svg
    .append("text")
    .attr("x", (w + margin.left + margin.right) / 3)
    .attr("y", -margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("fill", "red")
    .text("Real domestic demand growth over time");
}

export function areaChart(margin, w, h) {
  d3.select("#myAreaChart").selectAll("svg").remove(); // Remove existing SVG
  showCharAndActiveButtont(3);
  loadDataAreaChart(function (dataset) {
    const { xScale, yScale } = createScales(dataset, w, h);
    const svg = createSvg(w, h, margin);
    drawAreaChart(svg, dataset, xScale, yScale);
    addAxes(svg, xScale, yScale, h);
    addAnnotation(svg, xScale, yScale, dataset);
    addLegend(svg, w, margin);
  });
}
