/**
 * Sample datasets for testing the precipitation analysis
 */

export const SAMPLE_DATASETS = {
  daily: {
    name: "Daily Maximum Annual Rainfall (30 years)",
    description: "Daily maximum rainfall for each year (mm)",
    type: "daily",
    data: [
      { id: 1, date: "2024", value: 145.5 },
      { id: 2, date: "2023", value: 132.8 },
      { id: 3, date: "2022", value: 168.2 },
      { id: 4, date: "2021", value: 125.4 },
      { id: 5, date: "2020", value: 156.7 },
      { id: 6, date: "2019", value: 141.3 },
      { id: 7, date: "2018", value: 178.9 },
      { id: 8, date: "2017", value: 134.6 },
      { id: 9, date: "2016", value: 162.5 },
      { id: 10, date: "2015", value: 149.8 },
      { id: 11, date: "2014", value: 155.2 },
      { id: 12, date: "2013", value: 138.7 },
      { id: 13, date: "2012", value: 172.4 },
      { id: 14, date: "2011", value: 143.9 },
      { id: 15, date: "2010", value: 167.1 },
      { id: 16, date: "2009", value: 151.3 },
      { id: 17, date: "2008", value: 159.6 },
      { id: 18, date: "2007", value: 136.2 },
      { id: 19, date: "2006", value: 164.8 },
      { id: 20, date: "2005", value: 147.5 },
      { id: 21, date: "2004", value: 153.9 },
      { id: 22, date: "2003", value: 142.1 },
      { id: 23, date: "2002", value: 169.3 },
      { id: 24, date: "2001", value: 148.6 },
      { id: 25, date: "2000", value: 161.7 },
      { id: 26, date: "1999", value: 139.4 },
      { id: 27, date: "1998", value: 174.2 },
      { id: 28, date: "1997", value: 146.8 },
      { id: 29, date: "1996", value: 158.5 },
      { id: 30, date: "1995", value: 144.7 }
    ]
  },
  monthly: {
    name: "Monthly Rainfall (24 months)",
    description: "Total monthly rainfall (mm)",
    type: "monthly",
    data: [
      { id: 1, date: "Jan 2024", value: 285.4 },
      { id: 2, date: "Dec 2023", value: 312.7 },
      { id: 3, date: "Nov 2023", value: 268.9 },
      { id: 4, date: "Oct 2023", value: 245.3 },
      { id: 5, date: "Sep 2023", value: 298.6 },
      { id: 6, date: "Aug 2023", value: 276.1 },
      { id: 7, date: "Jul 2023", value: 325.8 },
      { id: 8, date: "Jun 2023", value: 289.4 },
      { id: 9, date: "May 2023", value: 301.2 },
      { id: 10, date: "Apr 2023", value: 258.7 },
      { id: 11, date: "Mar 2023", value: 294.5 },
      { id: 12, date: "Feb 2023", value: 271.9 },
      { id: 13, date: "Jan 2023", value: 308.3 },
      { id: 14, date: "Dec 2022", value: 282.6 },
      { id: 15, date: "Nov 2022", value: 316.9 },
      { id: 16, date: "Oct 2022", value: 265.4 },
      { id: 17, date: "Sep 2022", value: 292.7 },
      { id: 18, date: "Aug 2022", value: 273.8 },
      { id: 19, date: "Jul 2022", value: 334.2 },
      { id: 20, date: "Jun 2022", value: 287.5 },
      { id: 21, date: "May 2022", value: 296.1 },
      { id: 22, date: "Apr 2022", value: 262.9 },
      { id: 23, date: "Mar 2022", value: 305.7 },
      { id: 24, date: "Feb 2022", value: 279.3 }
    ]
  },
  annual: {
    name: "Annual Rainfall (25 years)",
    description: "Total annual rainfall (mm)",
    type: "annual",
    data: [
      { id: 1, date: "2024", value: 1456.8 },
      { id: 2, date: "2023", value: 1523.4 },
      { id: 3, date: "2022", value: 1389.6 },
      { id: 4, date: "2021", value: 1612.7 },
      { id: 5, date: "2020", value: 1478.3 },
      { id: 6, date: "2019", value: 1545.9 },
      { id: 7, date: "2018", value: 1423.1 },
      { id: 8, date: "2017", value: 1567.2 },
      { id: 9, date: "2016", value: 1498.5 },
      { id: 10, date: "2015", value: 1534.8 },
      { id: 11, date: "2014", value: 1412.6 },
      { id: 12, date: "2013", value: 1589.4 },
      { id: 13, date: "2012", value: 1467.9 },
      { id: 14, date: "2011", value: 1556.3 },
      { id: 15, date: "2010", value: 1445.7 },
      { id: 16, date: "2009", value: 1578.1 },
      { id: 17, date: "2008", value: 1489.2 },
      { id: 18, date: "2007", value: 1512.5 },
      { id: 19, date: "2006", value: 1434.9 },
      { id: 20, date: "2005", value: 1601.8 },
      { id: 21, date: "2004", value: 1476.4 },
      { id: 22, date: "2003", value: 1543.6 },
      { id: 23, date: "2002", value: 1421.3 },
      { id: 24, date: "2001", value: 1595.7 },
      { id: 25, date: "2000", value: 1487.9 }
    ]
  }
};

export const DATA_TEMPLATES = {
  daily: { date: "", value: "" },
  monthly: { date: "", value: "" },
  annual: { date: "", value: "" }
};
