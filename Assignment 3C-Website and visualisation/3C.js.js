import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Embedded data
const gdpData = [
  { quarter: 'Q4 2019', Australia: 100, 'Euro area': 100, 'United Kingdom': 100, Japan: 100, 'United States': 100, OECD: 100 },
  { quarter: 'Q1 2020', Australia: 99.77417364, 'Euro area': 96.6073845, 'United Kingdom': 97.27847007, Japan: 100.3912002, 'United States': 98.637135, OECD: 98.281652 },
  { quarter: 'Q2 2020', Australia: 93.11150208, 'Euro area': 85.74435229, 'United Kingdom': 77.50904413, Japan: 92.53619495, 'United States': 90.853659, OECD: 88.36401 },
  { quarter: 'Q3 2020', Australia: 96.6084809, 'Euro area': 96.07139515, 'United Kingdom': 90.51137448, Japan: 97.72912565, 'United States': 97.903197, OECD: 96.703759 },
  { quarter: 'Q4 2020', Australia: 99.8240623, 'Euro area': 96.01030881, 'United Kingdom': 91.73948625, Japan: 99.58913588, 'United States': 98.916715, OECD: 97.813571 },
  { quarter: 'Q1 2021', Australia: 101.9452176, 'Euro area': 96.43402734, 'United Kingdom': 90.7998595, Japan: 99.2741707, 'United States': 100.18831, OECD: 98.679762 },
  { quarter: 'Q2 2021', Australia: 102.6421198, 'Euro area': 98.45284946, 'United Kingdom': 97.45355801, Japan: 99.78471211, 'United States': 101.71092, OECD: 100.39799 },
  { quarter: 'Q3 2021', Australia: 100.5342941, 'Euro area': 100.4688401, 'United Kingdom': 99.12545176, Japan: 99.39525521, 'United States': 102.53922, OECD: 101.62411 },
  { quarter: 'Q4 2021', Australia: 104.4258783, 'Euro area': 100.9751277, 'United Kingdom': 100.6322422, Japan: 100.4936733, 'United States': 104.27908, OECD: 103.04358 },
  { quarter: 'Q1 2022', Australia: 105.0841004, 'Euro area': 101.7068692, 'United Kingdom': 101.1608937, Japan: 99.93798676, 'United States': 103.76011, OECD: 103.23589 },
  { quarter: 'Q2 2022', Australia: 105.8509542, 'Euro area': 102.5227004, 'United Kingdom': 101.2511121, Japan: 101.2373249, 'United States': 103.61352, OECD: 103.73632 },
  { quarter: 'Q3 2022', Australia: 106.5678518, 'Euro area': 102.8799511, 'United Kingdom': 101.1644596, Japan: 100.9463108, 'United States': 104.29594, OECD: 104.20416 },
  { quarter: 'Q4 2022', Australia: 107.2626526, 'Euro area': 102.8425699, 'United Kingdom': 101.2997873, Japan: 101.0018719, 'United States': 104.95866, OECD: 104.44656 },
  { quarter: 'Q1 2023', Australia: 107.661987, 'Euro area': 102.882067, 'United Kingdom': 101.624645, Japan: 101.8097792, 'United States': 105.54263, OECD: 104.90519 },
  { quarter: 'Q2 2023', Australia: 108.0449315, 'Euro area': 103.0279837, 'United Kingdom': 101.8154231, Japan: 103.0012004, 'United States': 106.08208, OECD: 105.39361 },
];

