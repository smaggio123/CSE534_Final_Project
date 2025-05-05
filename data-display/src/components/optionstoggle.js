import React, { useState, useEffect } from "react";

const OptionsToggle = ({ hasCategory, lossHandler, delayHandler, bandwidthHandler, categoryHandler }) => {
    let [loss, setLoss] = useState(0);
    let [delay, setDelay] = useState("50ms");
    let [bandwidth, setBandwidth] = useState("10Mbps");
    let [category, setCategory] = useState("loss");

    const handleLossChange = (e) => {
        setLoss(e.target.value);
        lossHandler(e.target.value);
    }

    const handleDelayChange = (e) => {
        setDelay(e.target.value);
        delayHandler(e.target.value);
    }

    const handleBandwidthChange = (e) => {
        setBandwidth(e.target.value);
        bandwidthHandler(e.target.value);
    }

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        categoryHandler(e.target.value);
    }

    useEffect(() => {
        if(!hasCategory) {
            document.getElementById("category").style.display = 'none';
        }
    });
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                <h3>Loss %</h3>
                <select value={loss} onChange={handleLossChange}>
                    <option value="0">0%</option>
                    <option value="1">1%</option>
                    <option value="2">2%</option>
                </select>
            </div>
            <div>
                <h3>Delay</h3>
                <select value={delay} onChange={handleDelayChange}>
                    <option value="50ms">50ms</option>
                    <option value="100ms">100ms</option>
                    <option value="None">None</option>
                </select>
            </div>
            <div>
                <h3>Bandwidth</h3>
                <select value={bandwidth} onChange={handleBandwidthChange}>
                    <option value="10Mbps">10Mbps</option>
                    <option value="50Mbps">50Mbps</option>
                    <option value="None">None</option>
                </select>
            </div>
            <div id="category">
                <h3>Category</h3>
                <select value={category} onChange={handleCategoryChange}>
                    <option value="loss">Loss</option>
                    <option value="delay">Delay</option>
                    <option value="bw">Bandwidth</option>
                </select>
            </div>
        </div>
    );
}

export default OptionsToggle;