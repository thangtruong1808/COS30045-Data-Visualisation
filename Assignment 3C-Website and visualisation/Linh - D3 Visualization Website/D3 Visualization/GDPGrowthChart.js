import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GDPGrowthChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (data && chartRef.current) {
      const svg = d3.select(chartRef.current);
      
      // Clear existing content
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 30, bottom: 30, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const x = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
        .range([height, 0]);

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y));

      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", d => y(Math.max(0, d.value)))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(y(d.value) - y(0)))
        .attr("fill", d => d.value >= 0 ? "green" : "red");

      // Add interactivity here (e.g., tooltips, hover effects)
    }
  }, [data]);

  return (
    <div>
      <h2>GDP Growth Chart</h2>
      <svg ref={chartRef} width={600} height={400}></svg>
      <p>This chart shows GDP growth rates. Positive growth is in green, negative in red.</p>
    </div>
  );
};

export default GDPGrowthChart;