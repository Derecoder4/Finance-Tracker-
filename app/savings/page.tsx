"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Target, Lock, Unlock, PiggyBank, Edit3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SavingsGoal {
  id: number
  title: string
  target: number
  current: number
  notes: string
  locked: boolean
  piggyMode: boolean
}

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: 1,
      title: "Power Bank",
      target: 12000,
      current: 8500,
      notes: "For school and emergencies",
      locked: false,
      piggyMode: false,
    },
    {
      id: 2,
      title: "School Feeding",
      target: 30000,
      current: 15000,
      notes: "Next semester meal plan",
      locked: true,
      piggyMode: false,
    },
    {
      id: 3,
      title: "Emergency Fund",
      target: 50000,
      current: 12000,
      notes: "For unexpected expenses",
      locked: true,
      piggyMode: true,
    },
  ])

  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    notes: "",
    locked: false,
    piggyMode: false,
  })

  const { toast } = useToast()

  const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0)

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) {
      toast({
        title: "Error",
        description: "Please fill in title and target amount",
        variant: "destructive",
      })
      return
    }

    const goal: SavingsGoal = {
      id: Date.now(),
      title: newGoal.title,
      target: Number.parseFloat(newGoal.target),
      current: 0,
      notes: newGoal.notes,
      locked: newGoal.locked,
      piggyMode: newGoal.piggyMode,
    }

    setGoals([...goals, goal])
    setNewGoal({ title: "", target: "", notes: "", locked: false, piggyMode: false })
    setIsAddingGoal(false)

    toast({
      title: "Goal Created",
      description: `New savings goal: ${goal.title}`,
    })
  }

  const addToGoal = (goalId: number, amount: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal,
      ),
    )

    toast({
      title: "Savings Added",
      description: `₦${amount.toLocaleString()} added to savings`,
    })
  }

  const toggleLock = (goalId: number) => {
    setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, locked: !goal.locked } : goal)))
  }

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Savings</h1>
          <p className="text-sm text-gray-600">Track your financial goals</p>
        </div>

        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button className="gradient-card">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., New Laptop"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="target">Target Amount (₦)</Label>
                <Input
                  id="target"
                  type="number"
                  placeholder="0"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Why are you saving for this?"
                  value={newGoal.notes}
                  onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="locked"
                  checked={newGoal.locked}
                  onCheckedChange={(checked) => setNewGoal({ ...newGoal, locked: checked })}
                />
                <Label htmlFor="locked">Lock savings (prevent withdrawal)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="piggyMode"
                  checked={newGoal.piggyMode}
                  onCheckedChange={(checked) => setNewGoal({ ...newGoal, piggyMode: checked })}
                />
                <Label htmlFor="piggyMode">Piggy Mode (hide balance until target)</Label>
              </div>

              <Button onClick={addGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Savings */}
      <Card className="gradient-card text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <PiggyBank className="h-6 w-6" />
              <p className="text-blue-100 text-sm">Total Savings</p>
            </div>
            <p className="text-3xl font-bold">₦{totalSavings.toLocaleString()}</p>
            <p className="text-blue-100 text-sm mt-1">{goals.length} active goals</p>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const isCompleted = goal.current >= goal.target

          return (
            <Card key={goal.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{goal.title}</h3>
                      {goal.locked && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                      {goal.piggyMode && (
                        <Badge variant="outline" className="text-xs">
                          <PiggyBank className="h-3 w-3 mr-1" />
                          Piggy
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          <Target className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{goal.notes}</p>
                  </div>

                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleLock(goal.id)} className="h-8 w-8">
                      {goal.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {goal.piggyMode && !isCompleted
                        ? "Hidden until target reached"
                        : `₦${goal.current.toLocaleString()}`}
                    </span>
                    <span className="text-gray-600">₦{goal.target.toLocaleString()}</span>
                  </div>

                  <Progress value={goal.piggyMode && !isCompleted ? 0 : progress} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {goal.piggyMode && !isCompleted ? "Progress hidden" : `${Math.round(progress)}% complete`}
                    </span>

                    {!isCompleted && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToGoal(goal.id, 1000)}
                          className="text-xs px-2 py-1 h-6"
                        >
                          +₦1k
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToGoal(goal.id, 5000)}
                          className="text-xs px-2 py-1 h-6"
                        >
                          +₦5k
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {goals.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No savings goals yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first goal to start saving!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
