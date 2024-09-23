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

function loadDataBarChart(callback) {
  d3.csv("./datasets/Economic-growth-recovered-strongly.csv", function (d) {
    return {
      date: new Date(d.Date), // Convert to Date object
      year: new Date(d.Date).getFullYear(), // Extract year
      Employment: +d.Employment, // Convert to number
      Realdomesticdemand: +d.Realdomesticdemand, // Convert to number
      Nominaldomesticdemand: +d.Nominaldomesticdemand, // Convert to number
    };
  }).then(callback);
}

function createScales(dataset, w, h) {
  // Group data by year and accumulate Employment values
  const yearEmployment = Array.from(
    d3.rollup(
      dataset,
      (v) => Math.round(d3.sum(v, (d) => d.Employment)), // Round the sum of Employment
      (d) => d.year
    ),
    ([year, Employment]) => ({ year, Employment })
  );

  const xScale = d3
    .scaleBand()
    .domain(yearEmployment.map((d) => d.year)) // Use year for x-axis
    .range([0, w])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yearEmployment, (d) => d.Employment)]) // Use rounded Employment values
    .range([h, 0]);

  return { xScale, yScale, yearEmployment };
}

function createSvg(w, h, margin) {
  return d3
    .select("#myBarChart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function drawBars(svg, yearEmployment, xScale, yScale, h) {
  svg
    .selectAll("rect")
    .data(yearEmployment)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", h) // Start from the bottom
    .attr("width", xScale.bandwidth())
    .attr("height", 0) // Start with height 0
    .style("fill", "#1e40af")
    .transition()
    .delay(500) // Initial delay of 2 seconds
    .duration(2000) // Duration of the transition
    .attr("y", (d) => yScale(d.Employment))
    .attr("height", (d) => h - yScale(d.Employment));
}

function addLabels(svg, yearEmployment, xScale, yScale) {
  svg
    .selectAll("text")
    .data(yearEmployment)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.year) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.Employment) + 15)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12px")
    .transition()
    .delay(1000) // Initial delay of 2 seconds
    .duration(2000) // Duration of the transition
    .tween("text", function (d) {
      const i = d3.interpolate(0, d.Employment);
      return function (t) {
        this.textContent = Math.round(i(t));
      };
    });
}

function addAxes(svg, xScale, yScale, h) {
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); // Format as integer
  const yAxis = d3.axisLeft(yScale); // Automatically adjust ticks based on data

  svg.append("g").attr("transform", `translate(0, ${h})`).call(xAxis);

  svg.append("g").call(yAxis);
}

export function barChart() {
  d3.select("#myBarChart").selectAll("svg").remove(); // Remove existing SVG
  showCharAndActiveButtont(2);
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const w = 800 - margin.left - margin.right;
  const h = 500 - margin.top - margin.bottom;

  loadDataBarChart(function (dataset) {
    console.log(dataset);
    const { xScale, yScale, yearEmployment } = createScales(dataset, w, h);
    const svg = createSvg(w, h, margin);
    drawBars(svg, yearEmployment, xScale, yScale, h);
    addLabels(svg, yearEmployment, xScale, yScale);
    addAxes(svg, xScale, yScale, h);
  });
}
