/**
 * Statistical Utilities for Precipitation Analysis
 * Implements standard hydrological formulas for frequency analysis
 */

// Standard normal distribution frequency factors for common return periods
const FREQUENCY_FACTORS = {
  2: 0.0,
  5: 0.842,
  10: 1.282,
  25: 1.751,
  50: 2.054,
  100: 2.326
};

// Gumbel distribution parameters (Yn and Sn) based on sample size
const GUMBEL_PARAMETERS = [
  { n: 10, yn: 0.4952, sn: 0.9496 },
  { n: 15, yn: 0.5128, sn: 1.0206 },
  { n: 20, yn: 0.5236, sn: 1.0628 },
  { n: 25, yn: 0.5309, sn: 1.0915 },
  { n: 30, yn: 0.5362, sn: 1.1124 },
  { n: 35, yn: 0.5403, sn: 1.1285 },
  { n: 40, yn: 0.5436, sn: 1.1413 },
  { n: 45, yn: 0.5463, sn: 1.1519 },
  { n: 50, yn: 0.5485, sn: 1.1607 },
  { n: 60, yn: 0.5521, sn: 1.1747 },
  { n: 70, yn: 0.5548, sn: 1.1854 },
  { n: 80, yn: 0.5569, sn: 1.1938 },
  { n: 90, yn: 0.5586, sn: 1.2007 },
  { n: 100, yn: 0.5600, sn: 1.2065 }
];

// Log-Pearson Type III frequency factors
const LOG_PEARSON_K_VALUES = {
  2: { '-3.0': -0.396, '-2.5': -0.360, '-2.0': -0.307, '-1.5': -0.240, '-1.0': -0.164, '-0.5': -0.083, '0.0': 0.0, '0.5': 0.083, '1.0': 0.164, '1.5': 0.240, '2.0': 0.307, '2.5': 0.360, '3.0': 0.396 },
  5: { '-3.0': 0.420, '-2.5': 0.518, '-2.0': 0.609, '-1.5': 0.696, '-1.0': 0.758, '-0.5': 0.808, '0.0': 0.842, '0.5': 0.856, '1.0': 0.852, '1.5': 0.833, '2.0': 0.799, '2.5': 0.754, '3.0': 0.711 },
  10: { '-3.0': 0.895, '-2.5': 1.086, '-2.0': 1.270, '-1.5': 1.435, '-1.0': 1.588, '-0.5': 1.716, '0.0': 1.282, '0.5': 1.366, '1.0': 1.340, '1.5': 1.309, '2.0': 1.270, '2.5': 1.193, '3.0': 1.086 },
  25: { '-3.0': 1.625, '-2.5': 2.016, '-2.0': 2.388, '-1.5': 2.719, '-1.0': 3.022, '-0.5': 3.271, '0.0': 1.751, '0.5': 1.967, '1.0': 1.880, '1.5': 1.806, '2.0': 1.716, '2.5': 1.606, '3.0': 1.501 },
  50: { '-3.0': 2.235, '-2.5': 2.824, '-2.0': 3.384, '-1.5': 3.889, '-1.0': 4.395, '-0.5': 4.970, '0.0': 2.054, '0.5': 2.453, '1.0': 2.278, '1.5': 2.193, '2.0': 2.054, '2.5': 1.910, '3.0': 1.777 },
  100: { '-3.0': 2.824, '-2.5': 3.615, '-2.0': 4.360, '-1.5': 5.040, '-1.0': 5.660, '-0.5': 6.265, '0.0': 2.326, '0.5': 2.891, '1.0': 2.615, '1.5': 2.517, '2.0': 2.326, '2.5': 2.163, '3.0': 2.000 }
};

/**
 * Calculate basic statistics
 */
export function calculateBasicStats(data) {
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  const cv = stdDev / mean; // Coefficient of variation
  
  // Coefficient of skewness (Cs)
  const m3 = data.reduce((sum, val) => sum + Math.pow(val - mean, 3), 0) / n;
  const cs = (n * m3) / ((n - 1) * (n - 2) * Math.pow(stdDev, 3));
  
  // Coefficient of kurtosis (Ck)
  const m4 = data.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0) / n;
  const ck = (n * (n + 1) * m4) / ((n - 1) * (n - 2) * (n - 3) * Math.pow(stdDev, 4)) - 
             (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  
  return { n, mean, stdDev, variance, cv, cs, ck };
}

