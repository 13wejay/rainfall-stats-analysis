import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function GoodnessOfFitTests({ testResults }) {
  if (!testResults) {
    return (
      <div className="text-center py-8 text-gray-600">
        No goodness of fit test results available.
      </div>
    );
  }

  const StatusIcon = ({ accepted }) => {
    if (accepted) {
      return <CheckCircle className="text-green-600" size={20} />;
    }
    return <XCircle className="text-red-600" size={20} />;
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-blue-900">About Goodness of Fit Tests</h4>
            <p className="text-sm text-blue-800 mt-1">
              These tests determine how well the theoretical distribution fits the observed data. 
              A test is "Accepted" if the calculated statistic is less than the critical value at 5% significance level.
            </p>
          </div>
        </div>
      </div>

      {/* Chi-Square Test Results */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Chi-Square Test Results</h3>
        <p className="text-sm text-gray-600 mb-4">
          H₀: The observed data follows the theoretical distribution<br />
          H₁: The observed data does not follow the theoretical distribution<br />
          Significance Level: α = 0.05 (5%)
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Distribution Method</th>
                <th className="border border-gray-300 px-4 py-2">χ² Calculated</th>
                <th className="border border-gray-300 px-4 py-2">Degrees of Freedom</th>
                <th className="border border-gray-300 px-4 py-2">χ² Critical (α=0.05)</th>
                <th className="border border-gray-300 px-4 py-2">Decision</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(testResults.chiSquare).map(([method, result]) => (
                <tr key={method} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{method}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{result.chiSquare.toFixed(4)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{result.degreesOfFreedom}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{result.criticalValue.toFixed(4)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {result.chiSquare < result.criticalValue ? 'Accept H₀' : 'Reject H₀'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <StatusIcon accepted={result.accepted} />
                      <span className={result.accepted ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {result.accepted ? 'Accepted' : 'Rejected'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Chi-Square Test Interpretation:</h4>
          <p className="text-sm text-gray-700">
            • If χ² calculated &lt; χ² critical: Accept the distribution (good fit)<br />
            • If χ² calculated ≥ χ² critical: Reject the distribution (poor fit)
          </p>
        </div>
      </div>

      {/* Kolmogorov-Smirnov Test Results */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Kolmogorov-Smirnov Test Results</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tests the maximum deviation between empirical and theoretical cumulative distributions.<br />
          Significance Level: α = 0.05 (5%)
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Distribution Method</th>
                <th className="border border-gray-300 px-4 py-2">Δ<sub>max</sub> (Maximum Deviation)</th>
                <th className="border border-gray-300 px-4 py-2">Δ<sub>cr</sub> (Critical Value)</th>
                <th className="border border-gray-300 px-4 py-2">Sample Size</th>
                <th className="border border-gray-300 px-4 py-2">Decision</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(testResults.kolmogorovSmirnov).map(([method, result]) => (
                <tr key={method} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{method}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{result.maxDeviation.toFixed(4)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{result.criticalValue.toFixed(4)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{result.sampleSize}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {result.maxDeviation < result.criticalValue ? 'Accept H₀' : 'Reject H₀'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <StatusIcon accepted={result.accepted} />
                      <span className={result.accepted ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {result.accepted ? 'Accepted' : 'Rejected'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">K-S Test Interpretation:</h4>
          <p className="text-sm text-gray-700">
            • If Δmax &lt; Δcr: Accept the distribution (good fit)<br />
            • If Δmax ≥ Δcr: Reject the distribution (poor fit)<br />
            • Critical value formula: Δcr = 1.36 / √n (at α = 0.05)
          </p>
        </div>
      </div>

      {/* Summary and Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Distribution Method</h3>
        
        {(() => {
          const scores = {};
          
          // Calculate acceptance scores
          Object.keys(testResults.chiSquare).forEach(method => {
            scores[method] = 0;
            if (testResults.chiSquare[method].accepted) scores[method]++;
            if (testResults.kolmogorovSmirnov[method].accepted) scores[method]++;
          });
          
          const maxScore = Math.max(...Object.values(scores));
          const recommended = Object.entries(scores)
            .filter(([_, score]) => score === maxScore)
            .map(([method]) => method);
          
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(scores).map(([method, score]) => (
                  <div 
                    key={method}
                    className={`p-4 rounded-lg border-2 ${
                      recommended.includes(method)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{method}</span>
                      <span className="text-lg font-bold text-gray-700">{score}/2</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Tests Passed: {score} out of 2
                    </p>
                    {recommended.includes(method) && (
                      <div className="mt-2 flex items-center gap-2 text-green-700 font-medium">
                        <CheckCircle size={16} />
                        <span className="text-sm">Recommended</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-2">Guidance:</h4>
                <p className="text-sm text-gray-700">
                  • The recommended method(s) passed both goodness of fit tests.<br />
                  • If multiple methods are recommended, consider using the one with the smallest deviations.<br />
                  • If no method passes both tests, use engineering judgment and consider the characteristics of your data.<br />
                  • For highly skewed data, Log-Pearson Type III is often preferred in hydrological practice.
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
