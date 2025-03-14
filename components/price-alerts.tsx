"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Bell, Plus, Trash2 } from "lucide-react"

interface Alert {
  id: string
  price: string
  direction: "above" | "below"
  active: boolean
}

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "1", price: "0.000012", direction: "above", active: true },
    { id: "2", price: "0.000009", direction: "below", active: true },
  ])
  const [newPrice, setNewPrice] = useState("")
  const [newDirection, setNewDirection] = useState<"above" | "below">("above")

  const addAlert = () => {
    if (!newPrice) return

    const newAlert: Alert = {
      id: Date.now().toString(),
      price: newPrice,
      direction: newDirection,
      active: true,
    }

    setAlerts([...alerts, newAlert])
    setNewPrice("")
  }

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, active: !alert.active } : alert)))
  }

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Price Alerts
        </CardTitle>
        <CardDescription>Get notified when PEPE reaches your target prices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">
                  {alert.direction === "above" ? "Above" : "Below"} ${alert.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  Alert when price goes {alert.direction} ${alert.price}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={alert.active} onCheckedChange={() => toggleAlert(alert.id)} />
                <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <div className="text-sm font-medium mb-2">Add New Alert</div>
            <div className="flex gap-2">
              <select
                value={newDirection}
                onChange={(e) => setNewDirection(e.target.value as "above" | "below")}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              <Input
                type="text"
                placeholder="0.000015"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <Button onClick={addAlert}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Alerts will be displayed in the browser and can be sent via email if configured
      </CardFooter>
    </Card>
  )
}

