"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Repeat, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: number
  amount: number
  category: string
  note: string
  date: string
  recurring: boolean
  isRepayment: boolean
}

const categories = ["Transport", "Food", "Airtime", "Data", "School", "Gifts", "Debts", "Misc"]

const categoryColors: Record<string, string> = {
  Transport: "bg-blue-100 text-blue-800",
  Food: "bg-green-100 text-green-800",
  Airtime: "bg-purple-100 text-purple-800",
  Data: "bg-indigo-100 text-indigo-800",
  School: "bg-yellow-100 text-yellow-800",
  Gifts: "bg-pink-100 text-pink-800",
  Debts: "bg-red-100 text-red-800",
  Misc: "bg-gray-100 text-gray-800",
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      amount: 1500,
      category: "Transport",
      note: "Bus fare to school",
      date: "2024-01-15",
      recurring: false,
      isRepayment: false,
    },
    {
      id: 2,
      amount: 2000,
      category: "Data",
      note: "Monthly data bundle",
      date: "2024-01-14",
      recurring: true,
      isRepayment: false,
    },
    {
      id: 3,
      amount: 5000,
      category: "Debts",
      note: "Partial payment to John",
      date: "2024-01-13",
      recurring: false,
      isRepayment: true,
    },
    { id: 4, amount: 800, category: "Food", note: "Lunch", date: "2024-01-13", recurring: false, isRepayment: false },
  ])

  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "",
    note: "",
    recurring: false,
    isRepayment: false,
  })

  const { toast } = useToast()

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) {
      toast({
        title: "Error",
        description: "Please fill in amount and category",
        variant: "destructive",
      })
      return
    }

    const transaction: Transaction = {
      id: Date.now(),
      amount: Number.parseFloat(newTransaction.amount),
      category: newTransaction.category,
      note: newTransaction.note,
      date: new Date().toISOString().split("T")[0],
      recurring: newTransaction.recurring,
      isRepayment: newTransaction.isRepayment,
    }

    setTransactions([transaction, ...transactions])
    setNewTransaction({ amount: "", category: "", note: "", recurring: false, isRepayment: false })
    setIsAddingTransaction(false)

    toast({
      title: "Transaction Added",
      description: `₦${transaction.amount.toLocaleString()} for ${transaction.category}`,
    })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-600">Track every expense</p>
        </div>

        <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
          <DialogTrigger asChild>
            <Button className="gradient-card">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
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

              <div>
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="What was this for?"
                  value={newTransaction.note}
                  onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={newTransaction.recurring}
                  onCheckedChange={(checked) => setNewTransaction({ ...newTransaction, recurring: checked })}
                />
                <Label htmlFor="recurring">Recurring transaction</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="repayment"
                  checked={newTransaction.isRepayment}
                  onCheckedChange={(checked) => setNewTransaction({ ...newTransaction, isRepayment: checked })}
                />
                <Label htmlFor="repayment">This is a repayment</Label>
              </div>

              <Button onClick={addTransaction} className="w-full">
                Add Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={categoryColors[transaction.category]}>{transaction.category}</Badge>
                    {transaction.recurring && (
                      <Badge variant="outline" className="text-xs">
                        <Repeat className="h-3 w-3 mr-1" />
                        Recurring
                      </Badge>
                    )}
                    {transaction.isRepayment && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Repayment
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{transaction.note || "No note"}</p>
                  <p className="text-xs text-gray-400">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">₦{transaction.amount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
