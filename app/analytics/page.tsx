"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react"
import { useState } from "react"

const categoryData = [
  { name: "Food", value: 8500, color: "#10B981" },
  { name: "Transport", value: 6200, color: "#3B82F6" },
  { name: "Data", value: 4000, color: "#6366F1" },
  { name: "School", value: 3500, color: "#F59E0B" },
  { name: "Debts", value: 5000, color: "#EF4444" },
  { name: "Misc", value: 2800, color: "#6B7280" },
]

const weeklyData = [
  { day: "Mon", amount: 2100 },
  { day: "Tue", amount: 1800 },
  { day: "Wed", amount: 3200 },
  { day: "Thu", amount: 1500 },
  { day: "Fri", amount: 2800 },
  { day: "Sat", amount: 4100 },
  { day: "Sun", amount: 1200 },
]

const insights = [
  {
    type: "warning",
    icon: AlertCircle,
    title: "Transport Overspend",
    description: "You overspent on transport this week by ₦1,200",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    type: "success",
    icon: TrendingUp,
    title: "Great Savings!",
    description: "You've saved ₦7,000 this month — 23% of income",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    type: "tip",
    icon: Lightbulb,
    title: "Smart Tip",
    description: "Try reducing food spend by 10% next week",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly")

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-600">Understand your spending</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={timeframe === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={timeframe === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </Button>
        </div>
      </div>

      {/* Total Spending */}
      <Card className="gradient-card text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-blue-100 text-sm">Total {timeframe === "weekly" ? "Weekly" : "Monthly"} Spending</p>
            <p className="text-3xl font-bold">₦{totalSpent.toLocaleString()}</p>
            <div className="flex items-center justify-center mt-2 space-x-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm">12% less than last {timeframe === "weekly" ? "week" : "month"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Amount",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-xs text-gray-600">{category.name}</span>
                <span className="text-xs font-medium">₦{category.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Trend */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Daily Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              amount: {
                label: "Amount",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="amount" stroke="#377DFF" strokeWidth={2} dot={{ fill: "#377DFF" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Smart Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg ${insight.bgColor}`}>
              <div className="flex items-start space-x-3">
                <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div>
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
