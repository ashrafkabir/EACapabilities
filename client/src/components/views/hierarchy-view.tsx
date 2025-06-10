import { useQuery } from "@tanstack/react-query";
import { Building, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EntityReference } from "@/pages/dashboard";
import type { Application } from "@shared/schema";

interface HierarchyViewProps {
  selectedCapability: string | null;
  onEntitySelect: (entity: EntityReference) => void;
  searchTerm: string;
}

export default function HierarchyView({
  selectedCapability,
  onEntitySelect,
  searchTerm
}: HierarchyViewProps) {
  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['/api/applications', { search: searchTerm, capability: selectedCapability }],
  });

  const getStatusColor = (status: string | null) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'deprecated': return 'destructive';
      case 'planned': return 'secondary';
      default: return 'secondary';
    }
  };

  const getBusinessImpact = (app: Application) => {
    // Simple heuristic based on business domain and owning function
    const criticalDomains = ['finance', 'clinical', 'manufacturing', 'regulatory'];
    const domain = app.businessDomain?.toLowerCase() || '';
    
    if (criticalDomains.some(d => domain.includes(d))) {
      return 'Critical';
    }
    if (app.businessDomain) {
      return 'High';
    }
    return 'Medium';
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-muted rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-medium text-foreground mb-6">
            Enterprise Architecture Hierarchy
          </h2>
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 mb-6" aria-label="Breadcrumb">
            <Button variant="link" className="p-0 h-auto text-primary">
              Root
            </Button>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <Button variant="link" className="p-0 h-auto text-primary">
              {selectedCapability || 'All Capabilities'}
            </Button>
          </nav>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card
                key={app.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onEntitySelect({
                  type: 'application',
                  id: app.id,
                  data: app
                })}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {app.displayName || app.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {app.businessDomain || 'Enterprise Application'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor('active')}>
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {app.ownedBy && (
                      <div className="flex items-center text-sm">
                        <Building className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground truncate">
                          {app.ownedBy}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm">
                      <ExternalLink className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {Math.floor(Math.random() * 50 + 10)} Interfaces
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 bg-muted-foreground rounded-full mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {Math.floor(Math.random() * 30 + 5)} Data Objects
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Business Impact</span>
                      <span className="font-medium text-foreground">
                        {getBusinessImpact(app)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No applications found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No applications match "${searchTerm}"`
                  : 'No applications available for the selected criteria'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
