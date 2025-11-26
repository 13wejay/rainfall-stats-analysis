import React from 'react';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Charts({ inputData, analysisResults, mononobeResults }) {
  if (!analysisResults) {
    return (
      <div className="text-center py-8 text-gray-600">
        No data available for visualization.
      </div>
    );
  }

  const { normal, gumbel, logNormal, logPearson } = analysisResults;

  // Prepare data for input visualization
  const inputChartData = inputData.map((d, i) => ({
    name: d.date,
    value: d.value,
    index: i + 1
  }));

  // Prepare data for return period vs design rainfall
  const returnPeriodData = normal.results.map((row, idx) => ({
    returnPeriod: row.returnPeriod,
    normal: row.designRainfall,
    gumbel: gumbel.results[idx].designRainfall,
    logNormal: logNormal.results[idx].designRainfall,
    logPearson: logPearson.results[idx].designRainfall
  }));

  // Prepare IDF curves data
  const idfData = mononobeResults ? [1, 2, 3, 4, 5, 6, 8, 12, 24].map(duration => {
    const dataPoint = { duration };
    mononobeResults.forEach(result => {
      dataPoint[`T${result.returnPeriod}`] = result.intensities[duration];
    });
    return dataPoint;
  }) : [];

  // Prepare frequency histogram
  const histogramData = (() => {
    const sorted = [...inputData.map(d => d.value)].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const numBins = Math.ceil(Math.sqrt(sorted.length));
    const binWidth = (max - min) / numBins;
    
    const bins = [];
    for (let i = 0; i < numBins; i++) {
      const lowerBound = min + i * binWidth;
      const upperBound = min + (i + 1) * binWidth;
      const count = sorted.filter(v => v >= lowerBound && v < upperBound).length;
      bins.push({
        range: `${lowerBound.toFixed(0)}-${upperBound.toFixed(0)}`,
        frequency: count,
        midpoint: (lowerBound + upperBound) / 2
      });
    }
    return bins;
  })();

  return (
    <div className="space-y-8">
      {/* Input Data Visualization */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Input Data Visualization</h3>
        <div className="bg-white p-4 rounded-lg border">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inputChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={Math.floor(inputChartData.length / 10)}
              />
              <YAxis label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" name="Rainfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Frequency Histogram */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Frequency Distribution Histogram</h3>
        <div className="bg-white p-4 rounded-lg border">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" label={{ value: 'Rainfall Range (mm)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="frequency" fill="#10b981" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Return Period vs Design Rainfall */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Return Period vs Design Rainfall (All Methods)</h3>
        <div className="bg-white p-4 rounded-lg border">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={returnPeriodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="returnPeriod" 
                label={{ value: 'Return Period (Years)', position: 'insideBottom', offset: -5 }}
                scale="log"
                domain={['auto', 'auto']}
              />
              <YAxis label={{ value: 'Design Rainfall (mm)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="normal" stroke="#3b82f6" strokeWidth={2} name="Normal" />
              <Line type="monotone" dataKey="gumbel" stroke="#ef4444" strokeWidth={2} name="Gumbel" />
              <Line type="monotone" dataKey="logNormal" stroke="#10b981" strokeWidth={2} name="Log-Normal" />
              <Line type="monotone" dataKey="logPearson" stroke="#f59e0b" strokeWidth={2} name="Log-Pearson III" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* IDF Curves */}
      {idfData.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Intensity-Duration-Frequency (IDF) Curves</h3>
          <p className="text-sm text-gray-600 mb-3">
            Short-duration rainfall intensity calculated using Mononobe formula
          </p>
          <div className="bg-white p-4 rounded-lg border">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={idfData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="duration" 
                  label={{ value: 'Duration (hours)', position: 'insideBottom', offset: -5 }}
                  scale="log"
                  domain={[1, 24]}
                />
                <YAxis label={{ value: 'Intensity (mm/hr)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {mononobeResults.map((result, idx) => {
                  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                  return (
                    <Line 
                      key={result.returnPeriod}
                      type="monotone" 
                      dataKey={`T${result.returnPeriod}`} 
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2}
                      name={`T = ${result.returnPeriod} years`}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary Statistics Chart */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Statistical Coefficients</h3>
        <div className="bg-white p-4 rounded-lg border">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Cv', value: normal.stats.cv, description: 'Coefficient of Variation' },
              { name: 'Cs', value: normal.stats.cs, description: 'Coefficient of Skewness' },
              { name: 'Ck', value: normal.stats.ck, description: 'Coefficient of Kurtosis' }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border rounded shadow-lg">
                        <p className="font-medium">{payload[0].payload.description}</p>
                        <p className="text-blue-600">Value: {payload[0].value.toFixed(4)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
