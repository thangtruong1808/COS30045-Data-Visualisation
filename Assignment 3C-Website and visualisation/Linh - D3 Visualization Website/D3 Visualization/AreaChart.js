import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AreaChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data && svgRef.current) {
      const svg = d3.select(svgRef.current);
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

      const area = d3.area()
        .x(d => x(new Date(d.date)))
        .y0(height)
        .y1(d => y(d.value));

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y));

      g.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area);
    }
  }, [data]);

  return (
    <div>
      <h2>Area Chart</h2>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
};

export default AreaChart;