/**
 * Normal Distribution Method
 * Formula: XT = X̄ + K × SD
 */
export function normalDistribution(data, returnPeriods = [2, 5, 10, 25, 50, 100]) {
  const stats = calculateBasicStats(data);
  const results = [];
  
  returnPeriods.forEach(T => {
    const K = FREQUENCY_FACTORS[T];
    const XT = stats.mean + K * stats.stdDev;
    results.push({
      returnPeriod: T,
      frequencyFactor: K,
      designRainfall: XT
    });
  });
  
  return { stats, results, method: 'Normal Distribution' };
}

/**
 * Get Gumbel parameters by interpolation
 */
function getGumbelParams(n) {
  if (n <= 10) return GUMBEL_PARAMETERS[0];
  if (n >= 100) return GUMBEL_PARAMETERS[GUMBEL_PARAMETERS.length - 1];
  
  // Linear interpolation
  for (let i = 0; i < GUMBEL_PARAMETERS.length - 1; i++) {
    if (n >= GUMBEL_PARAMETERS[i].n && n <= GUMBEL_PARAMETERS[i + 1].n) {
      const p1 = GUMBEL_PARAMETERS[i];
      const p2 = GUMBEL_PARAMETERS[i + 1];
      const ratio = (n - p1.n) / (p2.n - p1.n);
      return {
        yn: p1.yn + ratio * (p2.yn - p1.yn),
        sn: p1.sn + ratio * (p2.sn - p1.sn)
      };
    }
  }
  
  return GUMBEL_PARAMETERS[0];
}

/**
 * Gumbel Distribution Method (Extreme Value Type I)
 * Formula: XT = X̄ + K × SD
 * K = (YT - Yn) / Sn
 * YT = -ln(-ln(1 - 1/T)) = reduced variate
 */
export function gumbelDistribution(data, returnPeriods = [2, 5, 10, 25, 50, 100]) {
  const stats = calculateBasicStats(data);
  const { yn, sn } = getGumbelParams(stats.n);
  const results = [];
  
  returnPeriods.forEach(T => {
    const YT = -Math.log(-Math.log(1 - 1/T));
    const K = (YT - yn) / sn;
    const XT = stats.mean + K * stats.stdDev;
    results.push({
      returnPeriod: T,
      reducedVariate: YT,
      frequencyFactor: K,
      designRainfall: XT
    });
  });
  
  return { stats, results, method: 'Gumbel Distribution', yn, sn };
}

/**
 * Log-Normal Distribution Method
 * Transform to log space, calculate, then back-transform
 */
export function logNormalDistribution(data, returnPeriods = [2, 5, 10, 25, 50, 100]) {
  const logData = data.map(x => Math.log10(x));
  const stats = calculateBasicStats(data);
  const logStats = calculateBasicStats(logData);
  const results = [];
  
  returnPeriods.forEach(T => {
    const K = FREQUENCY_FACTORS[T];
    const logXT = logStats.mean + K * logStats.stdDev;
    const XT = Math.pow(10, logXT);
    results.push({
      returnPeriod: T,
      frequencyFactor: K,
      logDesignRainfall: logXT,
      designRainfall: XT
    });
  });
  
  return { stats, logStats, results, method: 'Log-Normal Distribution' };
}

/**
 * Get Log-Pearson Type III frequency factor by interpolation
 */
function getLogPearsonK(T, cs) {
  const csValues = Object.keys(LOG_PEARSON_K_VALUES[T]).map(parseFloat).sort((a, b) => a - b);
  
  // Clamp cs to available range
  const minCs = csValues[0];
  const maxCs = csValues[csValues.length - 1];
  const clampedCs = Math.max(minCs, Math.min(maxCs, cs));
  
  // Find bracketing values
  for (let i = 0; i < csValues.length - 1; i++) {
    if (clampedCs >= csValues[i] && clampedCs <= csValues[i + 1]) {
      const cs1 = csValues[i];
      const cs2 = csValues[i + 1];
      const k1 = LOG_PEARSON_K_VALUES[T][cs1.toFixed(1)];
      const k2 = LOG_PEARSON_K_VALUES[T][cs2.toFixed(1)];
      const ratio = (clampedCs - cs1) / (cs2 - cs1);
      return k1 + ratio * (k2 - k1);
    }
  }
  
  // Return closest value
  const closestCs = csValues.reduce((prev, curr) => 
    Math.abs(curr - clampedCs) < Math.abs(prev - clampedCs) ? curr : prev
  );
  return LOG_PEARSON_K_VALUES[T][closestCs.toFixed(1)];
}

