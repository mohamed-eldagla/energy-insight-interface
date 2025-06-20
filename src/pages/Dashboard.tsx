import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap, TrendingUp, TrendingDown, Home, Clock, DollarSign, LogOut, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import Chatbot from '@/components/Chatbot';

interface ApplianceData {
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
  time_series_data: any;
  timestamp: string;
}

const Dashboard = () => {
  const [applianceData, setApplianceData] = useState<ApplianceData[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string>('1');
  const [selectedAppliance, setSelectedAppliance] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const { user, signOut } = useAuth();

  const appliances = ['refrigerator', 'washer_dryer', 'microwave', 'dish_washer'];
  const houses = ['1', '2', '3', '4', '5', '6'];

  useEffect(() => {
    fetchApplianceData();
  }, [selectedHouse, selectedAppliance]);

  const fetchApplianceData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appliance_metrics')
        .select('*')
        .eq('house_id', parseInt(selectedHouse))
        .order('timestamp', { ascending: false });

      if (selectedAppliance !== 'all') {
        query = query.eq('appliance_name', selectedAppliance);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setApplianceData(data || []);
        generateRecommendations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (data: ApplianceData[]) => {
    const recs: string[] = [];
    
    data.forEach(appliance => {
      if (appliance.efficiency_percentage < 70) {
        recs.push(`${appliance.appliance_name}: Low efficiency detected (${appliance.efficiency_percentage}%). Consider maintenance or replacement.`);
      }
      if (appliance.longest_on_duration_hrs > 12) {
        recs.push(`${appliance.appliance_name}: Running continuously for ${appliance.longest_on_duration_hrs.toFixed(1)} hours. Check for optimal usage patterns.`);
      }
      if (appliance.potential_savings_year > 100) {
        recs.push(`${appliance.appliance_name}: Potential annual savings of $${appliance.potential_savings_year}. Optimize usage during off-peak hours.`);
      }
    });

    setRecommendations(recs.slice(0, 5));
  };

  const getTotalConsumption = () => {
    return applianceData.reduce((sum, item) => sum + (item.current_power_kw || 0), 0);
  };

  const getTotalDailyCost = () => {
    const rate = 0.15; // $0.15 per kWh
    return applianceData.reduce((sum, item) => sum + (item.total_energy_kwh_day || 0) * rate, 0);
  };

  const getAverageEfficiency = () => {
    if (applianceData.length === 0) return 0;
    return applianceData.reduce((sum, item) => sum + (item.efficiency_percentage || 0), 0) / applianceData.length;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'off': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const chartData = applianceData.map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    power: item.current_power_kw,
    appliance: item.appliance_name,
  })).slice(0, 20).reverse();

  const efficiencyData = appliances.map(appliance => {
    const appData = applianceData.find(item => item.appliance_name === appliance);
    return {
      name: appliance.replace('_', ' '),
      efficiency: appData?.efficiency_percentage || 0,
      savings: appData?.potential_savings_year || 0,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              ⚡ NILM Energy Dashboard
            </h1>
            <p className="text-slate-300 text-lg">Non-Intrusive Load Monitoring & Optimization</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <Select value={selectedHouse} onValueChange={setSelectedHouse}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {houses.map(house => (
                  <SelectItem key={house} value={house}>House {house}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <Select value={selectedAppliance} onValueChange={setSelectedAppliance}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appliances</SelectItem>
                {appliances.map(appliance => (
                  <SelectItem key={appliance} value={appliance}>
                    {appliance.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={fetchApplianceData} className="bg-blue-600 hover:bg-blue-700">
            🔄 Refresh Data
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Power</CardTitle>
                  <Zap className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{getTotalConsumption().toFixed(2)} kW</div>
                  <p className="text-xs text-slate-400">Current consumption</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Daily Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${getTotalDailyCost().toFixed(2)}</div>
                  <p className="text-xs text-slate-400">Estimated today</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Efficiency</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{getAverageEfficiency().toFixed(0)}%</div>
                  <p className="text-xs text-slate-400">Average efficiency</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Active Devices</CardTitle>
                  <Home className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {applianceData.filter(item => item.status === 'active').length}
                  </div>
                  <p className="text-xs text-slate-400">Currently running</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Power Consumption Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Efficiency by Appliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="efficiency" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Appliance Status */}
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Appliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applianceData.map((appliance) => (
                    <div key={appliance.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white capitalize">
                          {appliance.appliance_name.replace('_', ' ')}
                        </h3>
                        <Badge className={`${getStatusColor(appliance.status)} text-white`}>
                          {appliance.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-slate-300">
                        <div>Power: {appliance.current_power_kw?.toFixed(2)} kW</div>
                        <div>Daily: {appliance.total_energy_kwh_day?.toFixed(2)} kWh</div>
                        <div>Efficiency: {appliance.efficiency_percentage}%</div>
                        <div>Runtime: {appliance.longest_on_duration_hrs?.toFixed(1)}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Smart Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                        <p className="text-slate-200">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
      
      {/* Chatbot with dashboard data */}
      <Chatbot 
        applianceData={applianceData}
        selectedHouse={selectedHouse}
        selectedAppliance={selectedAppliance}
      />
    </div>
  );
};

export default Dashboard;
