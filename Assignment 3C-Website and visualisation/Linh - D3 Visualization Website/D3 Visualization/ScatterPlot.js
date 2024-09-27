import React, { useState, useEffect } from 'react';
import RealGDPChart from './RealGDPChart';
import GDPGrowthChart from './GDPGrowthChart';

const App = () => {
  const [realGDPData, setRealGDPData] = useState([]);
  const [gdpGrowthData, setGDPGrowthData] = useState([]);

  useEffect(() => {
    // Fetch or load your data here
    // For example:
    // fetch('realGDP.csv')
    //   .then(response => response.text())
    //   .then(text => {
    //     const data = d3.csvParse(text);
    //     setRealGDPData(data);
    //   });

    // Similarly for GDP growth data

    // For now, let's use some dummy data
    setRealGDPData([
      { date: '2020-01-01', value: 100 },
      { date: '2020-04-01', value: 95 },
      { date: '2020-07-01', value: 97 },
      { date: '2020-10-01', value: 99 },
      { date: '2021-01-01', value: 101 },
    ]);

    setGDPGrowthData([
      { date: 'Q1 2020', value: -5 },
      { date: 'Q2 2020', value: 2 },
      { date: 'Q3 2020', value: 2 },
      { date: 'Q4 2020', value: 2 },
      { date: 'Q1 2021', value: 1 },
    ]);
  }, []);

  return (
    <div>
      <h1>Economic Dashboard</h1>
      <RealGDPChart data={realGDPData} />
      <GDPGrowthChart data={gdpGrowthData} />
    </div>
  );
};

export default App;