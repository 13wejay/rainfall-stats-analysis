import React from 'react';

export default function ResultsTables({ analysisResults, mononobeResults }) {
  if (!analysisResults) {
    return (
      <div className="text-center py-8 text-gray-600">
        No analysis results available. Please input data and run analysis.
      </div>
    );
  }

  const { normal, gumbel, logNormal, logPearson } = analysisResults;

  return (
    <div className="space-y-8">
      {/* Summary Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Summary Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Value</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">N</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{normal.stats.n}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Sample Size</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Mean (X̄)</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{normal.stats.mean.toFixed(2)} mm</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Average Rainfall</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Std Dev (SD)</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{normal.stats.stdDev.toFixed(2)} mm</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Standard Deviation</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Cv</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{normal.stats.cv.toFixed(4)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Coefficient of Variation</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Cs</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{normal.stats.cs.toFixed(4)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Coefficient of Skewness</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Ck</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{normal.stats.ck.toFixed(4)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">Coefficient of Kurtosis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Design Rainfall Comparison */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Design Rainfall for Different Return Periods</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Return Period (Years)</th>
                <th className="border border-gray-300 px-4 py-2">Normal Distribution</th>
                <th className="border border-gray-300 px-4 py-2">Gumbel Distribution</th>
                <th className="border border-gray-300 px-4 py-2">Log-Normal Distribution</th>
                <th className="border border-gray-300 px-4 py-2">Log-Pearson Type III</th>
              </tr>
            </thead>
            <tbody>
              {normal.results.map((row, idx) => (
                <tr key={row.returnPeriod} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center font-medium">{row.returnPeriod}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{row.designRainfall.toFixed(2)} mm</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{gumbel.results[idx].designRainfall.toFixed(2)} mm</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{logNormal.results[idx].designRainfall.toFixed(2)} mm</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{logPearson.results[idx].designRainfall.toFixed(2)} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Method Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Normal Distribution */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Normal Distribution</h4>
          <p className="text-sm text-gray-600 mb-2">Formula: X<sub>T</sub> = X̄ + K × SD</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-1">T (years)</th>
                  <th className="border border-gray-300 px-2 py-1">K</th>
                  <th className="border border-gray-300 px-2 py-1">X<sub>T</sub> (mm)</th>
                </tr>
              </thead>
              <tbody>
                {normal.results.map(row => (
                  <tr key={row.returnPeriod}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{row.returnPeriod}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.frequencyFactor.toFixed(3)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.designRainfall.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gumbel Distribution */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Gumbel Distribution</h4>
          <p className="text-sm text-gray-600 mb-2">Formula: X<sub>T</sub> = X̄ + K × SD</p>
          <p className="text-sm text-gray-600 mb-2">Y<sub>n</sub> = {gumbel.yn.toFixed(4)}, S<sub>n</sub> = {gumbel.sn.toFixed(4)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-1">T (years)</th>
                  <th className="border border-gray-300 px-2 py-1">Y<sub>T</sub></th>
                  <th className="border border-gray-300 px-2 py-1">K</th>
                  <th className="border border-gray-300 px-2 py-1">X<sub>T</sub> (mm)</th>
                </tr>
              </thead>
              <tbody>
                {gumbel.results.map(row => (
                  <tr key={row.returnPeriod}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{row.returnPeriod}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.reducedVariate.toFixed(3)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.frequencyFactor.toFixed(3)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.designRainfall.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log-Normal Distribution */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Log-Normal Distribution</h4>
          <p className="text-sm text-gray-600 mb-2">Log Mean = {logNormal.logStats.mean.toFixed(4)}</p>
          <p className="text-sm text-gray-600 mb-2">Log SD = {logNormal.logStats.stdDev.toFixed(4)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-1">T (years)</th>
                  <th className="border border-gray-300 px-2 py-1">K</th>
                  <th className="border border-gray-300 px-2 py-1">X<sub>T</sub> (mm)</th>
                </tr>
              </thead>
              <tbody>
                {logNormal.results.map(row => (
                  <tr key={row.returnPeriod}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{row.returnPeriod}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.frequencyFactor.toFixed(3)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.designRainfall.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log-Pearson Type III */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Log-Pearson Type III</h4>
          <p className="text-sm text-gray-600 mb-2">Log Mean = {logPearson.logStats.mean.toFixed(4)}</p>
          <p className="text-sm text-gray-600 mb-2">Log SD = {logPearson.logStats.stdDev.toFixed(4)}</p>
          <p className="text-sm text-gray-600 mb-2">Log Cs = {logPearson.logStats.cs.toFixed(4)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-1">T (years)</th>
                  <th className="border border-gray-300 px-2 py-1">K<sub>T</sub></th>
                  <th className="border border-gray-300 px-2 py-1">X<sub>T</sub> (mm)</th>
                </tr>
              </thead>
              <tbody>
                {logPearson.results.map(row => (
                  <tr key={row.returnPeriod}>
                    <td className="border border-gray-300 px-2 py-1 text-center">{row.returnPeriod}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.frequencyFactor.toFixed(3)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{row.designRainfall.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mononobe Analysis */}
      {mononobeResults && mononobeResults.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Mononobe Short-Duration Rainfall Intensity</h3>
          <p className="text-sm text-gray-600 mb-3">Formula: I = (R<sub>24</sub>/24) × (24/t)<sup>2/3</sup></p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Return Period (Years)</th>
                  <th className="border border-gray-300 px-4 py-2">R<sub>24</sub> (mm)</th>
                  <th className="border border-gray-300 px-4 py-2" colSpan={9}>Intensity (mm/hr) for Duration</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-1"></th>
                  <th className="border border-gray-300 px-2 py-1"></th>
                  {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(t => (
                    <th key={t} className="border border-gray-300 px-2 py-1 text-sm">{t}h</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mononobeResults.map(row => (
                  <tr key={row.returnPeriod} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center font-medium">{row.returnPeriod}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.R24.toFixed(2)}</td>
                    {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(t => (
                      <td key={t} className="border border-gray-300 px-2 py-1 text-right text-sm">
                        {row.intensities[t].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
