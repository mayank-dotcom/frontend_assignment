# Bollinger Bands Chart Application

A professional-grade technical analysis application built with React, Next.js, TypeScript, TailwindCSS, and KLineCharts. This application provides a complete implementation of Bollinger Bands indicator with TradingView-like functionality.

## 🎯 Features

### Core Functionality
- **Candlestick Chart**: High-performance candlestick visualization using KLineCharts
- **Bollinger Bands Indicator**: Complete implementation with three bands (upper, basis, lower)
- **Real-time Updates**: Instant updates when changing settings or styles
- **Interactive Crosshair**: Hover over the chart to see detailed data points
- **Professional UI**: TradingView-inspired interface with clean design

### Technical Indicators
- **Bollinger Bands**: Standard implementation with configurable parameters
  - Middle Band (Basis): Simple Moving Average (SMA)
  - Upper Band: Basis + (Multiplier × Standard Deviation)
  - Lower Band: Basis - (Multiplier × Standard Deviation)
  - Offset support for shifting bands forward/backward

### Settings & Customization

#### Input Settings
- **Length**: Number of periods for calculation (default: 20)
- **MA Type**: Simple Moving Average (SMA)
- **Source**: Price source (Close, Open, High, Low)
- **StdDev Multiplier**: Standard deviation multiplier (default: 2.0)
- **Offset**: Shift bands left/right by N periods

#### Style Settings
- **Line Visibility**: Toggle each band (upper, basis, lower) independently
- **Colors**: Customizable colors for each band
- **Line Styles**: Solid or dashed lines
- **Line Width**: Adjustable line thickness
- **Background Fill**: Configurable fill between upper and lower bands
- **Fill Opacity**: Adjustable transparency (0-100%)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── BollingerBandsChart.tsx  # Main chart component
│   ├── SettingsModal.tsx       # Settings modal with tabs
│   └── Tooltip.tsx             # Data tooltip component
├── data/
│   └── sampleData.ts           # Sample OHLCV data (300 candles)
└── utils/
    └── bollingerBands.ts       # Bollinger Bands calculations
```

## 🔧 Technical Implementation

### Data Structure
```typescript
interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
```

### Bollinger Bands Calculation
1. **Simple Moving Average (SMA)**: Average of source prices over N periods (basis line)
2. **Standard Deviation**: Population standard deviation of source prices over N periods
3. **Upper Band**: Basis + (StdDev multiplier × Standard Deviation)
4. **Lower Band**: Basis - (StdDev multiplier × Standard Deviation)
5. **Offset**: Shift all bands forward/backward by specified number of periods

**Formula Implementation:**
- **Basis (Middle Band)** = SMA(source, length)
- **StdDev** = Population standard deviation of the last `length` values of source
- **Upper** = Basis + (StdDev multiplier × StdDev)
- **Lower** = Basis - (StdDev multiplier × StdDev)
- **Offset**: Shifts the three series by offset bars on the chart (positive values shift forward)

**Note**: This implementation uses **population standard deviation** for consistency with most charting platforms.

### Key Components

#### BollingerBandsChart
- Integrates with KLineCharts for high-performance rendering
- Implements custom indicator with calculation and drawing logic
- Handles crosshair events for real-time data display
- Supports dynamic updates when settings change

#### SettingsModal
- Two-tab interface (Inputs and Style)
- Real-time preview of changes
- Reset to defaults functionality
- Form validation and constraints

#### Tooltip
- Shows current candle OHLCV data
- Displays Bollinger Bands values
- Formatted price and volume display
- Date formatting and color coding

## 📊 Sample Data

The application includes 300 candles of realistic sample data:
- **Timeframe**: Daily candles
- **Date Range**: 300 trading days
- **Price Range**: $50 - $150 (realistic volatility)
- **Volume**: 100K - 1.1M per day
- **Volatility**: ~2% intraday movement

## 🎨 UI/UX Features

### Professional Design
- Clean, modern interface inspired by TradingView
- Responsive design that works on desktop and mobile
- Consistent color scheme and typography
- Smooth animations and transitions

### User Experience
- One-click indicator addition/removal
- Instant setting updates without page refresh
- Intuitive modal with tabbed interface
- Comprehensive tooltips with formatted data
- Visual feedback for all interactions

## 🔍 Technical Specifications

### Performance
- Optimized for 200-1000 candles
- Efficient calculation algorithms
- Minimal re-renders with React optimizations
- Smooth 60fps chart interactions

### Browser Support
- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### Dependencies
- **React 19**: Latest React with new features
- **Next.js 15**: Full-stack React framework
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **KLineCharts 9.8.8**: High-performance charting library
- **Lucide React**: Beautiful icon library

## 🧪 Testing

The application includes:
- Type safety with TypeScript
- ESLint configuration for code quality
- Responsive design testing
- Cross-browser compatibility

## 📈 Future Enhancements

Potential improvements for production use:
- Real-time data integration
- Multiple timeframe support
- Additional technical indicators
- Export functionality
- Alert system
- Historical data persistence
- WebSocket integration for live updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using React, Next.js, TypeScript, TailwindCSS, and KLineCharts