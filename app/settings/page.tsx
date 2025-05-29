"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Moon, Sun, Shield, Download, Trash2, RefreshCw, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/components/theme-provider"

export default function SettingsPage() {
  const { theme, setTheme, isDark } = useTheme()
  const [passcodeEnabled, setPasscodeEnabled] = useState(false)
  const [currency, setCurrency] = useState("NGN")
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const { toast } = useToast()

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const handleProfileUpdate = () => {
    setIsEditingProfile(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready shortly",
    })
  }

  const handleResetBalance = () => {
    toast({
      title: "Balance Reset",
      description: "Your balance has been reset to ₦0",
    })
  }

  const handleClearTransactions = () => {
    toast({
      title: "Transactions Cleared",
      description: "All transaction history has been removed",
    })
  }

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Customize your app experience</p>
      </div>

      {/* Profile Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{profile.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
            </div>

            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Update your personal information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleProfileUpdate} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">App Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
            <Switch id="darkMode" checked={isDark} onCheckedChange={toggleDarkMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <Label htmlFor="currency">Currency</Label>
            </div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">₦ NGN</SelectItem>
                <SelectItem value="USD">$ USD</SelectItem>
                <SelectItem value="EUR">€ EUR</SelectItem>
                <SelectItem value="GBP">£ GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="passcode">App Passcode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure your app with a passcode</p>
            </div>
            <Switch id="passcode" checked={passcodeEnabled} onCheckedChange={setPasscodeEnabled} />
          </div>

          {passcodeEnabled && (
            <Button variant="outline" className="w-full">
              Change Passcode
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data (CSV)
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Balance
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Balance</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your current balance to ₦0. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetBalance}>Reset Balance</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Transactions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Transactions</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your transaction history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearTransactions} className="bg-red-600 hover:bg-red-700">
                  Clear All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold text-lg mb-2">Wallet Whisper</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Version 1.0.0</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Your financial companion</p>
        </CardContent>
      </Card>
    </div>
  )
}
