import { useQuery } from "@tanstack/react-query";
import { Building, Network, BarChart3, TrendingUp, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EntityReference } from "@/pages/dashboard";

interface DashboardMetrics {
  totalApplications: number;
  totalInterfaces: number;
  totalCapabilities: number;
  totalInitiatives: number;
  applicationsByDomain: { domain: string; count: number }[];
  riskDistribution: { risk: string; count: number }[];
  recentActivity: Array<{
    id: string;
    name: string;
    type: string;
    domain: string;
    status: string;
    lastUpdated: string;
  }>;
}

interface DashboardViewProps {
  onEntitySelect: (entity: EntityReference) => void;
}

export default function DashboardView({ onEntitySelect }: DashboardViewProps) {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
  });

  if (isLoading) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-muted rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No dashboard data available
          </h3>
          <p className="text-muted-foreground">
            Dashboard metrics could not be loaded at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-medium text-foreground mb-6">
            Enterprise Architecture Dashboard
          </h2>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {metrics.totalApplications.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                    <Network className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {metrics.totalInterfaces.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Interfaces</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {metrics.totalCapabilities.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Capabilities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {metrics.totalInitiatives.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Initiatives</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Applications by Domain */}
            <Card>
              <CardHeader>
                <CardTitle>Applications by Business Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.applicationsByDomain.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {item.domain || 'Unknown'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-2 bg-primary rounded-full"
                          style={{ 
                            width: `${(item.count / Math.max(...metrics.applicationsByDomain.map(d => d.count))) * 100}px`,
                            minWidth: '20px'
                          }}
                        />
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Technology Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.riskDistribution.map((item, index) => {
                    const colors = {
                      low: 'bg-green-500',
                      medium: 'bg-yellow-500', 
                      high: 'bg-red-500',
                      unknown: 'bg-gray-400'
                    };
                    const color = colors[item.risk.toLowerCase() as keyof typeof colors] || colors.unknown;
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground capitalize">
                          {item.risk} Risk
                        </span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className={`h-2 rounded-full ${color}`}
                            style={{ 
                              width: `${(item.count / Math.max(...metrics.riskDistribution.map(d => d.count))) * 100}px`,
                              minWidth: '20px'
                            }}
                          />
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Application
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Domain
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Last Updated
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentActivity.map((item) => (
                      <tr key={item.id} className="border-b border-border">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center">
                              <Building className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {item.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {item.domain}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {item.lastUpdated}
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEntitySelect({
                              type: 'application',
                              id: item.id,
                              data: item
                            })}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
