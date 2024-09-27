import React, { useState, useEffect } from 'react';
import RealGDPChart from './RealGDPChart';
import GDPGrowthChart from './GDPGrowthChart';
import ScatterPlotChart from './ScatterPlotChart';
import EmploymentBarChart from './EmploymentBarChart';
import AreaChart from './AreaChart';

const App = () => {
  const [realGDPData, setRealGDPData] = useState([]);
  const [gdpGrowthData, setGDPGrowthData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  const [areaData, setAreaData] = useState([]);

  useEffect(() => {
    // Fetch or load your data here
    // For now, we'll use dummy data
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

    setScatterData([
      { x: 1, y: 5 },
      { x: 2, y: 3 },
      { x: 3, y: 7 },
      { x: 4, y: 2 },
      { x: 5, y: 6 },
    ]);

    setEmploymentData([
      { category: 'Full-time', value: 60 },
      { category: 'Part-time', value: 30 },
      { category: 'Unemployed', value: 10 },
    ]);

    setAreaData([
      { date: '2020-01-01', value: 10 },
      { date: '2020-04-01', value: 20 },
      { date: '2020-07-01', value: 15 },
      { date: '2020-10-01', value: 25 },
      { date: '2021-01-01', value: 30 },
    ]);
  }, []);

  return (
    <div>
      <h1>Economic Dashboard</h1>
      <RealGDPChart data={realGDPData} />
      <GDPGrowthChart data={gdpGrowthData} />
      <ScatterPlotChart data={scatterData} />
      <EmploymentBarChart data={employmentData} />
      <AreaChart data={areaData} />
    </div>
  );
};

export default App;