# Precipitation Analysis System

A comprehensive web application for statistical analysis of precipitation data, built with React and designed for civil and water resources engineers.

## Features

### 📊 Data Input
- **Multiple Input Methods:**
  - Manual entry with editable table
  - Paste data from clipboard (tab or comma-separated)
  - Pre-loaded sample datasets
- **Data Types Supported:**
  - Daily maximum annual rainfall
  - Monthly rainfall totals
  - Annual rainfall totals
- **Data Validation:** Minimum 10 data points required

### 📈 Statistical Analysis Methods

#### 1. **Normal Distribution**
- Formula: X<sub>T</sub> = X̄ + K × SD
- Uses standard normal frequency factors
- Suitable for symmetric data

#### 2. **Gumbel Distribution (Extreme Value Type I)**
- Formula: X<sub>T</sub> = X̄ + K × SD where K = (Y<sub>T</sub> - Y<sub>n</sub>) / S<sub>n</sub>
- Widely used for extreme rainfall analysis
- Y<sub>n</sub> and S<sub>n</sub> parameters based on sample size

#### 3. **Log-Normal Distribution**
- Transforms data to logarithmic space
- Formula: log X<sub>T</sub> = log X̄ + K × SD(log X)
- Good for positively skewed data

#### 4. **Log-Pearson Type III**
- Recommended by USGS for flood frequency analysis
- Accounts for skewness coefficient (C<sub>s</sub>)
- Uses frequency factor K<sub>T</sub> from statistical tables

### 🌧️ Mononobe Analysis
- Calculates short-duration rainfall intensity
- Formula: I = (R<sub>24</sub>/24) × (24/t)<sup>2/3</sup>
- Generates IDF (Intensity-Duration-Frequency) curves
- Durations: 1, 2, 3, 4, 5, 6, 8, 12, and 24 hours

### ✅ Goodness of Fit Tests

#### Chi-Square Test
- Tests frequency distribution fit
- Formula: χ² = Σ[(O<sub>i</sub> - E<sub>i</sub>)²/E<sub>i</sub>]
- 5% significance level
- Pass/fail indicators with critical values

#### Kolmogorov-Smirnov Test
- Tests cumulative distribution fit
- Formula: Δ<sub>max</sub> = max|F(x) - F<sub>o</sub>(x)|
- Critical value: Δ<sub>cr</sub> = 1.36 / √n
- Visual pass/fail indicators

### 📊 Visualizations
1. **Input Data Bar Chart** - View your rainfall data
2. **Frequency Histogram** - Distribution of rainfall values
3. **Return Period Curves** - Compare all distribution methods
4. **Probability Plots** - Assess theoretical vs observed fit
5. **IDF Curves** - Intensity-Duration-Frequency relationships
6. **Q-Q Plots** - Quantile-quantile comparison
7. **Statistical Coefficients Chart** - Cv, Cs, Ck visualization

### 📋 Results Tables
- Summary statistics (N, mean, SD, Cv, Cs, Ck)
- Design rainfall for return periods: 2, 5, 10, 25, 50, 100 years
- Detailed method comparison tables
- Mononobe intensity results
- Goodness of fit test results with recommendations

### 💾 Export Functionality
- Download results as CSV file
- Includes all statistical analysis
- Date-stamped filename

## Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Usage

### Step 1: Input Data
1. Select data type (Daily, Monthly, or Annual)
2. Choose input method:
   - **Manual Entry:** Add rows and enter data
   - **Paste Data:** Copy from Excel/CSV and paste
   - **Sample Data:** Use pre-loaded datasets for testing

### Step 2: View Analysis Results
- Click "Analysis Results" tab
- Review summary statistics
- Compare design rainfall from all methods
- Examine detailed calculations for each distribution

### Step 3: Check Goodness of Fit
- Click "Goodness of Fit" tab
- Review Chi-Square test results
- Review Kolmogorov-Smirnov test results
- See recommended distribution method

### Step 4: Visualize Results
- Click "Visualizations" tab
- Explore various charts and plots
- Assess fit quality visually
- Review IDF curves

### Step 5: Export Results
- Click "Export Results" button
- CSV file downloads automatically
- Use in reports or further analysis

## Technical Details

### Technologies Used
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Statistical Formulas
All calculations follow standard hydrological engineering practice and references:
- Chow, V.T., Maidment, D.R., and Mays, L.W. (1988). Applied Hydrology
- USGS Bulletin 17B/17C - Flood Flow Frequency Guidelines
- WMO Technical Notes on Hydrological Frequency Analysis

### File Structure
```
rainfall-analysis/
├── src/
│   ├── components/
│   │   ├── DataInput.jsx          # Data entry component
│   │   ├── ResultsTables.jsx      # Results display
│   │   ├── GoodnessOfFitTests.jsx # Test results
│   │   └── Charts.jsx             # Visualizations
│   ├── data/
│   │   └── sampleData.js          # Sample datasets
│   ├── utils/
│   │   └── statistics.js          # All statistical calculations
│   ├── App.jsx                    # Main application
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features for Engineers

### Data Validation
- Ensures minimum sample size (n ≥ 10)
- Validates positive rainfall values
- Warns about data quality issues

### Professional Output
- Clear tables with units
- Color-coded test results
- Formatted statistical coefficients
- Export-ready CSV format

### Methodology Documentation
- Click "Methodology" button for formulas
- Tooltips explain statistical terms
- References to standard practice
- Interpretation guidance

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## License
This project is provided for educational and professional use in hydrological engineering.

## Support
For issues or questions about hydrological methods, refer to standard textbooks and engineering manuals listed in the Methodology section.

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Built for:** Civil & Water Resources Engineers
