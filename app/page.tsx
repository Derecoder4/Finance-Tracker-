"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit3, Check, Star, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [balance, setBalance] = useState(45000)
  const [isEditingBalance, setIsEditingBalance] = useState(false)
  const [tempBalance, setTempBalance] = useState(balance.toString())
  const [priorities, setPriorities] = useState([
    { id: 1, text: "Pay debt ₦8,000", urgent: true, done: false },
    { id: 2, text: "School feeding ₦15,000", important: true, done: false },
    { id: 3, text: "Transport this week ₦3,500", important: false, done: true },
    { id: 4, text: "Data subscription ₦2,000", urgent: false, done: false },
  ])

  const { toast } = useToast()
  const todaySpend = 2100
  const weekSpend = 12500
  const weeklyBudget = 15000

  const handleBalanceEdit = () => {
    if (isEditingBalance) {
      const newBalance = Number.parseFloat(tempBalance) || 0
      setBalance(newBalance)
      toast({
        title: "Balance Updated",
        description: `New balance: ₦${newBalance.toLocaleString()}`,
      })
    }
    setIsEditingBalance(!isEditingBalance)
  }

  const togglePriority = (id: number) => {
    setPriorities(priorities.map((p) => (p.id === id ? { ...p, done: !p.done } : p)))
  }

  const getMotivationalMessage = () => {
    const remaining = weeklyBudget - weekSpend
    if (remaining > 0) {
      return `You're ₦${remaining.toLocaleString()} under budget this week 👏`
    } else {
      return `₦${Math.abs(remaining).toLocaleString()} over budget - let's get back on track! 💪`
    }
  }

  return (
    <TooltipProvider>
      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Wallet Whisper</h1>
            <p className="text-sm text-gray-600">Your financial companion</p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="gradient-card text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Balance</p>
                {isEditingBalance ? (
                  <Input
                    value={tempBalance}
                    onChange={(e) => setTempBalance(e.target.value)}
                    className="text-2xl font-bold bg-white/20 border-white/30 text-white placeholder:text-blue-100"
                    placeholder="Enter amount"
                    type="number"
                  />
                ) : (
                  <p className="text-3xl font-bold">₦{balance.toLocaleString()}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleBalanceEdit} className="text-white hover:bg-white/20">
                {isEditingBalance ? <Check className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Spending Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Today's Spend</p>
                  <p className="text-lg font-semibold">₦{todaySpend.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">This Week</p>
                  <p className="text-lg font-semibold">₦{weekSpend.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-center font-medium text-gray-700">{getMotivationalMessage()}</p>
          </CardContent>
        </Card>

        {/* Priority Expenses */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Priority Expenses</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorities.map((priority) => (
              <div key={priority.id} className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePriority(priority.id)}
                  className={`p-1 ${priority.done ? "text-green-600" : "text-gray-400"}`}
                >
                  <Check className="h-4 w-4" />
                </Button>

                <div className="flex-1 flex items-center space-x-2">
                  <span className={`text-sm ${priority.done ? "line-through text-gray-500" : ""}`}>
                    {priority.text}
                  </span>

                  {priority.urgent && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="destructive" className="text-xs">
                          !
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Urgent - overdue or high impact</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {priority.important && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="text-xs">
                          *
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Important priority - consider handling this soon</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
