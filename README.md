
# NILM Energy Dashboard 🔌⚡

An intelligent **Non-Intrusive Load Monitoring (NILM) Dashboard** with advanced energy analytics and AI-powered recommendations for smart home energy management.

## 🌟 Features

### 📊 Real-time Energy Monitoring
- **Live appliance tracking** without additional sensors
- **Multi-house support** (up to 6 houses)
- **Individual appliance analysis** (refrigerator, washer/dryer, microwave, dishwasher)
- **Real-time power consumption** visualization

### 🤖 Smart Analytics & AI Recommendations
- **Efficiency scoring** for each appliance
- **Usage pattern analysis** and optimization suggestions
- **Anomaly detection** for unusual consumption patterns
- **Cost estimation** with configurable electricity rates
- **Potential savings calculation** for better energy management

### 📈 Interactive Dashboard
- **Beautiful visualizations** with responsive charts
- **Time-series power consumption** tracking
- **Efficiency comparison** across appliances
- **Status monitoring** (active/standby/off states)
- **Smart recommendations** based on usage patterns

### 🎨 Modern UI/UX
- **Gradient dark theme** with blue and emerald accents
- **Responsive design** for all device sizes
- **Intuitive navigation** between landing page and dashboard
- **Real-time data updates** with loading states

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query
- **Routing**: React Router
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for database)

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

1. **Supabase Configuration**: The project is pre-configured with Supabase integration
2. **Database**: Uses the `appliance_metrics` table for storing energy data
3. **API Keys**: Configured through Supabase environment variables

## 🗃️ Database Schema

The application uses a single main table:

```sql
appliance_metrics
├── id (uuid, primary key)
├── house_id (integer, 1-6)
├── appliance_name (text: refrigerator, washer_dryer, microwave, dish_washer)
├── current_power_kw (real)
├── total_energy_kwh_day (real)
├── efficiency_percentage (integer)
├── potential_savings_year (integer)
├── status (text: active, standby, off)
├── longest_on_duration_hrs (real)
├── peak_energy_kwh (real)
├── time_series_data (jsonb)
└── timestamp (timestamp with time zone)
```

## 🎯 Usage

### Landing Page
- Overview of NILM technology and features
- Smart energy monitoring introduction
- Quick access to dashboard

### Dashboard Features
1. **House Selection**: Switch between different houses (1-6)
2. **Appliance Filtering**: View all appliances or filter by specific type
3. **Real-time Metrics**: Monitor current power, daily costs, efficiency, and active devices
4. **Interactive Charts**: 
   - Power consumption timeline
   - Efficiency comparison by appliance
5. **Smart Recommendations**: AI-generated suggestions for energy optimization

### Key Metrics Displayed
- **Total Power**: Current consumption across all appliances
- **Daily Cost**: Estimated cost at $0.15/kWh rate
- **Average Efficiency**: Performance score across appliances
- **Active Devices**: Count of currently running appliances

## 🔧 Configuration

### Electricity Rate
The daily cost calculation uses a default rate of $0.15/kWh. This can be modified in:
```typescript
// src/pages/Dashboard.tsx - getTotalDailyCost function
const rate = 0.15; // Adjust this value
```

### Data Refresh
- **Automatic**: Updates when house/appliance selection changes
- **Manual**: Click the "🔄 Refresh Data" button
- **Real-time**: New data appears as it's added to the database

## 🚀 Deployment

### Using Lovable (Recommended)
1. Click the **Publish** button in the Lovable editor
2. Your app will be deployed to `yourapp.lovable.app`

### Custom Domain
1. Navigate to **Project > Settings > Domains** in Lovable
2. Connect your custom domain
3. Requires a paid Lovable plan

### Self-Hosting
1. Connect your GitHub account in Lovable
2. Clone the generated repository
3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. **Fork the project** or create a new branch
2. **Make your changes** using the Lovable editor or local development
3. **Test thoroughly** across different houses and appliances
4. **Submit a pull request** with clear description of changes

## 📊 Data Integration

### Adding New Data
The application expects data in the following format:
```json
{
  "house_id": 1,
  "appliance_name": "refrigerator",
  "current_power_kw": 0.15,
  "total_energy_kwh_day": 3.6,
  "efficiency_percentage": 85,
  "potential_savings_year": 45,
  "status": "active"
}
```

### Supported Appliances
- `refrigerator`
- `washer_dryer` 
- `microwave`
- `dish_washer`

## 🎨 Customization

### Styling
- **Tailwind Classes**: Modify component styling directly
- **Color Scheme**: Adjust gradient colors in the main components
- **Chart Themes**: Customize Recharts styling in Dashboard.tsx

### Adding New Features
- **New Appliances**: Add to the appliances array in Dashboard.tsx
- **Additional Metrics**: Extend the database schema and add new calculations
- **Custom Charts**: Use Recharts components for new visualizations

## 📈 Performance

- **Optimized Queries**: Limited to 50 recent records per request
- **Efficient Rendering**: React.memo and proper key props for lists
- **Responsive Design**: Tailwind's responsive utilities for all screen sizes
- **Loading States**: Smooth transitions and loading indicators

## 🔒 Security

- **Supabase Integration**: Secure database connections
- **Environment Variables**: API keys stored securely
- **Client-side Only**: No sensitive server-side logic exposed