/**
 * Log-Pearson Type III Distribution Method
 * Uses skewness coefficient to determine frequency factor
 */
export function logPearsonTypeIII(data, returnPeriods = [2, 5, 10, 25, 50, 100]) {
  const logData = data.map(x => Math.log10(x));
  const stats = calculateBasicStats(data);
  const logStats = calculateBasicStats(logData);
  const results = [];
  
  returnPeriods.forEach(T => {
    const KT = getLogPearsonK(T, logStats.cs);
    const logXT = logStats.mean + KT * logStats.stdDev;
    const XT = Math.pow(10, logXT);
    results.push({
      returnPeriod: T,
      frequencyFactor: KT,
      logDesignRainfall: logXT,
      designRainfall: XT
    });
  });
  
  return { stats, logStats, results, method: 'Log-Pearson Type III' };
}

/**
 * Mononobe Analysis for short-duration rainfall intensity
 * Formula: I = (R24/24) × (24/t)^(2/3)
 * Where: I = rainfall intensity (mm/hr), R24 = 24-hour rainfall (mm), t = duration (hours)
 */
export function mononobeAnalysis(designRainfall24hr, durations = [1, 2, 3, 4, 5, 6, 8, 12, 24]) {
  const results = [];
  
  Object.entries(designRainfall24hr).forEach(([period, R24]) => {
    const intensities = {};
    durations.forEach(t => {
      const I = (R24 / 24) * Math.pow(24 / t, 2/3);
      intensities[t] = I;
    });
    results.push({
      returnPeriod: parseInt(period),
      R24,
      intensities
    });
  });
  
  return results;
}

/**
 * Chi-Square Goodness of Fit Test
 * χ² = Σ[(Oi - Ei)²/Ei]
 */
export function chiSquareTest(observedData, expectedDistribution, numParameters = 2) {
  const n = observedData.length;
  
  // Create frequency classes (typically 5-10 classes)
  const numClasses = Math.min(Math.ceil(Math.sqrt(n)), 10);
  const sortedObs = [...observedData].sort((a, b) => a - b);
  const sortedExp = [...expectedDistribution].sort((a, b) => a - b);
  
  const min = Math.min(...sortedObs);
  const max = Math.max(...sortedObs);
  const classWidth = (max - min) / numClasses;
  
  let chiSquare = 0;
  const classes = [];
  
  for (let i = 0; i < numClasses; i++) {
    const lowerBound = min + i * classWidth;
    const upperBound = min + (i + 1) * classWidth;
    
    const observed = sortedObs.filter(x => x >= lowerBound && (i === numClasses - 1 ? x <= upperBound : x < upperBound)).length;
    const expected = sortedExp.filter(x => x >= lowerBound && (i === numClasses - 1 ? x <= upperBound : x < upperBound)).length;
    
    if (expected > 0) {
      chiSquare += Math.pow(observed - expected, 2) / expected;
      classes.push({ lowerBound, upperBound, observed, expected });
    }
  }
  
  const degreesOfFreedom = Math.max(1, classes.length - numParameters - 1);
  
  // Critical values at 5% significance level
  const criticalValues = {
    1: 3.841, 2: 5.991, 3: 7.815, 4: 9.488, 5: 11.070,
    6: 12.592, 7: 14.067, 8: 15.507, 9: 16.919, 10: 18.307
  };
  
  const criticalValue = criticalValues[Math.min(degreesOfFreedom, 10)] || 18.307;
  const accepted = chiSquare < criticalValue;
  
  return {
    chiSquare,
    degreesOfFreedom,
    criticalValue,
    accepted,
    classes
  };
}

/**
 * Smirnov-Kolmogorov Goodness of Fit Test
 * Δmax = max|F(x) - Fo(x)|
 */