const growthComponentsData = [
  { quarter: 'Q4 2019', 'Household consumption': 0.5, 'Private investment': 0.2, 'Public consumption and investment': 0.3, 'Net exports': -0.1, 'Inventories': -0.1 },
  { quarter: 'Q1 2020', 'Household consumption': -0.2, 'Private investment': -0.7, 'Public consumption and investment': 0.4, 'Net exports': 0.3, 'Inventories': 0.1 },
  { quarter: 'Q2 2020', 'Household consumption': -6.7, 'Private investment': -6.7, 'Public consumption and investment': 0.4, 'Net exports': 1.1, 'Inventories': -0.7 },
  { quarter: 'Q3 2020', 'Household consumption': 3.8, 'Private investment': 3.9, 'Public consumption and investment': 0.6, 'Net exports': -2.1, 'Inventories': 1.3 },
  { quarter: 'Q4 2020', 'Household consumption': 3.3, 'Private investment': 2.4, 'Public consumption and investment': 0.4, 'Net exports': 0.0, 'Inventories': -0.5 },
  { quarter: 'Q1 2021', 'Household consumption': 2.1, 'Private investment': 0.7, 'Public consumption and investment': 0.0, 'Net exports': -0.2, 'Inventories': 0.7 },
  { quarter: 'Q2 2021', 'Household consumption': 0.7, 'Private investment': 0.5, 'Public consumption and investment': 0.6, 'Net exports': -1.2, 'Inventories': 0.2 },
  { quarter: 'Q3 2021', 'Household consumption': -2.1, 'Private investment': -2.5, 'Public consumption and investment': 0.7, 'Net exports': 0.7, 'Inventories': -1.1 },
  { quarter: 'Q4 2021', 'Household consumption': 3.9, 'Private investment': 3.1, 'Public consumption and investment': 0.2, 'Net exports': -0.4, 'Inventories': 0.7 },
  { quarter: 'Q1 2022', 'Household consumption': 0.6, 'Private investment': 0.9, 'Public consumption and investment': 0.7, 'Net exports': -1.9, 'Inventories': 1.0 },
  { quarter: 'Q2 2022', 'Household consumption': 0.7, 'Private investment': 1.1, 'Public consumption and investment': 0.0, 'Net exports': 0.7, 'Inventories': -0.9 },
  { quarter: 'Q3 2022', 'Household consumption': 0.7, 'Private investment': 0.4, 'Public consumption and investment': -0.1, 'Net exports': -0.4, 'Inventories': 0.5 },
  { quarter: 'Q4 2022', 'Household consumption': 0.7, 'Private investment': 0.1, 'Public consumption and investment': 0.2, 'Net exports': 1.1, 'Inventories': -0.5 },
  { quarter: 'Q1 2023', 'Household consumption': 0.4, 'Private investment': 0.1, 'Public consumption and investment': 0.2, 'Net exports': -0.3, 'Inventories': 0.1 },
  { quarter: 'Q2 2023', 'Household consumption': 0.4, 'Private investment': 0.1, 'Public consumption and investment': 0.5, 'Net exports': 0.9, 'Inventories': -1.1 },
];

const employmentData = [
  { date: '3/1/2016', Employment: 100, 'Real domestic demand': 100, 'Nominal domestic demand': 100 },
  { date: '6/1/2016', Employment: 100.2, 'Real domestic demand': 100.7, 'Nominal domestic demand': 100.8 },
  { date: '9/1/2016', Employment: 100.3, 'Real domestic demand': 101.0, 'Nominal domestic demand': 101.4 },
  { date: '12/1/2016', Employment: 100.6, 'Real domestic demand': 101.7, 'Nominal domestic demand': 102.2 },
  { date: '3/1/2017', Employment: 101.2, 'Real domestic demand': 102.7, 'Nominal domestic demand': 104.4 },
  { date: '6/1/2017', Employment: 102.3, 'Real domestic demand': 102.9, 'Nominal domestic demand': 104.8 },
  { date: '9/1/2017', Employment: 103.2, 'Real domestic demand': 104.3, 'Nominal domestic demand': 106.3 },
  { date: '12/1/2017', Employment: 103.8, 'Real domestic demand': 105.2, 'Nominal domestic demand': 107.6 },
  { date: '3/1/2018', Employment: 104.5, 'Real domestic demand': 106.2, 'Nominal domestic demand': 109.1 },
  { date: '6/1/2018', Employment: 105.1, 'Real domestic demand': 106.8, 'Nominal domestic demand': 110.4 },
  { date: '9/1/2018', Employment: 105.7, 'Real domestic demand': 106.8, 'Nominal domestic demand': 111.1 },
  { date: '12/1/2018', Employment: 106.2, 'Real domestic demand': 107.0, 'Nominal domestic demand': 111.6 },
  { date: '3/1/2019', Employment: 106.8, 'Real domestic demand': 107.3, 'Nominal domestic demand': 112.7 },
  { date: '6/1/2019', Employment: 107.7, 'Real domestic demand': 107.2, 'Nominal domestic demand': 112.9 },
  { date: '9/1/2019', Employment: 108.4, 'Real domestic demand': 107.9, 'Nominal domestic demand': 113.9 },
  { date: '12/1/2019', Employment: 108.3, 'Real domestic demand': 108.2, 'Nominal domestic demand': 115.2 },
  { date: '3/1/2020', Employment: 108.7, 'Real domestic demand': 107.8, 'Nominal domestic demand': 115.2 },
  { date: '6/1/2020', Employment: 103.1, 'Real domestic demand': 98.8, 'Nominal domestic demand': 105.1 },
  { date: '9/1/2020', Employment: 105.4, 'Real domestic demand': 105.2, 'Nominal domestic demand': 111.9 },
  { date: '12/1/2020', Employment: 107.1, 'Real domestic demand': 108.5, 'Nominal domestic demand': 116.2 },
  { date: '3/1/2021', Employment: 108.5, 'Real domestic demand': 111.6, 'Nominal domestic demand': 119.4 },
  { date: '6/1/2021', Employment: 109.6, 'Real domestic demand': 113.4, 'Nominal domestic demand': 122.3 },
  { date: '9/1/2021', Employment: 109.2, 'Real domestic demand': 110.3, 'Nominal domestic demand': 119.9 },
  { date: '12/1/2021', Employment: 109.8, 'Real domestic demand': 114.9, 'Nominal domestic demand': 126.5 },
  { date: '3/1/2022', Employment: 112.1, 'Real domestic demand': 118.0, 'Nominal domestic demand': 132.3 },
  { date: '6/1/2022', Employment: 113.6, 'Real domestic demand': 117.8, 'Nominal domestic demand': 134.5 },
  { date: '9/1/2022', Employment: 115.0, 'Real domestic demand': 119.2, 'Nominal domestic demand': 138.5 },
  { date: '12/1/2022', Employment: 115.7, 'Real domestic demand': 118.7, 'Nominal domestic demand': 139.8 },
  { date: '3/1/2023', Employment: 116.0, 'Real domestic demand': 119.7, 'Nominal domestic demand': 142.8 },
  { date: '6/1/2023', Employment: 117.3, 'Real domestic demand': 119.2, 'Nominal domestic demand': 142.9 },
];

