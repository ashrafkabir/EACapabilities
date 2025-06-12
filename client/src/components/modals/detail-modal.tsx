import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ExternalLink, Network, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { EntityReference } from "@/pages/dashboard";
import type { Application, BusinessCapability, DataObject } from "@shared/schema";

interface DetailModalProps {
  entity: EntityReference;
  onClose: () => void;
}

export default function DetailModal({ entity, onClose }: DetailModalProps) {
  const [expandedSections, setExpandedSections] = useState({
    applications: true,
    basicInfo: true,
    technical: false,
    business: false
  });

  // Use entity.data if available, otherwise fetch from API
  const shouldFetch = !entity.data && !!entity.id;
  
  const { data: fetchedEntityData, isLoading } = useQuery({
    queryKey: [`/api/${entity.type === 'capability' ? 'business-capabilities' : entity.type + 's'}`, entity.id],
    enabled: shouldFetch,
  });
  
  // Use entity.data if available, otherwise use fetched data
  const entityData = entity.data || fetchedEntityData;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fetch applications for capabilities
  const { data: relatedApplications, isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: [`/api/capabilities/${entity.id}/applications`],
    enabled: !!entity.id && entity.type === 'capability',
  });

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
              <dt className="text-sm text-muted-foreground">Description</dt>
              <dd className="text-sm text-foreground">{app.description || 'No description available'}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="font-medium text-foreground mb-3">Technical Details</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Technical Suitability</dt>
              <dd className="text-sm text-foreground">
                <Badge variant={app.technicalSuitability === 'adequate' ? 'default' : 'secondary'}>
                  {app.technicalSuitability || 'Not assessed'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Functional Fit</dt>
              <dd className="text-sm text-foreground">
                <Badge variant={app.functionalFit === 'perfect' ? 'default' : 'secondary'}>
                  {app.functionalFit || 'Not assessed'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Maturity Status</dt>
              <dd className="text-sm text-foreground">{app.maturityStatus || 'Not specified'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderCapabilityDetails = (capability: BusinessCapability & { applicationsWithPaths?: Array<{ application: Application; paths: string[] }> }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground mb-3">Capability Information</h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="text-sm text-foreground">{capability.displayName || capability.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Level</dt>
            <dd className="text-sm text-foreground">Level {capability.level}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Hierarchy</dt>
            <dd className="text-sm text-foreground">{capability.hierarchy || 'Not specified'}</dd>
          </div>
          {capability.level1Capability && (
            <div>
              <dt className="text-sm text-muted-foreground">Level 1 Capability</dt>
              <dd className="text-sm text-foreground">{capability.level1Capability}</dd>
            </div>
          )}
          {capability.level2Capability && (
            <div>
              <dt className="text-sm text-muted-foreground">Level 2 Capability</dt>
              <dd className="text-sm text-foreground">{capability.level2Capability}</dd>
            </div>
          )}
          {capability.level3Capability && (
            <div>
              <dt className="text-sm text-muted-foreground">Level 3 Capability</dt>
              <dd className="text-sm text-foreground">{capability.level3Capability}</dd>
            </div>
          )}
        </dl>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">
          Applications ({capability.applicationsWithPaths?.length || (relatedApplications?.length || 0)})
        </h3>
        <div className="space-y-2">
          {capability.applicationsWithPaths && capability.applicationsWithPaths.length > 0 ? (
            <div className="grid gap-3">
              {capability.applicationsWithPaths.map(({ application: app, paths }) => (
                <div key={app.id} className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{app.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{app.description || 'No description'}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {app.technicalSuitability || 'Not assessed'}
                    </Badge>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Capability Paths:</div>
                    {paths.map((path, idx) => (
                      <div key={idx} className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded mb-1">
                        {path}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : relatedApplications && relatedApplications.length > 0 ? (
            <div className="grid gap-2">
              {relatedApplications.slice(0, 10).map((app: Application) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{app.name}</div>
                    <div className="text-xs text-muted-foreground">{app.description || 'No description'}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {app.technicalSuitability || 'Not assessed'}
                  </Badge>
                </div>
              ))}
              {relatedApplications.length > 10 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  ... and {relatedApplications.length - 10} more applications
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-4 text-center">
              No applications found for this capability
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDataObjectDetails = (dataObj: DataObject) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground mb-3">Data Object Information</h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="text-sm text-foreground">{dataObj.displayName || dataObj.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Description</dt>
            <dd className="text-sm text-foreground">{dataObj.description || 'No description available'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );

  const renderEntityContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
          <div className="h-4 bg-muted/30 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-muted/30 rounded animate-pulse w-1/2"></div>
        </div>
      );
    }

    if (!entityData) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Unable to load entity details.</p>
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
            <p className="text-muted-foreground">Entity type not supported yet.</p>
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Slide-out panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{getEntityTitle()}</h2>
            <Badge variant="outline" className="capitalize">
              {entity.type}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information - Always expanded */}
          <Collapsible open={expandedSections.basicInfo} onOpenChange={() => toggleSection('basicInfo')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
              {expandedSections.basicInfo ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              {renderEntityContent()}
            </CollapsibleContent>
          </Collapsible>

          {/* Applications Section for Capabilities */}
          {entity.type === 'capability' && (
            <Collapsible open={expandedSections.applications} onOpenChange={() => toggleSection('applications')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Related Applications {relatedApplications && `(${relatedApplications.length})`}
                </h3>
                {expandedSections.applications ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                {appsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : relatedApplications && relatedApplications.length > 0 ? (
                  <div className="space-y-3">
                    {relatedApplications.slice(0, 10).map((app: Application) => (
                      <div key={app.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{app.displayName || app.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{app.businessDomain || 'No domain specified'}</p>
                            {app.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">{app.description}</p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 ml-4">
                            {app.technicalSuitability && (
                              <Badge variant="outline" className="text-xs">
                                Tech: {app.technicalSuitability}
                              </Badge>
                            )}
                            {app.functionalFit && (
                              <Badge variant="outline" className="text-xs">
                                Func: {app.functionalFit}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Additional details */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {app.ownedBy && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              Owner: {app.ownedBy}
                            </span>
                          )}
                          {app.region && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                              Region: {app.region}
                            </span>
                          )}
                          {app.organizations && (
                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                              Org: {app.organizations}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {relatedApplications.length > 10 && (
                      <div className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Could expand to show all or link to a dedicated view
                          }}
                        >
                          Show {relatedApplications.length - 10} more applications
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No applications found for this capability.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Technical Information */}
          <Collapsible open={expandedSections.technical} onOpenChange={() => toggleSection('technical')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Technical Details</h3>
              {expandedSections.technical ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4 text-sm">
                {entityData && typeof entityData === 'object' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {'technicalSuitability' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Technical Suitability</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).technicalSuitability || 'Not specified'}</dd>
                      </div>
                    )}
                    {'maturityStatus' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Maturity Status</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).maturityStatus || 'Not specified'}</dd>
                      </div>
                    )}
                    {'serviceLevel' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Service Level</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).serviceLevel || 'Not specified'}</dd>
                      </div>
                    )}
                    {'vendor' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Vendor</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).vendor || 'Not specified'}</dd>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Business Information */}
          <Collapsible open={expandedSections.business} onOpenChange={() => toggleSection('business')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Information</h3>
              {expandedSections.business ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4 text-sm">
                {entityData && typeof entityData === 'object' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {'businessDomain' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Business Domain</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).businessDomain || 'Not specified'}</dd>
                      </div>
                    )}
                    {'owningFunction' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Owning Function</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).owningFunction || 'Not specified'}</dd>
                      </div>
                    )}
                    {'businessUnit' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Business Unit</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).businessUnit || 'Not specified'}</dd>
                      </div>
                    )}
                    {'costTotalAnnual' in entityData && (
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Annual Cost</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{(entityData as any).costTotalAnnual || 'Not specified'}</dd>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
}