export function kolmogorovSmirnovTest(observedData, cumulativeDistributionFunction) {
  const n = observedData.length;
  const sortedData = [...observedData].sort((a, b) => a - b);
  
  let maxDeviation = 0;
  
  sortedData.forEach((x, i) => {
    const empiricalCDF = (i + 1) / n;
    const theoreticalCDF = cumulativeDistributionFunction(x);
    const deviation = Math.abs(empiricalCDF - theoreticalCDF);
    maxDeviation = Math.max(maxDeviation, deviation);
  });
  
  // Critical values at 5% significance level (Δcr = 1.36 / √n)
  const criticalValue = 1.36 / Math.sqrt(n);
  const accepted = maxDeviation < criticalValue;
  
  return {
    maxDeviation,
    criticalValue,
    sampleSize: n,
    accepted
  };
}

/**
 * Generate normal CDF for K-S test
 */
export function normalCDF(x, mean, stdDev) {
  const z = (x - mean) / stdDev;
  // Approximation of standard normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - probability : probability;
}

/**
 * Generate Gumbel CDF
 */
export function gumbelCDF(x, mean, stdDev, yn, sn) {
  const y = yn + sn * (x - mean) / stdDev;
  return Math.exp(-Math.exp(-y));
}

/**
 * Generate Log-Normal CDF
 */
export function logNormalCDF(x, logMean, logStdDev) {
  if (x <= 0) return 0;
  const logX = Math.log10(x);
  return normalCDF(logX, logMean, logStdDev);
}

/**
 * Generate sorted theoretical distribution for comparison
 */
export function generateTheoreticalDistribution(observedData, method, params) {
  const sorted = [...observedData].sort((a, b) => a - b);
  const n = sorted.length;
  
  return sorted.map((value, i) => {
    const p = (i + 1) / (n + 1); // Plotting position
    
    switch(method) {
      case 'Normal':
        // Generate value from normal distribution at this probability
        const z = inverseNormalCDF(p);
        return params.mean + z * params.stdDev;
        
      case 'Gumbel':
        // Generate value from Gumbel distribution
        const y = -Math.log(-Math.log(p));
        const k = (y - params.yn) / params.sn;
        return params.mean + k * params.stdDev;
        
      case 'Log-Normal':
        // Generate value from log-normal distribution
        const zLog = inverseNormalCDF(p);
        const logValue = params.logMean + zLog * params.logStdDev;
        return Math.pow(10, logValue);
        
      case 'Log-Pearson III':
        // Simplified approach using log-normal approximation
        const zLP = inverseNormalCDF(p);
        const logValueLP = params.logMean + zLP * params.logStdDev;
        return Math.pow(10, logValueLP);
        
      default:
        return value;
    }
  });
}

/**
 * Inverse normal CDF approximation
 */
function inverseNormalCDF(p) {
  // Beasley-Springer-Moro algorithm for inverse normal
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.47351093090, 23.08336743743, -21.06224101826, 3.13082909833];
  const c = [0.3374754822726147, 0.9761690190917186, 0.1607979714918209, 
             0.0276438810333863, 0.0038405729373609, 0.0003951896511919,
             0.0000321767881768, 0.0000002888167364, 0.0000003960315187];
  
  if (p <= 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((q+c[6])*q+c[7])*q+c[8])*q+1);
  } else if (p >= 0.97575) {
    const q = Math.sqrt(-2 * Math.log(1-p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
            ((((q+c[6])*q+c[7])*q+c[8])*q+1);
  } else {
    const q = p - 0.5;
    const r = q * q;
    return q * (((a[0]*r+a[1])*r+a[2])*r+a[3]) /
           (((b[0]*r+b[1])*r+b[2])*r+b[3]+1);
  }
}

/**
 * Calculate all distribution methods
 */
export function calculateAllDistributions(data, returnPeriods = [2, 5, 10, 25, 50, 100]) {
  return {
    normal: normalDistribution(data, returnPeriods),
    gumbel: gumbelDistribution(data, returnPeriods),
    logNormal: logNormalDistribution(data, returnPeriods),
    logPearson: logPearsonTypeIII(data, returnPeriods)
  };
}
