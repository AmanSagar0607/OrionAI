"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart as LucideLineChart, BarChart as LucideBarChart, PieChart as LucidePieChart, Users, TrendingUp, Smartphone, Activity, Zap, Shield, Headset, Database, TrendingDown } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBar, RadialBarChart } from 'recharts'
import { ChartRadialLabel } from "@/components/ui/device-radial-chart"
import { TopProductsChart } from "@/components/ui/top-products-chart"

export const iframeHeight = "800px"
export const description = "Dashboard overview with analytics and metrics"

// Sample data for charts
const lineChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
]

const barChartData = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 500 },
  { name: 'Product D', value: 200 },
  { name: 'Product E', value: 600 },
]

const pieChartData = [
  { 
    name: 'Desktop', 
    value: 400, 
    colorLight: 'hsl(221.2 83.2% 53.3%)',  // Primary color
    colorDark: 'hsl(217.2 91.2% 59.8%)'    // Lighter primary for dark mode
  },
  { 
    name: 'Mobile', 
    value: 300, 
    colorLight: 'hsl(142.1 76.2% 36.3%)',  // Success color
    colorDark: 'hsl(142.1 70.6% 45.3%)'    // Lighter success for dark mode
  },
  { 
    name: 'Tablet', 
    value: 200, 
    colorLight: 'hsl(38 92% 50%)',         // Warning color
    colorDark: 'hsl(43.3 96.4% 56.3%)'     // Lighter warning for dark mode
  },
]

const stats = [
  { 
    name: 'Total Users', 
    value: '12,234', 
    change: '+12%', 
    changeType: 'positive',
    icon: <Users className="h-4 w-4" />,
    description: 'vs last month'
  },
  { 
    name: 'Revenue', 
    value: '₹28,45,000', 
    change: '+8.2%', 
    changeType: 'positive',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'vs last month'
  },
  { 
    name: 'Conversion', 
    value: '3.2%', 
    change: '-0.5%', 
    changeType: 'negative',
    icon: <Activity className="h-4 w-4" />,
    description: 'vs last month'
  },
  { 
    name: 'Active Now', 
    value: '1,234', 
    change: '+23%', 
    changeType: 'positive',
    icon: <Zap className="h-4 w-4" />,
    description: 'vs last month'
  },
]

const features = [
  {
    icon: <Activity className="h-6 w-6 text-blue-500" />,
    title: "AI-Powered Analytics",
    description: "Advanced analytics powered by AI to help you make data-driven decisions."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-green-500" />,
    title: "Real-time Insights",
    description: "Get real-time updates and insights into your business performance."
  },
  {
    icon: <Database className="h-6 w-6 text-purple-500" />,
    title: "Custom Dashboards",
    description: "Create and customize dashboards to track what matters most to your business."
  },
  {
    icon: <Shield className="h-6 w-6 text-red-500" />,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security and privacy controls."
  },
  {
    icon: <Headset className="h-6 w-6 text-yellow-500" />,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you."
  },
  {
    icon: <Zap className="h-6 w-6 text-orange-500" />,
    title: "Easy Integration",
    description: "Seamlessly integrate with your existing tools and workflows."
  }
]

export default function Page() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-h-[calc(100vh-var(--header-height))] overflow-auto">
            <SidebarInset className="flex-1 p-4 md:p-6">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {stats.map((stat) => (
                  <Card key={stat.name} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.name}
                      </CardTitle>
                      <div className={`p-1.5 rounded-full ${stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {stat.changeType === 'positive' ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        {stat.icon}
                        <span>{stat.description}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <Card className="col-span-4 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly performance</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={lineChartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.7 0.222 41.116)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="oklch(0.9 0.222 41.116)" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          width={30}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="oklch(0.7 0.222 41.116)" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="col-span-3 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-0">
                    <ChartRadialLabel />
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* <Card className="col-span-1 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Products</CardTitle>
                    <CardDescription>Best performing items</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                   
                  </CardContent>
                </Card> */}
                 <TopProductsChart />

                <Card className="col-span-1 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest user actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">User {i} completed onboarding</p>
                          <p className="text-xs text-muted-foreground">{i * 5} minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="col-span-1 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['Generate Report', 'Add New User', 'Update Inventory', 'View Analytics'].map((action, index) => (
                      <button
                        key={action}
                        className="w-full flex items-center space-x-2 text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span>{action}</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Powerful Features Section */}
              <div className="mt-12 mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Powerful Features</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
                        <div className="p-2 rounded-lg bg-muted/50">
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </SidebarInset>
            <Footer className="border-t mt-auto" />
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
