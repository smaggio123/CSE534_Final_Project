import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ path, regex }) => {
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

    useEffect(() => {
        const context = contextMap[path]
        const datasets = (regex !== undefined) ? context.keys().filter((key) => regex.test(key)).map(key => {
            const name = key.replace("./", "").replace(".json", "");
            const data = context(key);
            return {
                name: name.substring(0, 4),
                values: data.slice(0, -1).map((d, i) => ({
                    index: i,
                    bitrate: d.bitrate_Mbps
                }))
            };
        }) : context.keys().map(key => {
            const name = key.replace("./", "").replace(".json", "");
            const data = context(key);
            return {
                name: name.substring(0, 4),
                values: data.slice(0, -1).map((d, i) => ({
                    index: i,
                    bitrate: d.bitrate_Mbps
                }))
            };
        });
        if (datasets.length === 0) return;

        const width = 928 * 1.5;
        const height = 500 * 1.5;
        const marginTop = 20* 1.5;
        const marginRight = 30* 1.5;
        const marginBottom = 30* 1.5;
        const marginLeft = 40* 1.5;

        const allValues = datasets.flatMap(d => d.values);

        const x = d3.scaleLinear()
            .domain([0, d3.max(allValues, d => d.index)])
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(allValues, d => d.bitrate)])
            .range([height - marginBottom, marginTop]);

        const color = d3.scaleOrdinal()
            .domain(datasets.map(d => d.name))
            .range(d3.schemeCategory10);

        const line = d3.line()
            .x(d => x(d.index))
            .y(d => y(d.bitrate));

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

            svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(10))
            .append("text")
            .attr("x", (width - marginLeft - marginRight) / 2 + marginLeft)
            .attr("y", 35)
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .text("Interval (sec)");

            svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
              .attr("x2", width - marginLeft - marginRight)
              .attr("stroke-opacity", 0.1))
            .append("text")
            .attr("x", -height / 2)
            .attr("y", -marginLeft)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("transform", `rotate(-90)`)
            .attr("dy", "1em")
            .text("Bitrate (Mbps)");

        datasets.forEach(series => {
            svg.append("path")
                .datum(series.values)
                .attr("fill", "none")
                .attr("stroke", color(series.name))
                .attr("stroke-width", 1.5)
                .attr("d", line);

            const last = series.values[series.values.length - 1];
            svg.append("text")
                .attr("x", x(last.index) + 5)
                .attr("y", y(last.bitrate))
                .attr("dy", "0.35em")
                .attr("fill", color(series.name))
                .style("font", "12px sans-serif")
                .text(series.name);
        });

        chartRef.current.innerHTML = "";
        chartRef.current.appendChild(svg.node());
    }, [path]);

    return <div ref={chartRef} />;
};

export default LineChart;
