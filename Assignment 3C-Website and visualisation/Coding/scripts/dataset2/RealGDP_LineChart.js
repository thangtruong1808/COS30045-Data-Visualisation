function init() {
  // Set up the SVG canvas dimensions
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };

  function convertQuarterToDate(quarterString) {
    // Split the string to get the quarter and year
    let [quarter, year] = quarterString.split(" ");
    year = parseInt(year, 10);

    // Determine the month based on the quarter
    let month;
    switch (quarter) {
      case "Q1":
        month = 0; // January
        break;
      case "Q2":
        month = 3; // April
        break;
      case "Q3":
        month = 6; // July
        break;
      case "Q4":
        month = 9; // October
        break;
      default:
        throw new Error("Invalid quarter");
    }

    // Create and return the Date object
    return new Date(year, month, 1);
  }

  // // Parse the date / time
  // const parseTime = d3.timeParse("%Y-Q%q");

  // Define the line generator
  const line = d3
    .line()
    .x((d) => x(d.Quarter))
    .y((d) => y(d.value));

  // Define the colors for each country
  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  // Create the SVG element
  const svg = d3
    .select("#Real_GDP_from_all_countries")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Load and process the CSV file
  d3.csv("./datasets/gdp_data.csv")
    .then((data) => {
      processData(data);
      createScales(data);
      drawLines(data);
      drawAxes();
      drawLegend();
    })
    .catch((error) => {
      console.error("Error loading or processing data:", error);
    });

  function processData(data) {
    data.forEach((d) => {
      // console.log("typeof Quarter: " + typeof d.quarter);
      d.Quarter = convertQuarterToDate(d.quarter);
      // d.Quarter = +d.Quarter;
      d.Australia = Math.round(+d.Australia);
      d["Euro area"] = Math.round(+d["Euro area"]);
      d["United Kingdom"] = Math.round(+d["United Kingdom"]);
      d.Japan = Math.round(+d.Japan);
      d["United States"] = Math.round(+d["United States"]);
      d.OECD = Math.round(+d.OECD);
    });
  }

  function createScales(data) {
    x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Quarter))
      .range([margin.left, width - margin.right]);

    y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) =>
          Math.max(
            d.Australia,
            d["Euro area"],
            d["United Kingdom"],
            d.Japan,
            d["United States"],
            d.OECD
          )
        ),
      ])
      .range([height - margin.bottom, margin.top]);
  }

  function drawLines(data) {
    const countries = [
      "Australia",
      "Euro area",
      "United Kingdom",
      "Japan",
      "United States",
      "OECD",
    ];
    countries.forEach((country, i) => {
      svg
        .append("path")
        .datum(data.map((d) => ({ Quarter: d.Quarter, value: d[country] })))
        .attr("stroke", colors(i))
        .attr("stroke-width", 4.5)
        .attr("d", line)
        // .attr("class", "line");
        .attr("class", `line-${country}`);
    });
  }

  function drawAxes() {
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-Q%q")));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }

  function drawLegend() {
    const countries = [
      "Australia",
      "Euro area",
      "United Kingdom",
      "Japan",
      "United States",
      "OECD",
    ];
    const legend = svg
      .selectAll(".legend")
      .data(countries)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 25 + 150})`);
    // .attr("transform", (d, i) => `translate(0,${height + 20 + i * 20})`);

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => colors(i));

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d)
      .attr("font-size", "14px");
  }
}

window.addEventListener("load", init);
