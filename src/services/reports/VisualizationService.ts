
import { ChartType, ReportResult } from "@/types/reports";

/**
 * Helper function to transform data for specific chart formats
 */
export const transformDataForChart = (
  data: any[],
  chartType: ChartType,
  options?: {
    xAxisKey?: string;
    yAxisKeys?: string[];
    categoryKey?: string;
    valueKey?: string;
    labelKey?: string;
    sortBy?: string;
    limit?: number;
    stacked?: boolean;
  }
): any[] => {
  if (!data || data.length === 0) {
    return [];
  }
  
  const {
    xAxisKey = Object.keys(data[0])[0],
    yAxisKeys,
    categoryKey,
    valueKey,
    labelKey,
    sortBy,
    limit = 50
  } = options || {};
  
  // Limit data to prevent performance issues with large datasets
  let limitedData = data.slice(0, limit);
  
  // Sort data if requested
  if (sortBy) {
    limitedData = limitedData.sort((a, b) => {
      if (typeof a[sortBy] === 'number') {
        return b[sortBy] - a[sortBy];
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });
  }
  
  // Transform data based on chart type
  switch (chartType) {
    case 'pie':
    case 'donut':
      if (categoryKey && valueKey) {
        return limitedData.map(item => ({
          name: item[categoryKey],
          value: item[valueKey]
        }));
      }
      return limitedData;
      
    case 'bar':
    case 'line':
    case 'area':
      // These chart types can use data as-is
      return limitedData;
      
    case 'scatter':
      // Make sure each point has x and y coordinates
      if (xAxisKey && yAxisKeys && yAxisKeys.length > 0) {
        return limitedData.map(item => ({
          x: item[xAxisKey],
          y: item[yAxisKeys[0]],
          ...item
        }));
      }
      return limitedData;
      
    case 'heatmap':
      // Typically needs a matrix format
      // This is a simple transformation assuming row/column/value structure
      if (xAxisKey && yAxisKeys && yAxisKeys.length > 0) {
        const rows = [...new Set(limitedData.map(item => item[xAxisKey]))];
        const cols = [...new Set(limitedData.map(item => item[yAxisKeys[0]]))];
        
        return rows.map(row => {
          const rowData: Record<string, any> = { name: row };
          cols.forEach(col => {
            const match = limitedData.find(
              item => item[xAxisKey] === row && item[yAxisKeys[0]] === col
            );
            rowData[col] = match ? match[yAxisKeys[1] || 'value'] : 0;
          });
          return rowData;
        });
      }
      return limitedData;
      
    case 'funnel':
      // Simple funnel transformation
      if (categoryKey && valueKey) {
        return limitedData.map(item => ({
          name: item[categoryKey],
          value: item[valueKey]
        }));
      }
      return limitedData;
      
    case 'gauge':
      // Return first item for gauge charts
      return limitedData.slice(0, 1);
      
    default:
      return limitedData;
  }
};

/**
 * Generates color palettes for charts
 */
export const generateChartColors = (count: number, theme: 'default' | 'categorical' | 'sequential' | 'diverging' = 'default'): string[] => {
  const palettes = {
    default: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
    categorical: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    sequential: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    diverging: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061']
  };
  
  const palette = palettes[theme];
  
  if (count <= palette.length) {
    return palette.slice(0, count);
  }
  
  // If we need more colors than in the palette, repeat them
  const repeatedPalette = [];
  for (let i = 0; i < count; i++) {
    repeatedPalette.push(palette[i % palette.length]);
  }
  
  return repeatedPalette;
};

/**
 * Generate configuration for different chart types
 */
export const generateChartConfig = (
  chartType: ChartType,
  data: any[],
  options?: {
    title?: string;
    xAxisKey?: string;
    yAxisKeys?: string[];
    categoryKey?: string;
    valueKey?: string;
    colors?: string[];
    showLegend?: boolean;
    stacked?: boolean;
  }
): Record<string, any> => {
  const {
    title,
    xAxisKey = Object.keys(data[0] || {})[0],
    yAxisKeys = [Object.keys(data[0] || {}).find(k => typeof data[0][k] === 'number') || ''],
    categoryKey,
    valueKey,
    colors,
    showLegend = true,
    stacked = false
  } = options || {};
  
  // Generate default colors if none provided
  const chartColors = colors || generateChartColors(yAxisKeys.length);
  
  // Base configuration
  const baseConfig = {
    title,
    colors: chartColors,
    showLegend
  };
  
  // Chart specific configurations
  switch (chartType) {
    case 'bar':
      return {
        ...baseConfig,
        xAxisKey,
        yAxisKeys,
        stacked,
        layout: 'vertical'
      };
      
    case 'line':
      return {
        ...baseConfig,
        xAxisKey,
        yAxisKeys,
        curve: 'monotone',
        showPoints: true
      };
      
    case 'area':
      return {
        ...baseConfig,
        xAxisKey,
        yAxisKeys,
        stacked,
        fillOpacity: 0.6
      };
      
    case 'pie':
    case 'donut':
      return {
        ...baseConfig,
        categoryKey: categoryKey || xAxisKey,
        valueKey: valueKey || yAxisKeys[0],
        innerRadius: chartType === 'donut' ? '60%' : '0',
        labelType: 'percent'
      };
      
    case 'scatter':
      return {
        ...baseConfig,
        xAxisKey,
        yAxisKey: yAxisKeys[0],
        bubbleKey: yAxisKeys[1] // Optional third dimension for bubble size
      };
      
    case 'heatmap':
      return {
        ...baseConfig,
        xAxisKey,
        yAxisKey: yAxisKeys[0],
        colorScale: [
          "#feedde",
          "#fdd0a2",
          "#fdae6b",
          "#fd8d3c",
          "#e6550d",
          "#a63603"
        ]
      };
      
    case 'funnel':
      return {
        ...baseConfig,
        categoryKey: categoryKey || xAxisKey,
        valueKey: valueKey || yAxisKeys[0]
      };
      
    case 'gauge':
      return {
        ...baseConfig,
        valueKey: valueKey || yAxisKeys[0],
        min: 0,
        max: 100,
        thresholds: [
          { value: 25, color: '#22c55e' },
          { value: 75, color: '#f59e0b' },
          { value: 100, color: '#ef4444' }
        ]
      };
      
    default:
      return baseConfig;
  }
};

/**
 * Format values for display in charts
 */
export const formatChartValue = (
  value: number,
  format: 'number' | 'currency' | 'percent' | 'bytes' | 'duration' | 'custom' = 'number',
  options?: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    customFormatter?: (value: number) => string;
  }
): string => {
  const {
    locale = 'en-IN',
    currency = 'INR',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    customFormatter
  } = options || {};
  
  if (customFormatter) {
    return customFormatter(value);
  }
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits
      }).format(value);
      
    case 'percent':
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits,
        maximumFractionDigits
      }).format(value / 100);
      
    case 'bytes':
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      let size = value;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(maximumFractionDigits)} ${units[unitIndex]}`;
      
    case 'duration':
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = Math.floor(value % 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
      
    case 'number':
    default:
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits
      }).format(value);
  }
};

/**
 * Calculate common statistical measures for data analysis
 */
export const calculateStatistics = (
  data: any[],
  valueKey: string
): {
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  median: number;
  stdDev: number;
} => {
  if (!data || data.length === 0) {
    return {
      count: 0,
      sum: 0,
      min: 0,
      max: 0,
      avg: 0,
      median: 0,
      stdDev: 0
    };
  }
  
  // Extract numeric values
  const values = data
    .map(item => item[valueKey])
    .filter(value => typeof value === 'number' && !isNaN(value));
  
  if (values.length === 0) {
    return {
      count: 0,
      sum: 0,
      min: 0,
      max: 0,
      avg: 0,
      median: 0,
      stdDev: 0
    };
  }
  
  // Sort values for median calculation
  const sortedValues = [...values].sort((a, b) => a - b);
  
  // Calculate statistics
  const count = values.length;
  const sum = values.reduce((acc, val) => acc + val, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = sum / count;
  
  // Calculate median
  const mid = Math.floor(sortedValues.length / 2);
  const median = sortedValues.length % 2 === 0
    ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
    : sortedValues[mid];
  
  // Calculate standard deviation
  const squaredDifferences = values.map(val => Math.pow(val - avg, 2));
  const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / count;
  const stdDev = Math.sqrt(variance);
  
  return {
    count,
    sum,
    min,
    max,
    avg,
    median,
    stdDev
  };
};
