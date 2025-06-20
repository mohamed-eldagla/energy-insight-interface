
import { ApplianceData } from '@/types/chat';

export const generateDashboardContext = (
  applianceData: ApplianceData[],
  selectedHouse: string
): string => {
  if (!applianceData.length) return '';
  
  const totalPower = applianceData.reduce((sum, item) => sum + (item.current_power_kw || 0), 0);
  const avgEfficiency = applianceData.reduce((sum, item) => sum + (item.efficiency_percentage || 0), 0) / applianceData.length;
  const activeDevices = applianceData.filter(item => item.status === 'active').length;
  const totalSavings = applianceData.reduce((sum, item) => sum + (item.potential_savings_year || 0), 0);

  return `Current dashboard context for House ${selectedHouse}:
- Total Power Consumption: ${totalPower.toFixed(2)} kW
- Average Efficiency: ${avgEfficiency.toFixed(0)}%
- Active Devices: ${activeDevices}
- Total Potential Annual Savings: $${totalSavings}
- Appliances data: ${JSON.stringify(applianceData.map(item => ({
  name: item.appliance_name,
  power: item.current_power_kw,
  efficiency: item.efficiency_percentage,
  status: item.status,
  dailyEnergy: item.total_energy_kwh_day,
  potentialSavings: item.potential_savings_year
})))}`;
};
