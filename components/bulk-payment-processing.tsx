import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Check, CreditCard, Download, FileText, Upload } from "lucide-react"

export default function BulkPaymentProcessing() {
  return (
    <Tabs defaultValue="new">
      <TabsList>
        <TabsTrigger value="new">New Payment</TabsTrigger>
        <TabsTrigger value="history">Payment History</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>

      <TabsContent value="new" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Payment</CardTitle>
                <CardDescription>Process payments to multiple recipients at once</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="payment-name">Payment Name</Label>
                    <Input id="payment-name" placeholder="e.g. May 2025 Commissions" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select defaultValue="bank">
                        <SelectTrigger id="payment-method">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="wallet">E-Wallet</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="payment-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="eur">EUR</SelectItem>
                          <SelectItem value="gbp">GBP</SelectItem>
                          <SelectItem value="btc">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Recipients</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Import CSV
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Template
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md">
                      <div className="grid grid-cols-12 gap-2 p-3 border-b bg-muted/50 text-sm font-medium">
                        <div className="col-span-5">Recipient</div>
                        <div className="col-span-4">Account/Email</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-1"></div>
                      </div>

                      {[
                        { name: "John Smith", account: "john.smith@example.com", amount: "$1,250.00" },
                        { name: "Sarah Johnson", account: "sarah.j@example.com", amount: "$2,340.00" },
                        { name: "Michael Brown", account: "mbrown@example.com", amount: "$1,875.50" },
                      ].map((recipient, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 p-3 border-b items-center">
                          <div className="col-span-5">
                            <Input defaultValue={recipient.name} className="h-8" />
                          </div>
                          <div className="col-span-4">
                            <Input defaultValue={recipient.account} className="h-8" />
                          </div>
                          <div className="col-span-2">
                            <Input defaultValue={recipient.amount} className="h-8" />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="p-3">
                        <Button variant="ghost" className="w-full border border-dashed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-2"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                          Add Recipient
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-notes">Notes (Optional)</Label>
                    <Input id="payment-notes" placeholder="Add any additional information" />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-2xl font-bold">$5,465.50</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Save as Template</Button>
                      <Button>Process Payment</Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Processing Time</h4>
                  <p className="text-sm text-muted-foreground">
                    1-2 business days for bank transfers. Other methods may vary.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Bank Transfer: 1.2%
                    <br />
                    Credit Card: 2.9% + $0.30
                    <br />
                    E-Wallet: 1.5%
                    <br />
                    Cryptocurrency: 1.0%
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Maximum 100 recipients per bulk payment.
                    <br />
                    Maximum amount: $100,000 per transaction.
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

      <TabsContent value="history" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View and manage your past bulk payments</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Payment ID</th>
                    <th className="text-left font-medium p-2">Name</th>
                    <th className="text-left font-medium p-2">Date</th>
                    <th className="text-left font-medium p-2">Method</th>
                    <th className="text-left font-medium p-2">Recipients</th>
                    <th className="text-left font-medium p-2">Total Amount</th>
                    <th className="text-left font-medium p-2">Status</th>
                    <th className="text-left font-medium p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "PMT-12345",
                      name: "April 2025 Commissions",
                      date: "Apr 30, 2025",
                      method: "Bank Transfer",
                      recipients: 24,
                      amount: "$28,450.75",
                      status: "Completed",
                    },
                    {
                      id: "PMT-12344",
                      name: "Q1 2025 Bonuses",
                      date: "Apr 15, 2025",
                      method: "E-Wallet",
                      recipients: 12,
                      amount: "$15,780.00",
                      status: "Completed",
                    },
                    {
                      id: "PMT-12343",
                      name: "March 2025 Commissions",
                      date: "Mar 31, 2025",
                      method: "Bank Transfer",
                      recipients: 22,
                      amount: "$26,340.50",
                      status: "Completed",
                    },
                    {
                      id: "PMT-12342",
                      name: "Affiliate Payouts",
                      date: "Mar 15, 2025",
                      method: "Cryptocurrency",
                      recipients: 8,
                      amount: "$12,450.00",
                      status: "Completed",
                    },
                    {
                      id: "PMT-12341",
                      name: "February 2025 Commissions",
                      date: "Feb 28, 2025",
                      method: "Bank Transfer",
                      recipients: 20,
                      amount: "$24,780.25",
                      status: "Completed",
                    },
                  ].map((payment, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{payment.id}</td>
                      <td className="p-2">{payment.name}</td>
                      <td className="p-2 text-sm">{payment.date}</td>
                      <td className="p-2">{payment.method}</td>
                      <td className="p-2">{payment.recipients}</td>
                      <td className="p-2">{payment.amount}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <CreditCard className="h-4 w-4" />
                            <span className="sr-only">Repeat</span>
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

      <TabsContent value="templates" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Payment Templates</CardTitle>
                <CardDescription>Save and reuse payment configurations</CardDescription>
              </div>
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Create Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Monthly Commissions", method: "Bank Transfer", recipients: 24, lastUsed: "Apr 30, 2025" },
                { name: "Quarterly Bonuses", method: "E-Wallet", recipients: 12, lastUsed: "Apr 15, 2025" },
                { name: "Affiliate Payouts", method: "Cryptocurrency", recipients: 8, lastUsed: "Mar 15, 2025" },
                { name: "Contractor Payments", method: "Bank Transfer", recipients: 6, lastUsed: "Feb 28, 2025" },
              ].map((template, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Method</p>
                        <p className="font-medium">{template.method}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Recipients</p>
                        <p className="font-medium">{template.recipients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Used</p>
                        <p className="font-medium">{template.lastUsed}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
