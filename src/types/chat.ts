
export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  timestamp: string;
  isUser: boolean;
}

export interface ApplianceData {
  id: string;
  house_id: number;
  appliance_name: string;
  current_power_kw: number;
  total_energy_kwh_day: number;
  peak_energy_kwh: number;
  longest_on_duration_hrs: number;
  efficiency_percentage: number;
  potential_savings_year: number;
  status: string;
  timestamp: string;
}

export interface ChatbotProps {
  applianceData?: ApplianceData[];
  selectedHouse?: string;
  selectedAppliance?: string;
}
