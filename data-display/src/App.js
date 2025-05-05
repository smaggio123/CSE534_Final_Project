import Lineplot from './components/lineplot';
import './App.css';
import Bargraph from './components/bargraph';
import { useState } from 'react';
import OptionsToggle from './components/optionstoggle';
import Scatterplot from './components/scatterplot';

function App() {
  let [loss, setLoss] = useState(0);
  let [delay, setDelay] = useState("50ms");
  let [bandwidth, setBandwidth] = useState("10Mbps");
  let [category, setCategory] = useState("loss");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
      <div className='chart-display'>
        <Lineplot path={`SERVER_LOSS_${loss}%,DELAY_${delay},BW_${bandwidth}`} />
        <OptionsToggle hasCategory={false} lossHandler={setLoss} delayHandler={setDelay} bandwidthHandler={setBandwidth} categoryHandler={setCategory} />
      </div>
      <div className='chart-display'>
        <Bargraph path={`SERVER_LOSS_${loss}%,DELAY_${delay},BW_${bandwidth}`} category={category} />
        <OptionsToggle hasCategory={true} lossHandler={setLoss} delayHandler={setDelay} bandwidthHandler={setBandwidth} categoryHandler={setCategory} />
      </div>
      <div className='chart-display'>
        <Scatterplot path={`SERVER_LOSS_${loss}%,DELAY_${delay},BW_${bandwidth}`} />
        <OptionsToggle hasCategory={false} lossHandler={setLoss} delayHandler={setDelay} bandwidthHandler={setBandwidth} categoryHandler={setCategory} />
      </div>
    </div>
  );
}

export default App;