const EconomicGrowthVisualization = () => {
  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('OECD');
  const [timeRange, setTimeRange] = useState([0, 100]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(fetchedData => {
      setData(fetchedData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (!data) return <div>No data available</div>;

  const filteredGdpData = data.gdpData.slice(
    Math.floor(timeRange[0] / 100 * data.gdpData.length),
    Math.ceil(timeRange[1] / 100 * data.gdpData.length)
  );

  const recoveryStrengthData = data.gdpData.map((d, i) => ({
    quarter: d.quarter,
    'Recovery Strength': i > 0 ? ((d[selectedCountry] - data.gdpData[i-1][selectedCountry]) / data.gdpData[i-1][selectedCountry]) * 100 : 0
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Economic Growth Visualization</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select a Country</h2>
        <Select onValueChange={setSelectedCountry} defaultValue={selectedCountry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(data.gdpData[0]).filter(k => k !== 'quarter').map(country => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Adjust Time Range</h2>
        <Slider
          defaultValue={timeRange}
          max={100}
          step={1}
          onValueChange={setTimeRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GDP Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredGdpData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={selectedCountry} stroke="#8884d8" />
                <Brush dataKey="quarter" height={30} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Components</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.growthComponentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Household consumption" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="Private investment" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="Public consumption" stackId="1" stroke="#ffc658" fill="#ffc658" />
                <Area type="monotone" dataKey="Net exports" stackId="1" stroke="#ff7300" fill="#ff7300" />
                <Area type="monotone" dataKey="Inventories" stackId="1" stroke="#387908" fill="#387908" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment and Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.employmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Employment" stroke="#8884d8" />
                <Line type="monotone" dataKey="Real domestic demand" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Nominal domestic demand" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recovery Strength Index</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recoveryStrengthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Recovery Strength" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Analysis and Insights</h2>
        <p className="mb-2">
          This visualization provides a comprehensive view of economic growth across different countries and regions.
          Key observations include:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>GDP growth trends and variations among different countries</li>
          <li>The composition of growth factors and their changes over time</li>
          <li>Relationships between employment, real domestic demand, and nominal domestic demand</li>
          <li>A derived "Recovery Strength Index" showing the rate of economic recovery</li>
        </ul>
        <p>
          Use the country selector and time range slider to explore different aspects of the data and uncover insights
          about economic growth patterns and recovery rates.
        </p>
      </div>
    </div>
  );
};

export default EconomicGrowthVisualization;