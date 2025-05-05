import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Scatterplot = ({ path }) => {
  const chartRef = useRef();

  useEffect(() => {
    const contextMap = {
      "SERVER_LOSS_0%,DELAY_50ms,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_0%,DELAY_50ms,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_50ms,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_0%,DELAY_50ms,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_50ms,BW_None": require.context("../data/Server/SERVER_LOSS_0%,DELAY_50ms,BW_None", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_100ms,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_0%,DELAY_100ms,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_100ms,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_0%,DELAY_100ms,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_100ms,BW_None": require.context("../data/Server/SERVER_LOSS_0%,DELAY_100ms,BW_None", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_None,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_0%,DELAY_None,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_None,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_0%,DELAY_None,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_0%,DELAY_None,BW_None": require.context("../data/Server/SERVER_LOSS_0%,DELAY_None,BW_None", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_50ms,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_1%,DELAY_50ms,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_50ms,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_1%,DELAY_50ms,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_50ms,BW_None": require.context("../data/Server/SERVER_LOSS_1%,DELAY_50ms,BW_None", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_100ms,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_1%,DELAY_100ms,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_100ms,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_1%,DELAY_100ms,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_100ms,BW_None": require.context("../data/Server/SERVER_LOSS_1%,DELAY_100ms,BW_None", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_None,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_1%,DELAY_None,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_None,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_1%,DELAY_None,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_1%,DELAY_None,BW_None": require.context("../data/Server/SERVER_LOSS_1%,DELAY_None,BW_None", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_50ms,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_2%,DELAY_50ms,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_50ms,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_2%,DELAY_50ms,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_50ms,BW_None": require.context("../data/Server/SERVER_LOSS_2%,DELAY_50ms,BW_None", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_100ms,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_2%,DELAY_100ms,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_100ms,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_2%,DELAY_100ms,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_100ms,BW_None": require.context("../data/Server/SERVER_LOSS_2%,DELAY_100ms,BW_None", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_None,BW_10Mbps": require.context("../data/Server/SERVER_LOSS_2%,DELAY_None,BW_10Mbps", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_None,BW_50Mbps": require.context("../data/Server/SERVER_LOSS_2%,DELAY_None,BW_50Mbps", false, /\.json$/),
      "SERVER_LOSS_2%,DELAY_None,BW_None": require.context("../data/Server/SERVER_LOSS_2%,DELAY_None,BW_None", false, /\.json$/),
  };
    const context = contextMap[path];
    if (!context) return;

    const files = context.keys();
    const rawData = files.flatMap(file => context(file));
    if (!rawData.length) return;

    const width = 928;
    const height = width;
    const padding = 28;

    const columns = Object.keys(rawData[0]).filter(
      key => typeof rawData[0][key] === "number"
    );

    const size = (width - (columns.length + 1) * padding) / columns.length + padding;

    const x = columns.map(c => d3.scaleLinear()
      .domain(d3.extent(rawData, d => d[c]))
      .rangeRound([padding / 2, size - padding / 2]));

    const y = x.map(scale => scale.copy().range([size - padding / 2, padding / 2]));

    const color = d3.scaleOrdinal()
      .domain(rawData.map(d => d.species))
      .range(d3.schemeCategory10);

    const axisx = d3.axisBottom().ticks(6).tickSize(size * columns.length);
    const axisy = d3.axisLeft().ticks(6).tickSize(-size * columns.length);

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-padding, 0, width, height]);

    svg.append("style").text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    svg.append("g")
      .selectAll("g")
      .data(x)
      .join("g")
      .attr("transform", (d, i) => `translate(${i * size},0)`)
      .each(function (d) {
        d3.select(this).call(axisx.scale(d));
      })
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "#fff"));

    svg.append("g")
      .selectAll("g")
      .data(y)
      .join("g")
      .attr("transform", (d, i) => `translate(0,${i * size})`)
      .each(function (d) {
        d3.select(this).call(axisy.scale(d));
      })
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "#fff"));

    const cell = svg.append("g")
      .selectAll("g")
      .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
      .join("g")
      .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);

    cell.append("rect")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("x", padding / 2 + 0.5)
      .attr("y", padding / 2 + 0.5)
      .attr("width", size - padding)
      .attr("height", size - padding);

    cell.each(function ([i, j]) {
      d3.select(this).selectAll("circle")
        .data(rawData.filter(d => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
        .join("circle")
        .attr("cx", d => x[i](d[columns[i]]))
        .attr("cy", d => y[j](d[columns[j]]))
        .attr("r", 3.5)
        .attr("fill-opacity", 0.7)
        .attr("fill", d => color(d.species));
    });

    svg.append("g")
      .style("font", "bold 10px sans-serif")
      .style("pointer-events", "none")
      .selectAll("text")
      .data(columns)
      .join("text")
      .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(d => d);

    chartRef.current.innerHTML = "";
    chartRef.current.appendChild(svg.node());
  }, [path]);

  return <div ref={chartRef} />;
};

export default Scatterplot;
