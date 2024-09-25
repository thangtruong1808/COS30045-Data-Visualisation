import { barChart } from "./sumEmploymentBarChart.js";
import { areaChart } from "./areaChart.js";
import { scatterPlot } from "./scatterPlotChart.js";

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

function loadDataLineChar(callback) {
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
  const xScale = d3
    .scaleTime()
    // .domain(d3.extent(dataset, (d) => d.date))
    .domain([new Date(2016, 0, 1), new Date(2025, 11, 31)]) // Set domain from 2016 to 2025
    .range([0, w]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, (d) =>
        Math.max(d.Employment, d.Realdomesticdemand, d.Nominaldomesticdemand)
      ),
    ])
    .range([h, 0]);

  return { xScale, yScale };
}

function createSvg(w, h, margin) {
  d3.select("#myLineChart").selectAll("svg").remove(); // Remove existing SVG
  return d3
    .select("#myLineChart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom + 80) // Add extra height for legend
    .append("g")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top + 60) + ")"
    ); // Move chart down for legend
}

function drawLines(svg, dataset, xScale, yScale, w) {
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  const fields = ["Employment", "Realdomesticdemand", "Nominaldomesticdemand"];
  const colors = ["#1e40af", "#e63946", "#2a9d8f"];

  fields.forEach((field, i) => {
    const path = svg
      .append("path")
      .datum(dataset.map((d) => ({ date: d.date, value: d[field] })))
      .attr("fill", "none")
      .attr("stroke", colors[i])
      .attr("stroke-width", 4.5)
      .attr("d", line)
      .attr("class", `line-${field}`);

    // Add mouseover and mouseout events
    path
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", 3); // Highlight line
        tooltip.style("display", null);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 4.5); // Reset line thickness
        tooltip.style("display", "none");
      })
      .on("mousemove", function (event, d) {
        const [xPos, yPos] = d3.pointer(event);
        const date = xScale.invert(xPos);
        const value = yScale.invert(yPos);
        tooltip
          .attr("transform", `translate(${xPos},${yPos})`)
          .select("text")
          .text(`${field}: ${value.toFixed(2)}`);
      });
  });

  // Add legend
  const legend = svg
    .selectAll(".legend")
    .data(fields)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0, ${-80 + i * 20})`); // Position each legend in a separate row

  legend
    .append("rect")
    .attr("x", 0)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", (d, i) => colors[i]);

  legend
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .style("font-size", "14px") // Set font size
    .style("font-family", "Arial, Helvetica, sans-serif") // Set font family for legend
    .text((d) => d);

  // Add tooltip
  const tooltip = svg
    .append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip
    .append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip
    .append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
}

function addAxes(svg, xScale, yScale, h) {
  // const xAxis = d3.axisBottom(xScale);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(d3.timeYear.every(1))
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale);

  svg.append("g").attr("transform", `translate(0, ${h})`).call(xAxis);
  svg.append("g").call(yAxis);
}

function init() {
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const w = 800 - margin.left - margin.right;
  const h = 500 - margin.top - margin.bottom;
  showCharAndActiveButtont(1);
  showLineChar();
  function showLineChar() {
    loadDataLineChar(function (dataset) {
      const { xScale, yScale } = createScales(dataset, w, h);
      const svg = createSvg(w, h, margin);
      drawLines(svg, dataset, xScale, yScale, w);
      addAxes(svg, xScale, yScale, h);
    });
  }
  const buttons = d3.selectAll("button");
  buttons.on("click", function () {
    const buttonId = d3.select(this).attr("id");
    if (buttonId === "btn1") {
      showCharAndActiveButtont(1);
      showLineChar();
    }
    if (buttonId === "btn2") {
      showCharAndActiveButtont(2);
      barChart(margin, w, h);
    }
    if (buttonId === "btn3") {
      showCharAndActiveButtont(3);
      areaChart(margin, w, h);
    }
    if (buttonId === "btn4") {
      showCharAndActiveButtont(4);
      scatterPlot(margin, w, h);
    }
  });
}

window.addEventListener("load", init);
