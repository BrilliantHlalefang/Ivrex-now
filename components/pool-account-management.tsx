import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, BarChart3, DollarSign, PieChart, Plus, Users } from "lucide-react"

export default function PoolAccountManagement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pool Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,248,590.45</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.5%
              </span>
              <span className="text-xs text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12
              </span>
              <span className="text-xs text-muted-foreground ml-2">new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8.2%</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +1.3%
              </span>
              <span className="text-xs text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Pools</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Forex Alpha Pool",
                id: "POOL-FX-001",
                value: "$548,320.75",
                investors: 124,
                monthlyReturn: "+5.8%",
                yearToDate: "+18.2%",
                allocation: { forex: 70, indices: 20, commodities: 10 },
              },
              {
                name: "Crypto Growth Pool",
                id: "POOL-CR-002",
                value: "$325,450.20",
                investors: 86,
                monthlyReturn: "+12.5%",
                yearToDate: "+42.8%",
                allocation: { bitcoin: 40, ethereum: 30, altcoins: 30 },
              },
              {
                name: "Balanced Portfolio Pool",
                id: "POOL-BP-003",
                value: "$245,780.50",
                investors: 58,
                monthlyReturn: "+3.2%",
                yearToDate: "+14.5%",
                allocation: { forex: 30, stocks: 30, crypto: 20, commodities: 20 },
              },
              {
                name: "Conservative Income Pool",
                id: "POOL-CI-004",
                value: "$129,039.00",
                investors: 42,
                monthlyReturn: "+1.8%",
                yearToDate: "+8.4%",
                allocation: { bonds: 50, forex: 30, commodities: 20 },
              },
            ].map((pool, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pool.name}</CardTitle>
                      <CardDescription>{pool.id}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Pool Value</p>
                      <p className="text-lg font-bold">{pool.value}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Investors</p>
                      <p className="text-lg font-bold">{pool.investors}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Return</p>
                      <p className="text-lg font-bold text-green-500">{pool.monthlyReturn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">YTD Return</p>
                      <p className="text-lg font-bold text-green-500">{pool.yearToDate}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Asset Allocation</p>
                    {Object.entries(pool.allocation).map(([asset, percentage], i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{asset}</span>
                          <span>{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create New Pool</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Set up a new investment pool with custom parameters and allocation strategy.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Pool
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pool Performance</CardTitle>
              <CardDescription>Track the performance of all your investment pools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-6">
                <p className="text-muted-foreground">Performance Chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">Pool Name</th>
                      <th className="text-right font-medium p-2">1M Return</th>
                      <th className="text-right font-medium p-2">3M Return</th>
                      <th className="text-right font-medium p-2">6M Return</th>
                      <th className="text-right font-medium p-2">YTD Return</th>
                      <th className="text-right font-medium p-2">1Y Return</th>
                      <th className="text-right font-medium p-2">Since Inception</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Forex Alpha Pool",
                        m1: "+5.8%",
                        m3: "+12.4%",
                        m6: "+18.7%",
                        ytd: "+18.2%",
                        y1: "+24.5%",
                        inception: "+42.8%",
                      },
                      {
                        name: "Crypto Growth Pool",
                        m1: "+12.5%",
                        m3: "+28.4%",
                        m6: "+35.2%",
                        ytd: "+42.8%",
                        y1: "+68.5%",
                        inception: "+112.4%",
                      },
                      {
                        name: "Balanced Portfolio Pool",
                        m1: "+3.2%",
                        m3: "+8.5%",
                        m6: "+12.8%",
                        ytd: "+14.5%",
                        y1: "+18.2%",
                        inception: "+32.5%",
                      },
                      {
                        name: "Conservative Income Pool",
                        m1: "+1.8%",
                        m3: "+4.2%",
                        m6: "+6.5%",
                        ytd: "+8.4%",
                        y1: "+10.2%",
                        inception: "+15.8%",
                      },
                    ].map((pool, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{pool.name}</td>
                        <td className="p-2 text-right text-green-500">{pool.m1}</td>
                        <td className="p-2 text-right text-green-500">{pool.m3}</td>
                        <td className="p-2 text-right text-green-500">{pool.m6}</td>
                        <td className="p-2 text-right text-green-500">{pool.ytd}</td>
                        <td className="p-2 text-right text-green-500">{pool.y1}</td>
                        <td className="p-2 text-right text-green-500">{pool.inception}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">
                  <PieChart className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investors" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Pool Investors</CardTitle>
                  <CardDescription>Manage investors across all your pools</CardDescription>
                </div>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Add Investor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">Investor</th>
                      <th className="text-left font-medium p-2">Pool</th>
                      <th className="text-left font-medium p-2">Investment</th>
                      <th className="text-left font-medium p-2">Current Value</th>
                      <th className="text-left font-medium p-2">Profit/Loss</th>
                      <th className="text-left font-medium p-2">Join Date</th>
                      <th className="text-left font-medium p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "John Smith",
                        pool: "Forex Alpha Pool",
                        investment: "$25,000.00",
                        value: "$28,750.00",
                        profit: "+15.0%",
                        date: "Jan 15, 2025",
                      },
                      {
                        name: "Sarah Johnson",
                        pool: "Crypto Growth Pool",
                        investment: "$50,000.00",
                        value: "$68,500.00",
                        profit: "+37.0%",
                        date: "Feb 3, 2025",
                      },
                      {
                        name: "Michael Brown",
                        pool: "Balanced Portfolio Pool",
                        investment: "$100,000.00",
                        value: "$112,800.00",
                        profit: "+12.8%",
                        date: "Dec 10, 2024",
                      },
                      {
                        name: "Emily Davis",
                        pool: "Conservative Income Pool",
                        investment: "$75,000.00",
                        value: "$78,750.00",
                        profit: "+5.0%",
                        date: "Mar 22, 2025",
                      },
                      {
                        name: "Robert Wilson",
                        pool: "Forex Alpha Pool",
                        investment: "$30,000.00",
                        value: "$34,200.00",
                        profit: "+14.0%",
                        date: "Feb 18, 2025",
                      },
                      {
                        name: "Jennifer Lee",
                        pool: "Crypto Growth Pool",
                        investment: "$20,000.00",
                        value: "$27,400.00",
                        profit: "+37.0%",
                        date: "Apr 5, 2025",
                      },
                    ].map((investor, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{investor.name}</td>
                        <td className="p-2">{investor.pool}</td>
                        <td className="p-2">{investor.investment}</td>
                        <td className="p-2">{investor.value}</td>
                        <td className="p-2 text-green-500">{investor.profit}</td>
                        <td className="p-2 text-sm text-muted-foreground">{investor.date}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <DollarSign className="h-4 w-4" />
                              <span className="sr-only">Manage</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                              </svg>
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
