"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Copy, ExternalLink } from "lucide-react"

export default function WalletIntegration() {
  const [connected, setConnected] = useState(false)

  const connectWallet = () => {
    // In a real app, this would connect to MetaMask or another wallet
    setConnected(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Integration
        </CardTitle>
        <CardDescription>Connect your wallet to track your PEPE holdings</CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Wallet className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-medium mb-1">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your wallet to track your PEPE holdings and enable trading
              </p>
              <Button onClick={connectWallet} className="gap-2">
                <Plus className="h-4 w-4" /> Connect Wallet
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-muted-foreground">Connected Wallet</div>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Copy className="h-3 w-3" /> 0x1a2...3b4c
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">1,250,000 PEPE</div>
                  <div className="text-sm text-muted-foreground">≈ $13.12 USD</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <ArrowUpRight className="h-4 w-4" /> Send
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <ArrowDownRight className="h-4 w-4" /> Receive
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Recent Transactions</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">Received</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">+500,000 PEPE</div>
                    <div className="text-xs text-muted-foreground">From: 0x4d2...8e9f</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-sm font-medium">Sent</div>
                      <div className="text-xs text-muted-foreground">5 days ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">-250,000 PEPE</div>
                    <div className="text-xs text-muted-foreground">To: 0x7g6...5h4j</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">Received</div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">+1,000,000 PEPE</div>
                    <div className="text-xs text-muted-foreground">From: 0x9k8...7l6m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>Powered by Web3 Integration</span>
        <Button variant="link" size="sm" className="h-auto p-0 gap-1">
          View on Etherscan <ExternalLink className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}

