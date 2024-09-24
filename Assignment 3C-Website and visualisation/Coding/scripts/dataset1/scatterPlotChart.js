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

function loadDataScatterPlot(callback) {
  d3.csv("./datasets/Economic-growth-recovered-strongly.csv", function (d) {
    return {
      date: new Date(d.Date), // Convert to Date object
      year: new Date(d.Date).getFullYear(), // Extract year
      Nominaldomesticdemand: +d.Nominaldomesticdemand, // Convert to number
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
    .domain([0, d3.max(dataset, (d) => d.Nominaldomesticdemand)])
    .range([h, 0]);

  return { xScale, yScale };
}

function createSvg(w, h, margin) {
  return d3
    .select("#myScatterPlotChart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function drawScatterPlot(svg, dataset, xScale, yScale) {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.Nominaldomesticdemand))
    .attr("r", 5)
    .style("fill", "#f97316")

    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Date: ${d3.timeFormat("%Y-%m-%d")(
            d.date
          )}<br>Nominal Domestic Demand: ${d.Nominaldomesticdemand}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(500).style("opacity", 0);
    });
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
    .attr("x", (w + margin.left + margin.right) / 3.5)
    .attr("y", -margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("fill", "red")
    .text("Nominal domestic demand growth over time");
}

export function scatterPlot(margin, w, h) {
  d3.select("#myScatterPlotChart").selectAll("svg").remove(); // Remove existing SVG
  showCharAndActiveButtont(4);

  loadDataScatterPlot(function (dataset) {
    const { xScale, yScale } = createScales(dataset, w, h);
    const svg = createSvg(w, h, margin);
    drawScatterPlot(svg, dataset, xScale, yScale);
    addAxes(svg, xScale, yScale, h);
    addLegend(svg, w, margin);
  });
}
