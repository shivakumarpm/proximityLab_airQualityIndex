import React, {useState, useEffect} from 'react';
import LiveAirQualityReport from './components/LiveAirQualityReport';
import './App.css';

function App() {

  const [aqiData, setAqiData] = useState({});

  useEffect(() => {
    dispalySocketMessage();
  });
  const dispalySocketMessage = () => {
    let ws = new WebSocket('ws://city-ws.herokuapp.com/');
    ws.onopen = function(){
      //Subscribe to the channel
      ws.send(JSON.stringify({"command": "subscribe","identifier":"{\"city\":\"bangalore\"}"}));
      
    }
    
    ws.onmessage = function(msg = {}) {
        if(msg.data) {
          const aqiInfo = JSON.parse(msg.data.replace(/\\/g, ''));
          setAqiData({aqiInfo});
        }
    }
  }

  return (
    <div className="App">
        {dispalySocketMessage()}
        <LiveAirQualityReport aqiInfo={aqiData.aqiInfo} />
    </div>
  );
}

export default App;
