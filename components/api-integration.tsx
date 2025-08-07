import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Key, RefreshCw, Shield } from "lucide-react"

export default function ApiIntegration() {
  return (
    <Tabs defaultValue="keys">
      <TabsList>
        <TabsTrigger value="keys">API Keys</TabsTrigger>
        <TabsTrigger value="docs">Documentation</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
      </TabsList>

      <TabsContent value="keys" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys for integration</CardDescription>
                  </div>
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      name: "Production Key",
                      key: "sk_live_**************************", // Placeholder for security
                      created: "Apr 15, 2025",
                      lastUsed: "2 hours ago",
                      status: "Active",
                    },
                    {
                      name: "Test Key",
                      key: "sk_test_**************************", // Placeholder for security
                      created: "Apr 15, 2025",
                      lastUsed: "1 day ago",
                      status: "Active",
                    },
                    {
                      name: "Development Key",
                      key: "sk_dev_51NxXXXXXXXXXXXXXXXXXXXXXX",
                      created: "Mar 10, 2025",
                      lastUsed: "5 days ago",
                      status: "Active",
                    },
                  ].map((apiKey, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{apiKey.name}</h3>
                            <Badge variant={apiKey.status === "Active" ? "default" : "secondary"}>
                              {apiKey.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Created on {apiKey.created}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Rotate
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            Revoke
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <div className="font-mono text-sm truncate flex-1">
                          {apiKey.key.substring(0, 12)}••••••••••••••••••••••
                        </div>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>

                      <div className="mt-4 text-sm text-muted-foreground">Last used: {apiKey.lastUsed}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>API Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">IP Restrictions</h4>
                  <p className="text-sm text-muted-foreground mb-2">Limit API access to specific IP addresses</p>
                  <div className="flex gap-2">
                    <Input placeholder="Add IP address" className="h-8" />
                    <Button size="sm" className="h-8">
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Rate Limits</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Requests per minute</span>
                      <span className="font-medium">100/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Requests per day</span>
                      <span className="font-medium">10,000/day</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="docs" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>Learn how to integrate with our API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Getting Started</h3>
                <p className="text-muted-foreground mb-4">
                  Our RESTful API allows you to integrate trading signals, copy trading, and payment processing into
                  your own applications.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      # Example API request using curl
                      <br />
                      curl -X GET "https://api.ivrex.com/v1/signals" \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json"
                    </code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Available Endpoints</h3>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        GET
                      </Badge>
                      <span className="font-mono text-sm">/v1/signals</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Retrieve active trading signals</p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        POST
                      </Badge>
                      <span className="font-mono text-sm">/v1/payments/process</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Process a payment transaction</p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        GET
                      </Badge>
                      <span className="font-mono text-sm">/v1/traders</span>
                    </div>
                    <p className="text-sm text-muted-foreground">List available traders for copy trading</p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        POST
                      </Badge>
                      <span className="font-mono text-sm">/v1/copy-trading/subscribe</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Subscribe to a trader's signals</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button>View Full Documentation</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="webhooks" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Configure event notifications for your application</CardDescription>
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
                Add Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  name: "Signal Alerts",
                  url: "https://example.com/webhooks/signals",
                  events: ["signal.created", "signal.updated"],
                  status: "Active",
                },
                {
                  name: "Payment Notifications",
                  url: "https://example.com/webhooks/payments",
                  events: ["payment.succeeded", "payment.failed"],
                  status: "Active",
                },
                {
                  name: "Copy Trading Events",
                  url: "https://example.com/webhooks/copy-trading",
                  events: ["trade.opened", "trade.closed"],
                  status: "Inactive",
                },
              ].map((webhook, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{webhook.name}</h3>
                        <Badge variant={webhook.status === "Active" ? "default" : "secondary"}>{webhook.status}</Badge>
                      </div>
                      <p className="text-sm font-mono text-muted-foreground truncate max-w-md">{webhook.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Events</h4>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event, i) => (
                        <Badge key={i} variant="secondary">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Webhook Secret</h3>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm truncate flex-1">whsec_••••••••••••••••••••••••••••••</div>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Rotate
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use this secret to verify webhook signatures and ensure they came from Ivrex.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
