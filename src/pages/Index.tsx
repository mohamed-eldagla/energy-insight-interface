
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Home, BarChart3, Settings, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">NILM Dashboard</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/auth">
                <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Smart Energy
            </span>
            <br />
            <span className="text-white">Monitoring System</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Advanced Non-Intrusive Load Monitoring (NILM) technology that analyzes your home's energy consumption 
            patterns and provides intelligent recommendations to optimize efficiency and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                <BarChart3 className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg"
              onClick={() => document.getElementById('project-info')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Settings className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Powerful Energy Intelligence Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-600 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Real-time Monitoring</CardTitle>
                <CardDescription className="text-slate-400">
                  Track energy consumption of individual appliances in real-time without installing additional sensors.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-600 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Appliance Detection</CardTitle>
                <CardDescription className="text-slate-400">
                  Automatically identify and classify different household appliances using advanced machine learning algorithms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-600 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Usage Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  Comprehensive analytics dashboard with detailed insights into consumption patterns and trends.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-600 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Smart Recommendations</CardTitle>
                <CardDescription className="text-slate-400">
                  AI-powered recommendations to optimize energy usage and reduce electricity bills.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-red-600 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Anomaly Detection</CardTitle>
                <CardDescription className="text-slate-400">
                  Detect unusual energy consumption patterns that may indicate equipment malfunctions or inefficiencies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-yellow-600 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Easy Setup</CardTitle>
                <CardDescription className="text-slate-400">
                  Quick and simple installation process with minimal configuration required to start monitoring.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Information Section */}
      <section id="project-info" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/52b51bd3-4a35-4c6e-8736-8297b8003642.png" 
              alt="E-JUST Logo" 
              className="h-20 mx-auto mb-8"
            />
            <h2 className="text-3xl font-bold text-white mb-6">About This Project</h2>
            <div className="max-w-4xl mx-auto text-left bg-slate-800/50 rounded-lg p-8 border border-slate-700">
              <p className="text-slate-300 mb-6">
                This is a part of the graduation project titled <span className="text-blue-400 font-semibold">"IoT-Based System Architecture for Real-Time Power Quality Monitoring and Data Analysis"</span> for the faculty of Computer Science and Information Technology.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Academic Details</h3>
                  <p className="text-slate-300 mb-2"><strong>Major:</strong> AI and Data Science</p>
                  <p className="text-slate-300 mb-2"><strong>Class:</strong> 2025</p>
                  <p className="text-slate-300"><strong>Supervised by:</strong> Prof. Tamer Megahed</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Student Team</h3>
                  <ul className="text-slate-300 space-y-1">
                    <li>• Mohamed Eldagla</li>
                    <li>• Kenzy Mohamed</li>
                    <li>• Hazem Mohamed</li>
                    <li>• Seif Diaa</li>
                    <li>• Hagar Ali</li>
                    <li>• Mohamed Mostafa</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-slate-300">Accuracy in appliance detection</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">30%</div>
              <div className="text-slate-300">Average energy savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-slate-300">Continuous monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">NILM Dashboard</span>
          </div>
          <p className="text-slate-400">
            Intelligent energy monitoring for a sustainable future
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
