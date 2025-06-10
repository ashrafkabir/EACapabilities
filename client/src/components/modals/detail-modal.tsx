import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ExternalLink, Network, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { EntityReference } from "@/pages/dashboard";
import type { Application, BusinessCapability, DataObject } from "@shared/schema";

interface DetailModalProps {
  entity: EntityReference;
  onClose: () => void;
}

export default function DetailModal({ entity, onClose }: DetailModalProps) {
  // Use entity.data if available, otherwise fetch from API
  const shouldFetch = !entity.data && !!entity.id;
  
  const { data: fetchedEntityData, isLoading } = useQuery({
    queryKey: [`/api/${entity.type === 'capability' ? 'business-capabilities' : entity.type + 's'}`, entity.id],
    enabled: shouldFetch,
  });
  
  // Use entity.data if available, otherwise use fetched data
  const entityData = entity.data || fetchedEntityData;

  // Fetch applications for capabilities
  const { data: relatedApplications, isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: [`/api/capabilities/${entity.id}/applications`],
    enabled: !!entity.id && entity.type === 'capability',
  });

  // Debug logging
  console.log('Entity type:', entity.type, 'Related apps:', relatedApplications?.length || 0);
  console.log('Apps loading:', appsLoading, 'Apps data:', relatedApplications);

  const renderApplicationDetails = (app: Application) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-foreground mb-3">Basic Information</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="text-sm text-foreground">{app.displayName || app.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Business Domain</dt>
              <dd className="text-sm text-foreground">{app.businessDomain || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Owner</dt>
              <dd className="text-sm text-foreground">{app.ownedBy || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Vendor</dt>
              <dd className="text-sm text-foreground">{app.vendor || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <Badge variant="default">Active</Badge>
              </dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="font-medium text-foreground mb-3">Technical Details</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Technical Fit</dt>
              <dd className="text-sm text-foreground">{app.technicalFit || 'Not assessed'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Functional Fit</dt>
              <dd className="text-sm text-foreground">{app.functionalFit || 'Not assessed'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Maturity Status</dt>
              <dd className="text-sm text-foreground">{app.maturityStatus || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Region</dt>
              <dd className="text-sm text-foreground">{app.region || 'Global'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {app.description && (
        <div>
          <h3 className="font-medium text-foreground mb-3">Description</h3>
          <p className="text-sm text-muted-foreground">{app.description}</p>
        </div>
      )}

      <div>
        <h3 className="font-medium text-foreground mb-3">Business Capabilities</h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            {app.businessCapabilities || 'No capabilities specified'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderCapabilityDetails = (capability: BusinessCapability) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-foreground mb-3">Basic Information</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="text-sm text-foreground">{capability.displayName || capability.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Hierarchy</dt>
              <dd className="text-sm text-foreground">{capability.hierarchy || 'Root level'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Level</dt>
              <dd className="text-sm text-foreground">Level {capability.level}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="font-medium text-foreground mb-3">Mapping Details</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Level 1 Capability</dt>
              <dd className="text-sm text-foreground">{capability.mappedLevel1Capability || 'Not mapped'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Lifesciences Mapping</dt>
              <dd className="text-sm text-foreground">{capability.mappedToLifesciencesCapabilities || 'Not mapped'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderDataObjectDetails = (dataObj: DataObject) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-foreground mb-3">Basic Information</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="text-sm text-foreground">{dataObj.displayName || dataObj.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Business Domain</dt>
              <dd className="text-sm text-foreground">{dataObj.tagsBusinessDomain || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Owner</dt>
              <dd className="text-sm text-foreground">{dataObj.tagsOwnedBy || 'Not specified'}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="font-medium text-foreground mb-3">Relationships</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Applications</dt>
              <dd className="text-sm text-foreground">{dataObj.relDataObjectToApplication || 'None'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Interfaces</dt>
              <dd className="text-sm text-foreground">{dataObj.relDataObjectToInterface || 'None'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderEntityContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!entityData) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Entity details not found</p>
        </div>
      );
    }

    switch (entity.type) {
      case 'application':
        return renderApplicationDetails(entityData as Application);
      case 'capability':
        return renderCapabilityDetails(entityData as BusinessCapability);
      case 'dataObject':
        return renderDataObjectDetails(entityData as DataObject);
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Details for {entity.type} are not yet implemented
            </p>
          </div>
        );
    }
  };

  const getEntityTitle = () => {
    if (entity.data && typeof entity.data === 'object' && 'displayName' in entity.data) {
      return entity.data.displayName || entity.data.name || 'Entity Details';
    }
    if (entityData && typeof entityData === 'object' && 'displayName' in entityData) {
      return (entityData as any).displayName || (entityData as any).name || 'Entity Details';
    }
    return 'Entity Details';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{getEntityTitle()}</span>
            <Badge variant="outline" className="capitalize">
              {entity.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              {renderEntityContent()}
            </TabsContent>
            
            <TabsContent value="relationships" className="mt-6">
              <div className="space-y-6">
                {/* Related Applications Section for Capabilities */}
                {entity.type === 'capability' && (
                  <div>
                    {appsLoading ? (
                      <div>
                        <h3 className="font-medium text-foreground mb-3">Loading Applications...</h3>
                        <div className="h-16 bg-muted/30 rounded-lg animate-pulse"></div>
                      </div>
                    ) : relatedApplications && relatedApplications.length > 0 ? (
                      <div>
                        <h3 className="font-medium text-foreground mb-3">Related Applications ({relatedApplications.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {relatedApplications.slice(0, 6).map((app: Application) => (
                            <div key={app.id} className="bg-muted/30 rounded-lg p-3 border">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-foreground">{app.displayName || app.name}</h4>
                                  {app.businessDomain && (
                                    <Badge variant="secondary" className="mt-1 text-xs">{app.businessDomain}</Badge>
                                  )}
                                  {app.ownedBy && (
                                    <p className="text-xs text-muted-foreground mt-1">Owner: {app.ownedBy}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">{app.maturityStatus || 'Active'}</Badge>
                                    {app.mainArea && (
                                      <Badge variant="outline" className="text-xs">{app.mainArea}</Badge>
                                    )}
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    // Navigate to application details
                                    console.log('Navigate to app:', app.id);
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {relatedApplications.length > 6 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            and {relatedApplications.length - 6} more applications...
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-medium text-foreground mb-3">Related Applications</h3>
                        <p className="text-sm text-muted-foreground">No applications found for this capability.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* General Connected Entities Section */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Other Connected Entities</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Additional relationship data will be displayed here
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Performance Metrics</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Metrics and analytics will be displayed here
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
