import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Bargraph = ({ path, category }) => {
  const chartRef = useRef();

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

  const parsePath = (rawPath) => {
    const parts = rawPath.replace("SERVER_", "").split(",");
    const map = {};
    parts.forEach(part => {
      const [key, ...rest] = part.split("_");
      map[key] = part;
    });
    return map;
  };

  const extractFieldFromDir = (dirKey, field) => {
    const match = dirKey.replace("SERVER_", "").split(",").find(p => p.startsWith(`${field}_`));
    return match ? match.split("_")[1] : null;
  };

  useEffect(() => {
    const chartData = [];
    const parsed = parsePath(path);
    const categoryKey = category.toUpperCase();
    const fixedFields = Object.entries(parsed).filter(([k]) => k !== categoryKey);

    Object.entries(contextMap).forEach(([dirKey, context]) => {
      const isMatch = fixedFields.every(([key, value]) => dirKey.includes(value));
      if (!isMatch) return;

      const groupKey = extractFieldFromDir(dirKey, categoryKey);
      context.keys().forEach(key => {
        const name = key.replace("./", "").replace(".json", "");
        const bbr = name.split("_")[0];
        const data = context(key);
        const avg = d3.mean(data.slice(0, -1), d => d.bitrate_Mbps);
        chartData.push({ group: groupKey, subtype: bbr, value: avg });
      });
    });
    if (chartData.length === 0) return;

    const width = 928 * 1.5;
    const height = 600 * 1.5;
    const marginTop = 10 * 1.5;
    const marginRight = 10 * 1.5;
    const marginBottom = 20 * 2;
    const marginLeft = 40 * 1.5;

    const groups = Array.from(new Set(chartData.map(d => d.group)));
    const subtypes = Array.from(new Set(chartData.map(d => d.subtype)));

    const fx = d3.scaleBand()
      .domain(groups)
      .rangeRound([marginLeft, width - marginRight])
      .paddingInner(0.1);

    const x = d3.scaleBand()
      .domain(subtypes)
      .rangeRound([0, fx.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value * 1.10)]).nice()
      .rangeRound([height - marginBottom, marginTop]);

    const color = d3.scaleOrdinal()
      .domain(subtypes)
      .range(d3.schemeSpectral[subtypes.length])
      .unknown("#ccc");

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .selectAll("g")
      .data(d3.group(chartData, d => d.group))
      .join("g")
      .attr("transform", ([group]) => `translate(${fx(group)},0)`)
      .selectAll("rect")
      .data(([, d]) => d)
      .join("rect")
      .attr("x", d => x(d.subtype))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => color(d.subtype));

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(fx).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove())
      .append("text")
      .attr("x", (width - marginLeft - marginRight) / 2 + marginLeft)
      .attr("y", 35)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text((category.toUpperCase() === "LOSS") ? "Loss %" : (category.toUpperCase() === "DELAY") ? "Delay (ms)" : "Bandwidth (Mbits/sec)");

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call(g => g.selectAll(".domain").remove())
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -marginLeft)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("transform", `rotate(-90)`)
      .attr("dy", "1em")
      .text("Bitrate (Mbps)");;

    const legend = svg.append("g")
      .attr("transform", `translate(${width - marginRight - 100},${marginTop})`);

    subtypes.forEach((subtype, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(subtype));

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(subtype)
        .style("font-size", "12px")
        .attr("fill", "black");
    });

    chartRef.current.innerHTML = "";
    chartRef.current.appendChild(svg.node());
  }, [path, category]);

  return <div ref={chartRef} />;
};

export default Bargraph;
