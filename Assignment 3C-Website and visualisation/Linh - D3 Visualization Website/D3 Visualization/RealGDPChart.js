import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RealGDPChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (data && chartRef.current) {
      const svg = d3.select(chartRef.current);
      
      // Clear existing content
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 30, bottom: 30, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

      const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.value));

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y));

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      // Add interactivity here (e.g., tooltips, hover effects)
    }
  }, [data]);

  return (
    <div>
      <h2>Real GDP Chart</h2>
      <svg ref={chartRef} width={600} height={400}></svg>
      <p>This chart displays the Real GDP trends over time. Hover over data points for more details.</p>
    </div>
  );
};

export default RealGDPChart;