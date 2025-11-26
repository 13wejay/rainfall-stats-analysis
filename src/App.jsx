import React, { useState, useMemo } from 'react';
import { Download, Info, BarChart3, Table, CheckSquare } from 'lucide-react';
import DataInput from './components/DataInput';
import ResultsTables from './components/ResultsTables';
import GoodnessOfFitTests from './components/GoodnessOfFitTests';
import Charts from './components/Charts';
import { 
  calculateAllDistributions, 
  mononobeAnalysis,
  chiSquareTest,
  kolmogorovSmirnovTest,
  normalCDF,
  gumbelCDF,
  logNormalCDF,
  generateTheoreticalDistribution
} from './utils/statistics';

function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [inputData, setInputData] = useState({ type: 'daily', data: [], isValid: false });
  const [showMethodology, setShowMethodology] = useState(false);

  // Calculate all results when data changes
  const analysisResults = useMemo(() => {
    if (!inputData.isValid || inputData.data.length < 10) return null;
    
    const values = inputData.data.map(d => d.value);
    return calculateAllDistributions(values);
  }, [inputData]);

  // Calculate Mononobe analysis
  const mononobeResults = useMemo(() => {
    if (!analysisResults) return null;
    
    // Use Gumbel distribution for 24-hour rainfall
    const designRainfall24hr = {};
    analysisResults.gumbel.results.forEach(result => {
      designRainfall24hr[result.returnPeriod] = result.designRainfall;
    });
    
    return mononobeAnalysis(designRainfall24hr);
  }, [analysisResults]);

  // Calculate goodness of fit tests
  const testResults = useMemo(() => {
    if (!analysisResults || !inputData.isValid) return null;
    
    const values = inputData.data.map(d => d.value);
    const chiSquare = {};
    const kolmogorovSmirnov = {};
    
    // Test Normal Distribution
    const normalTheoretical = generateTheoreticalDistribution(values, 'Normal', {
      mean: analysisResults.normal.stats.mean,
      stdDev: analysisResults.normal.stats.stdDev
    });
    chiSquare['Normal'] = chiSquareTest(values, normalTheoretical);
    kolmogorovSmirnov['Normal'] = kolmogorovSmirnovTest(
      values,
      (x) => normalCDF(x, analysisResults.normal.stats.mean, analysisResults.normal.stats.stdDev)
    );
    
    // Test Gumbel Distribution
    const gumbelTheoretical = generateTheoreticalDistribution(values, 'Gumbel', {
      mean: analysisResults.gumbel.stats.mean,
      stdDev: analysisResults.gumbel.stats.stdDev,
      yn: analysisResults.gumbel.yn,
      sn: analysisResults.gumbel.sn
    });
    chiSquare['Gumbel'] = chiSquareTest(values, gumbelTheoretical);
    kolmogorovSmirnov['Gumbel'] = kolmogorovSmirnovTest(
      values,
      (x) => gumbelCDF(x, analysisResults.gumbel.stats.mean, analysisResults.gumbel.stats.stdDev, 
                       analysisResults.gumbel.yn, analysisResults.gumbel.sn)
    );
    
    // Test Log-Normal Distribution
    const logNormalTheoretical = generateTheoreticalDistribution(values, 'Log-Normal', {
      mean: analysisResults.logNormal.stats.mean,
      stdDev: analysisResults.logNormal.stats.stdDev,
      logMean: analysisResults.logNormal.logStats.mean,
      logStdDev: analysisResults.logNormal.logStats.stdDev
    });
    chiSquare['Log-Normal'] = chiSquareTest(values, logNormalTheoretical);
    kolmogorovSmirnov['Log-Normal'] = kolmogorovSmirnovTest(
      values,
      (x) => logNormalCDF(x, analysisResults.logNormal.logStats.mean, analysisResults.logNormal.logStats.stdDev)
    );
    
    // Test Log-Pearson Type III
    const logPearsonTheoretical = generateTheoreticalDistribution(values, 'Log-Pearson III', {
      mean: analysisResults.logPearson.stats.mean,
      stdDev: analysisResults.logPearson.stats.stdDev,
      logMean: analysisResults.logPearson.logStats.mean,
      logStdDev: analysisResults.logPearson.logStats.stdDev
    });
    chiSquare['Log-Pearson III'] = chiSquareTest(values, logPearsonTheoretical);
    kolmogorovSmirnov['Log-Pearson III'] = kolmogorovSmirnovTest(
      values,
      (x) => logNormalCDF(x, analysisResults.logPearson.logStats.mean, analysisResults.logPearson.logStats.stdDev)
    );
    
    return { chiSquare, kolmogorovSmirnov };
  }, [analysisResults, inputData]);

  const handleDataChange = (data) => {
    setInputData(data);
    if (data.isValid) {
      setActiveTab('results');
    }
  };

  const handleExport = () => {
    if (!analysisResults) return;
    
    let csvContent = "Precipitation Analysis Results\n\n";
    
    // Summary Statistics
    csvContent += "Summary Statistics\n";
    csvContent += `Sample Size,${analysisResults.normal.stats.n}\n`;
    csvContent += `Mean,${analysisResults.normal.stats.mean.toFixed(2)} mm\n`;
    csvContent += `Standard Deviation,${analysisResults.normal.stats.stdDev.toFixed(2)} mm\n`;
    csvContent += `Coefficient of Variation,${analysisResults.normal.stats.cv.toFixed(4)}\n`;
    csvContent += `Coefficient of Skewness,${analysisResults.normal.stats.cs.toFixed(4)}\n`;
    csvContent += `Coefficient of Kurtosis,${analysisResults.normal.stats.ck.toFixed(4)}\n\n`;
    
    // Design Rainfall
    csvContent += "Design Rainfall (mm)\n";
    csvContent += "Return Period,Normal,Gumbel,Log-Normal,Log-Pearson III\n";
    analysisResults.normal.results.forEach((row, idx) => {
      csvContent += `${row.returnPeriod},${row.designRainfall.toFixed(2)},`;
      csvContent += `${analysisResults.gumbel.results[idx].designRainfall.toFixed(2)},`;
      csvContent += `${analysisResults.logNormal.results[idx].designRainfall.toFixed(2)},`;
      csvContent += `${analysisResults.logPearson.results[idx].designRainfall.toFixed(2)}\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rainfall_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'input', label: 'Data Input', icon: Table },
    { id: 'results', label: 'Analysis Results', icon: BarChart3, disabled: !inputData.isValid },
    { id: 'tests', label: 'Goodness of Fit', icon: CheckSquare, disabled: !inputData.isValid },
    { id: 'charts', label: 'Visualizations', icon: BarChart3, disabled: !inputData.isValid }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Precipitation Analysis
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Comprehensive statistical analysis for rainfall frequency distribution
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMethodology(!showMethodology)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Info size={18} />
                Methodology
              </button>
              {inputData.isValid && (
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  Export Results
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Statistical Methodology</h2>
              <button
                onClick={() => setShowMethodology(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Normal Distribution</h3>
                <p className="mb-2">Assumes rainfall follows a bell-shaped Gaussian distribution.</p>
                <p className="font-mono bg-gray-100 p-2 rounded">X<sub>T</sub> = X̄ + K × SD</p>
                <p className="text-sm mt-2">Where K is the frequency factor from standard normal tables based on return period T.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Gumbel Distribution (EV Type I)</h3>
                <p className="mb-2">Widely used for extreme value analysis of maximum rainfall events.</p>
                <p className="font-mono bg-gray-100 p-2 rounded">X<sub>T</sub> = X̄ + K × SD</p>
                <p className="font-mono bg-gray-100 p-2 rounded mt-1">K = (Y<sub>T</sub> - Y<sub>n</sub>) / S<sub>n</sub></p>
                <p className="font-mono bg-gray-100 p-2 rounded mt-1">Y<sub>T</sub> = -ln(-ln(1 - 1/T))</p>
                <p className="text-sm mt-2">Y<sub>n</sub> and S<sub>n</sub> are Gumbel parameters dependent on sample size.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Log-Normal Distribution</h3>
                <p className="mb-2">Suitable when logarithms of data are normally distributed.</p>
                <p className="font-mono bg-gray-100 p-2 rounded">log X<sub>T</sub> = log X̄ + K × SD(log X)</p>
                <p className="font-mono bg-gray-100 p-2 rounded mt-1">X<sub>T</sub> = antilog(log X<sub>T</sub>)</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Log-Pearson Type III</h3>
                <p className="mb-2">Recommended by USGS for flood frequency analysis, accounts for skewness.</p>
                <p className="font-mono bg-gray-100 p-2 rounded">log X<sub>T</sub> = log X̄ + K<sub>T</sub> × SD(log X)</p>
                <p className="text-sm mt-2">K<sub>T</sub> is determined from tables based on skewness coefficient (C<sub>s</sub>) and return period.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Mononobe Formula</h3>
                <p className="mb-2">Estimates short-duration rainfall intensity from 24-hour rainfall.</p>
                <p className="font-mono bg-gray-100 p-2 rounded">I = (R<sub>24</sub>/24) × (24/t)<sup>2/3</sup></p>
                <p className="text-sm mt-2">Used to develop Intensity-Duration-Frequency (IDF) curves for urban drainage design.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6. Goodness of Fit Tests</h3>
                <h4 className="font-semibold mt-3">Chi-Square Test:</h4>
                <p className="font-mono bg-gray-100 p-2 rounded">χ² = Σ[(O<sub>i</sub> - E<sub>i</sub>)²/E<sub>i</sub>]</p>
                <p className="text-sm mt-2">Tests if observed frequencies match expected distribution.</p>
                
                <h4 className="font-semibold mt-3">Kolmogorov-Smirnov Test:</h4>
                <p className="font-mono bg-gray-100 p-2 rounded">Δ<sub>max</sub> = max|F(x) - F<sub>o</sub>(x)|</p>
                <p className="text-sm mt-2">Tests maximum deviation between empirical and theoretical CDFs.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">References</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Chow, V.T., Maidment, D.R., and Mays, L.W. (1988). Applied Hydrology. McGraw-Hill.</li>
                  <li>USGS Bulletin 17B/17C: Guidelines for Determining Flood Flow Frequency.</li>
                  <li>World Meteorological Organization (WMO) Technical Notes on Hydrological Frequency Analysis.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => !tab.disabled && setActiveTab(tab.id)}
                    disabled={tab.disabled}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : tab.disabled
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'input' && (
              <DataInput onDataChange={handleDataChange} />
            )}

            {activeTab === 'results' && (
              <ResultsTables 
                analysisResults={analysisResults}
                mononobeResults={mononobeResults}
              />
            )}

            {activeTab === 'tests' && (
              <GoodnessOfFitTests testResults={testResults} />
            )}

            {activeTab === 'charts' && (
              <Charts 
                inputData={inputData.data}
                analysisResults={analysisResults}
                mononobeResults={mononobeResults}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Precipitation Analysis v1.1.0 | Built for Civil & Water Resources Engineers
          </p>
          <p className="mt-1">
            All calculations follow standard of hydrological engineering practice
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
