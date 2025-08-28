export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Generate realistic sample OHLCV data with 300 candles
export const generateSampleData = (): CandleData[] => {
  const data: CandleData[] = [];
  const basePrice = 100;
  const startDate = new Date('2024-01-01').getTime();
  
  let currentPrice = basePrice;
  
  for (let i = 0; i < 300; i++) {
    const timestamp = startDate + (i * 24 * 60 * 60 * 1000); // Daily candles
    
    // Generate price movement with some volatility
    const priceChange = (Math.random() - 0.5) * 4; // ±2% max change
    currentPrice = Math.max(currentPrice + priceChange, 50); // Don't go below 50
    
    const volatility = 0.02; // 2% intraday volatility
    const high = currentPrice * (1 + Math.random() * volatility);
    const low = currentPrice * (1 - Math.random() * volatility);
    
    // Ensure open and close are within high/low range
    const open = low + Math.random() * (high - low);
    const close = low + Math.random() * (high - low);
    
    const volume = Math.floor(Math.random() * 1000000) + 100000; // 100K to 1.1M volume
    
    data.push({
      timestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
    
    currentPrice = close; // Use close as basis for next candle
  }
  
  return data;
};

export const sampleData = generateSampleData();
