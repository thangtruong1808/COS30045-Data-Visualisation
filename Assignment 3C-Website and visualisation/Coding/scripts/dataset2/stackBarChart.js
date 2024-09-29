function init() {
  const margin = { top: 20, right: 30, bottom: 200, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  const svg = d3
    .select("#stackBarChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv("./datasets/gdp_growth_contributions.csv").then((data) => {
    const subgroups = data.columns.slice(1);
    const groups = data.map((d) => d.quarter);

    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0));

    const y = d3.scaleLinear().domain([-15, 10]).range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(d3.schemeCategory10);

    const stackedData = d3.stack().keys(subgroups)(data);

    const bars = svg
      .append("g")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.quarter))
      // .attr("y", (d) => y(d[1]))
      .attr("y", (d) => Math.min(y(d[0]), y(d[1])))
      .attr("height", (d) => Math.abs(y(d[0]) - y(d[1])))
      // .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function (event, d) {
        const subgroupName = d3.select(this.parentNode).datum().key;
        tooltip.transition().duration(200).style("opacity", 0.9);
        // tooltip
        //   .html(`Value: ${(d[1] - d[0]).toFixed(1)}`)
        tooltip
          .html(
            `Quarter: ${
              d.data.quarter
            }<br>Category: ${subgroupName}<br>Value: ${(d[1] - d[0]).toFixed(
              1
            )}`
          )
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, ${height + 25})`);

    legend
      .selectAll("g")
      .data(subgroups)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .each(function (d) {
        d3.select(this)
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", color(d));

        d3.select(this)
          .append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text(d)
          .attr("font-size", "14px");
      });
  });
}

window.addEventListener("load", init);
