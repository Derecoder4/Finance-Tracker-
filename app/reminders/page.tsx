"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Bell, AlertTriangle, Calendar, Repeat, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Reminder {
  id: number
  title: string
  amount: number
  dueDate: string
  category: string
  recurring: boolean
  notificationEnabled: boolean
  isOverdue: boolean
}

const categories = ["Bills", "Debts", "School", "Transport", "Subscriptions", "Other"]

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: "Lecturer Airtime",
      amount: 2000,
      dueDate: "2024-01-19",
      category: "School",
      recurring: false,
      notificationEnabled: true,
      isOverdue: false,
    },
    {
      id: 2,
      title: "Data Subscription",
      amount: 2500,
      dueDate: "2024-01-15",
      category: "Subscriptions",
      recurring: true,
      notificationEnabled: true,
      isOverdue: true,
    },
    {
      id: 3,
      title: "Transport Money",
      amount: 3500,
      dueDate: "2024-01-20",
      category: "Transport",
      recurring: false,
      notificationEnabled: false,
      isOverdue: false,
    },
  ])

  const [isAddingReminder, setIsAddingReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    amount: "",
    dueDate: "",
    category: "",
    recurring: false,
    notificationEnabled: true,
  })

  const { toast } = useToast()

  const addReminder = () => {
    if (!newReminder.title || !newReminder.amount || !newReminder.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const reminder: Reminder = {
      id: Date.now(),
      title: newReminder.title,
      amount: Number.parseFloat(newReminder.amount),
      dueDate: newReminder.dueDate,
      category: newReminder.category || "Other",
      recurring: newReminder.recurring,
      notificationEnabled: newReminder.notificationEnabled,
      isOverdue: new Date(newReminder.dueDate) < new Date(),
    }

    setReminders([...reminders, reminder])
    setNewReminder({
      title: "",
      amount: "",
      dueDate: "",
      category: "",
      recurring: false,
      notificationEnabled: true,
    })
    setIsAddingReminder(false)

    toast({
      title: "Reminder Created",
      description: `Reminder set for ${reminder.title}`,
    })
  }

  const markAsPaid = (reminderId: number) => {
    setReminders(reminders.filter((r) => r.id !== reminderId))
    toast({
      title: "Marked as Paid",
      description: "Reminder removed from list",
    })
  }

  const toggleNotification = (reminderId: number) => {
    setReminders(
      reminders.map((r) => (r.id === reminderId ? { ...r, notificationEnabled: !r.notificationEnabled } : r)),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays === -1) return "Yesterday"
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays <= 7) return `In ${diffDays} days`

    return date.toLocaleDateString()
  }

  const overdueReminders = reminders.filter((r) => r.isOverdue)
  const upcomingReminders = reminders.filter((r) => !r.isOverdue)

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reminders</h1>
          <p className="text-sm text-gray-600">Never miss a payment</p>
        </div>

        <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
          <DialogTrigger asChild>
            <Button className="gradient-card">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Lecturer Airtime"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={newReminder.amount}
                  onChange={(e) => setNewReminder({ ...newReminder, amount: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newReminder.dueDate}
                  onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newReminder.category}
                  onValueChange={(value) => setNewReminder({ ...newReminder, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={newReminder.recurring}
                  onCheckedChange={(checked) => setNewReminder({ ...newReminder, recurring: checked })}
                />
                <Label htmlFor="recurring">Recurring reminder</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notification"
                  checked={newReminder.notificationEnabled}
                  onCheckedChange={(checked) => setNewReminder({ ...newReminder, notificationEnabled: checked })}
                />
                <Label htmlFor="notification">Enable notifications</Label>
              </div>

              <Button onClick={addReminder} className="w-full">
                Create Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">Overdue</p>
                <p className="text-lg font-semibold text-red-600">{overdueReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Upcoming</p>
                <p className="text-lg font-semibold text-blue-600">{upcomingReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Reminders */}
      {overdueReminders.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg text-red-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Overdue Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueReminders.map((reminder) => (
              <div key={reminder.id} className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{reminder.title}</h4>
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                      {reminder.recurring && (
                        <Badge variant="outline" className="text-xs">
                          <Repeat className="h-3 w-3 mr-1" />
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">₦{reminder.amount.toLocaleString()}</p>
                    <p className="text-xs text-red-600">{formatDate(reminder.dueDate)}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleNotification(reminder.id)}
                      className="h-8 w-8"
                    >
                      <Bell className={`h-4 w-4 ${reminder.notificationEnabled ? "text-blue-600" : "text-gray-400"}`} />
                    </Button>
                    <Button size="sm" onClick={() => markAsPaid(reminder.id)} className="text-xs">
                      Mark Paid
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reminders */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Upcoming</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">{reminder.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {reminder.category}
                  </Badge>
                  {reminder.recurring && (
                    <Badge variant="outline" className="text-xs">
                      <Repeat className="h-3 w-3 mr-1" />
                      Recurring
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">₦{reminder.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{formatDate(reminder.dueDate)}</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => toggleNotification(reminder.id)} className="h-8 w-8">
                  <Bell className={`h-4 w-4 ${reminder.notificationEnabled ? "text-blue-600" : "text-gray-400"}`} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => markAsPaid(reminder.id)} className="text-xs">
                  Mark Paid
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {reminders.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reminders set</p>
            <p className="text-sm text-gray-400 mt-1">Create your first reminder to stay on track!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
