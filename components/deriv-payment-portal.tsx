import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, CreditCard, Download, Upload, Wallet } from "lucide-react"

export default function DerivPaymentPortal() {
  return (
    <Tabs defaultValue="deposit">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm">
          <Wallet className="mr-2 h-4 w-4" />
          Payment Methods
        </Button>
      </div>

      <TabsContent value="deposit">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>Add funds to your Deriv account</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex">
                      <Input id="amount" type="number" placeholder="0.00" className="rounded-r-none" />
                      <Select defaultValue="USD">
                        <SelectTrigger className="w-[100px] rounded-l-none border-l-0">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: "Credit Card", icon: <CreditCard className="h-6 w-6" /> },
                        { name: "Bank Transfer", icon: <ArrowDownUp className="h-6 w-6" /> },
                        { name: "E-Wallet", icon: <Wallet className="h-6 w-6" /> },
                        {
                          name: "Crypto",
                          icon: (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                            </svg>
                          ),
                        },
                      ].map((method, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5"
                        >
                          {method.icon}
                          <span className="text-sm">{method.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account">Deriv Account</Label>
                    <Select defaultValue="CR123456">
                      <SelectTrigger id="account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CR123456">CR123456 - USD</SelectItem>
                        <SelectItem value="CR789012">CR789012 - EUR</SelectItem>
                        <SelectItem value="MF345678">MF345678 - Demo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Proceed to Deposit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Deposit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Processing Time</h4>
                  <p className="text-sm text-muted-foreground">Instant to 24 hours depending on the payment method.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Minimum Deposit</h4>
                  <p className="text-sm text-muted-foreground">$10 or equivalent in other currencies.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    No fees for deposits. Payment processor fees may apply.
                  </p>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Need Help?</h4>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="withdraw">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Withdraw funds from your Deriv account</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <div className="flex">
                      <Input id="withdraw-amount" type="number" placeholder="0.00" className="rounded-r-none" />
                      <Select defaultValue="USD">
                        <SelectTrigger className="w-[100px] rounded-l-none border-l-0">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="withdraw-account">From Deriv Account</Label>
                    <Select defaultValue="CR123456">
                      <SelectTrigger id="withdraw-account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CR123456">CR123456 - USD (Balance: $5,432.10)</SelectItem>
                        <SelectItem value="CR789012">CR789012 - EUR (Balance: €2,345.67)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Withdrawal Method</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: "Bank Transfer", icon: <ArrowDownUp className="h-6 w-6" /> },
                        { name: "E-Wallet", icon: <Wallet className="h-6 w-6" /> },
                        {
                          name: "Crypto",
                          icon: (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                            </svg>
                          ),
                        },
                        {
                          name: "Payment Agent",
                          icon: (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          ),
                        },
                      ].map((method, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5"
                        >
                          {method.icon}
                          <span className="text-sm">{method.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Request Withdrawal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Processing Time</h4>
                  <p className="text-sm text-muted-foreground">1-3 business days depending on the withdrawal method.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Minimum Withdrawal</h4>
                  <p className="text-sm text-muted-foreground">$10 or equivalent in other currencies.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Withdrawals may require identity verification for security purposes.
                  </p>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Need Help?</h4>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View your deposit and withdrawal history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Transaction ID</th>
                    <th className="text-left font-medium p-2">Date</th>
                    <th className="text-left font-medium p-2">Type</th>
                    <th className="text-left font-medium p-2">Method</th>
                    <th className="text-left font-medium p-2">Amount</th>
                    <th className="text-left font-medium p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "TRX-78901",
                      date: "May 18, 2025",
                      type: "Deposit",
                      method: "Credit Card",
                      amount: "+$1,000.00",
                      status: "Completed",
                    },
                    {
                      id: "TRX-78890",
                      date: "May 15, 2025",
                      type: "Withdrawal",
                      method: "Bank Transfer",
                      amount: "-$500.00",
                      status: "Completed",
                    },
                    {
                      id: "TRX-78854",
                      date: "May 10, 2025",
                      type: "Deposit",
                      method: "E-Wallet",
                      amount: "+$2,500.00",
                      status: "Completed",
                    },
                    {
                      id: "TRX-78812",
                      date: "May 5, 2025",
                      type: "Withdrawal",
                      method: "Crypto",
                      amount: "-$1,200.00",
                      status: "Completed",
                    },
                    {
                      id: "TRX-78799",
                      date: "May 1, 2025",
                      type: "Deposit",
                      method: "Bank Transfer",
                      amount: "+$3,000.00",
                      status: "Completed",
                    },
                    {
                      id: "TRX-78756",
                      date: "Apr 25, 2025",
                      type: "Withdrawal",
                      method: "Payment Agent",
                      amount: "-$800.00",
                      status: "Completed",
                    },
                  ].map((transaction, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{transaction.id}</td>
                      <td className="p-2 text-sm">{transaction.date}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            transaction.type === "Deposit" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="p-2">{transaction.method}</td>
                      <td className={`p-2 ${transaction.amount.startsWith("+") ? "text-green-500" : "text-blue-500"}`}>
                        {transaction.amount}
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {transaction.status}
                        </span>
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
  )
}
