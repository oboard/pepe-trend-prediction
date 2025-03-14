"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react"

const comparisonData = [
  {
    name: "24h Change",
    PEPE: 4.2,
    DOGE: 1.8,
    SHIB: 2.5,
    FLOKI: 3.7,
  },
  {
    name: "7d Change",
    PEPE: 15.3,
    DOGE: 7.2,
    SHIB: 9.8,
    FLOKI: 12.5,
  },
  {
    name: "30d Change",
    PEPE: 42.7,
    DOGE: 18.5,
    SHIB: 24.3,
    FLOKI: 35.8,
  },
  {
    name: "Volume/MC",
    PEPE: 0.28,
    DOGE: 0.12,
    SHIB: 0.15,
    FLOKI: 0.22,
  },
]

const marketData = [
  {
    coin: "PEPE",
    price: "$0.0000105",
    marketCap: "$420M",
    volume: "$118M",
    change: "+4.2%",
    positive: true,
  },
  {
    coin: "DOGE",
    price: "$0.1235",
    marketCap: "$16.8B",
    volume: "$2.02B",
    change: "+1.8%",
    positive: true,
  },
  {
    coin: "SHIB",
    price: "$0.00002235",
    marketCap: "$13.2B",
    volume: "$1.98B",
    change: "+2.5%",
    positive: true,
  },
  {
    coin: "FLOKI",
    price: "$0.0001523",
    marketCap: "$1.42B",
    volume: "$312M",
    change: "+3.7%",
    positive: true,
  },
]

export default function CoinComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Meme Coin Comparison
        </CardTitle>
        <CardDescription>Compare PEPE performance against other popular meme coins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Coin</th>
                  <th className="text-right py-2 font-medium">Price</th>
                  <th className="text-right py-2 font-medium">Market Cap</th>
                  <th className="text-right py-2 font-medium">Volume (24h)</th>
                  <th className="text-right py-2 font-medium">Change (24h)</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((item) => (
                  <tr key={item.coin} className="border-b last:border-0">
                    <td className="py-3 font-medium">{item.coin}</td>
                    <td className="text-right py-3">{item.price}</td>
                    <td className="text-right py-3">{item.marketCap}</td>
                    <td className="text-right py-3">{item.volume}</td>
                    <td className="text-right py-3 flex items-center justify-end gap-1">
                      {item.change}
                      {item.positive ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <ChartContainer
            config={{
              PEPE: {
                label: "PEPE",
                color: "hsl(var(--chart-1))",
              },
              DOGE: {
                label: "DOGE",
                color: "hsl(var(--chart-2))",
              },
              SHIB: {
                label: "SHIB",
                color: "hsl(var(--chart-3))",
              },
              FLOKI: {
                label: "FLOKI",
                color: "hsl(var(--chart-4))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="PEPE" fill="var(--color-PEPE)" />
                <Bar dataKey="DOGE" fill="var(--color-DOGE)" />
                <Bar dataKey="SHIB" fill="var(--color-SHIB)" />
                <Bar dataKey="FLOKI" fill="var(--color-FLOKI)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

