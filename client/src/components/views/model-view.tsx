import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Minus, Search, Check, ChevronsUpDown, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { BusinessCapability, Application } from "@shared/schema";

interface ModelViewProps {
  searchTerm: string;
  selectedCapability: string | null;
  searchScope: string | null;
}

interface ColumnData {
  level1Id: string;
  level1Name: string;
  level1ApplicationCount: number;
  level2Groups: {
    level2Id: string;
    level2Name: string;
    level2ApplicationCount: number;
    level3Items: BusinessCapability[];
  }[];
}

export default function ModelView({ searchTerm, selectedCapability: sidebarSelectedCapability, searchScope }: ModelViewProps) {
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set());
  const [expandedLevel2Groups, setExpandedLevel2Groups] = useState<Set<string>>(new Set());

  const MAX_ITEMS_PER_LEVEL = 3;

  const queryClient = useQueryClient();

  const { data: capabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

  const { data: allApplications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const { data: itComponents = [] } = useQuery<any[]>({
    queryKey: ['/api/it-components'],
  });

  const { data: interfaces = [] } = useQuery<any[]>({
    queryKey: ['/api/interfaces'],
  });

  const { data: dataObjects = [] } = useQuery<any[]>({
    queryKey: ['/api/data-objects'],
  });

  const { data: initiatives = [] } = useQuery<any[]>({
    queryKey: ['/api/initiatives'],
  });

  const { data: applicationsForSelectedCapability = [] } = useQuery({
    queryKey: ['/api/capabilities', selectedCapability, 'applications'],
    enabled: !!selectedCapability,
  });

  // Mutation for adding application-capability relationships
  const addApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, capabilityName }: { applicationId: string; capabilityName: string }) => {
      return apiRequest(`/api/applications/${applicationId}/capabilities`, 'POST', { capabilityName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capabilities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      setIsAddDialogOpen(false);
      setSelectedApplications(new Set());
      setApplicationSearchTerm("");
    },
  });

  // Mutation for removing application-capability relationships
  const removeApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, capabilityName }: { applicationId: string; capabilityName: string }) => {
      return apiRequest(`/api/applications/${applicationId}/capabilities`, 'DELETE', { capabilityName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capabilities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
    },
  });

  const getApplicationsForCapability = (capabilityName: string): Application[] => {
    return allApplications.filter((app: Application) => 
      app.businessCapabilities?.toLowerCase().includes(capabilityName.toLowerCase())
    );
  };

  const getApplicationCountForCapability = (capabilityName: string): number => {
    return getApplicationsForCapability(capabilityName).length;
  };

  const getInitiativesLinkedToCapability = (capabilityName: string): any[] => {
    return initiatives.filter((init: any) => {
      if (init.businessCapabilities) {
        return init.businessCapabilities.toLowerCase().includes(capabilityName.toLowerCase());
      }
      return false;
    });
  };

  const getApplicationsWithITComponents = (): Application[] => {
    const appsWithComponents = new Set<string>();
    
    itComponents.forEach((comp: any) => {
      if (comp.applications) {
        comp.applications.split(',').forEach((appName: string) => {
          appsWithComponents.add(appName.trim());
        });
      }
    });
    
    return allApplications.filter((app: Application) => 
      appsWithComponents.has(app.name) || appsWithComponents.has(app.displayName || '')
    );
  };

  // Helper functions to find applications linked to different entity types
  const getApplicationsLinkedToITComponent = (componentName: string): Application[] => {
    const matchingComponents = itComponents.filter((comp: any) => 
      comp.name?.toLowerCase().includes(componentName.toLowerCase())
    );
    
    const linkedApps = new Set<string>();
    matchingComponents.forEach((comp: any) => {
      if (comp.applications) {
        comp.applications.split(',').forEach((appName: string) => {
          linkedApps.add(appName.trim());
        });
      }
    });
    
    return allApplications.filter((app: Application) => 
      linkedApps.has(app.name) || linkedApps.has(app.displayName || '')
    );
  };

  const getApplicationsLinkedToInterface = (interfaceName: string): Application[] => {
    const matchingInterfaces = interfaces.filter((iface: any) => 
      iface.name?.toLowerCase().includes(interfaceName.toLowerCase())
    );
    
    const linkedApps = new Set<string>();
    matchingInterfaces.forEach((iface: any) => {
      if (iface.sourceApplication) linkedApps.add(iface.sourceApplication);
      if (iface.targetApplication) linkedApps.add(iface.targetApplication);
    });
    
    return allApplications.filter((app: Application) => 
      linkedApps.has(app.name) || linkedApps.has(app.displayName || '')
    );
  };

  const getApplicationsLinkedToDataObject = (dataObjectName: string): Application[] => {
    const matchingDataObjects = dataObjects.filter((obj: any) => 
      obj.name?.toLowerCase().includes(dataObjectName.toLowerCase())
    );
    
    const linkedApps = new Set<string>();
    matchingDataObjects.forEach((obj: any) => {
      if (obj.relDataObjectToApplication) {
        obj.relDataObjectToApplication.split(',').forEach((appName: string) => {
          linkedApps.add(appName.trim());
        });
      }
    });
    
    // Also consider applications connected via interfaces that use these data objects
    const dataObjectNames = matchingDataObjects.map(obj => obj.name);
    interfaces.forEach((iface: any) => {
      // Check if interface references any of the matching data objects
      if (iface.dataObjects && dataObjectNames.some(objName => 
        iface.dataObjects.toLowerCase().includes(objName.toLowerCase())
      )) {
        if (iface.sourceApplication) linkedApps.add(iface.sourceApplication);
        if (iface.targetApplication) linkedApps.add(iface.targetApplication);
      }
    });
    
    return allApplications.filter((app: Application) => 
      linkedApps.has(app.name) || linkedApps.has(app.displayName || '')
    );
  };

  const getApplicationsLinkedToInitiative = (initiativeName: string): Application[] => {
    const matchingInitiatives = initiatives.filter((init: any) => 
      init.name?.toLowerCase().includes(initiativeName.toLowerCase())
    );
    
    const linkedApps = new Set<string>();
    matchingInitiatives.forEach((init: any) => {
      if (init.applications) {
        init.applications.split(',').forEach((appName: string) => {
          linkedApps.add(appName.trim());
        });
      }
    });
    
    return allApplications.filter((app: Application) => 
      linkedApps.has(app.name) || linkedApps.has(app.displayName || '')
    );
  };

  const getRollupCount = (capability: BusinessCapability): number => {
    let count = getApplicationCountForCapability(capability.name);
    
    if (capability.level === 1) {
      const nestedCaps = capabilities.filter((cap: BusinessCapability) => 
        cap.level1Capability === capability.level1Capability && cap.level !== 1
      );
      nestedCaps.forEach((nestedCap: BusinessCapability) => {
        count += getApplicationCountForCapability(nestedCap.name);
      });
    } else if (capability.level === 2) {
      const level3Caps = capabilities.filter((cap: BusinessCapability) => 
        cap.level1Capability === capability.level1Capability && 
        cap.level2Capability === capability.level2Capability && 
        cap.level === 3
      );
      level3Caps.forEach((level3Cap: BusinessCapability) => {
        count += getApplicationCountForCapability(level3Cap.name);
      });
    }
    
    return count;
  };

  const processedData = useMemo(() => {
    const level1Caps = capabilities.filter((cap: BusinessCapability) => cap.level === 1);
    
    return level1Caps.map((level1Cap: BusinessCapability) => {
      const level2Caps = capabilities.filter((cap: BusinessCapability) => 
        cap.level === 2 && cap.level1Capability === level1Cap.level1Capability
      );
      
      const level2Groups = level2Caps.map((level2Cap: BusinessCapability) => {
        const level3Items = capabilities.filter((cap: BusinessCapability) => 
          cap.level === 3 && 
          cap.level1Capability === level1Cap.level1Capability &&
          cap.level2Capability === level2Cap.level2Capability
        ).sort((a: BusinessCapability, b: BusinessCapability) => 
          getRollupCount(b) - getRollupCount(a)
        );
        
        return {
          level2Id: level2Cap.id,
          level2Name: level2Cap.name,
          level2ApplicationCount: getRollupCount(level2Cap),
          level3Items,
        };
      }).sort((a, b) => b.level2ApplicationCount - a.level2ApplicationCount);
      
      return {
        level1Id: level1Cap.id,
        level1Name: level1Cap.name,
        level1ApplicationCount: getRollupCount(level1Cap),
        level2Groups,
      };
    }).sort((a, b) => b.level1ApplicationCount - a.level1ApplicationCount);
  }, [capabilities, allApplications]);

  const filteredColumns = useMemo(() => {
    if (!searchScope && !searchTerm.trim()) return processedData;
    
    let filtered = processedData;
    
    // Filter by search scope first
    if (searchScope) {
      if (searchScope.startsWith('Business Capability:')) {
        const capabilityPath = searchScope.replace('Business Capability: ', '');
        const pathParts = capabilityPath.split('/');
        
        filtered = processedData.filter((column: ColumnData) => {
          // Check if this column matches the selected hierarchy path
          if (pathParts.length === 1) {
            // Level 1 selection - show only this L1 column
            return column.level1Name.toLowerCase() === pathParts[0].toLowerCase();
          } else if (pathParts.length === 2) {
            // Level 2 selection - show column if it contains this L1/L2 path
            return column.level1Name.toLowerCase() === pathParts[0].toLowerCase() &&
                   column.level2Groups.some(group => 
                     group.level2Name.toLowerCase() === pathParts[1].toLowerCase()
                   );
          } else if (pathParts.length === 3) {
            // Level 3 selection - show column if it contains this exact L1/L2/L3 path
            return column.level1Name.toLowerCase() === pathParts[0].toLowerCase() &&
                   column.level2Groups.some(group => 
                     group.level2Name.toLowerCase() === pathParts[1].toLowerCase() &&
                     group.level3Items.some(item => 
                       item.name.toLowerCase() === pathParts[2].toLowerCase()
                     )
                   );
          }
          return false;
        });
        
        // Also filter the level2Groups and level3Items within matching columns
        filtered = filtered.map(column => ({
          ...column,
          level2Groups: column.level2Groups.filter(group => {
            if (pathParts.length === 1) {
              return true; // Show all L2 groups under the selected L1
            } else if (pathParts.length === 2) {
              return group.level2Name.toLowerCase() === pathParts[1].toLowerCase();
            } else if (pathParts.length === 3) {
              return group.level2Name.toLowerCase() === pathParts[1].toLowerCase();
            }
            return false;
          }).map(group => ({
            ...group,
            level3Items: group.level3Items.filter(item => {
              if (pathParts.length <= 2) {
                return true; // Show all L3 items under the selected L1/L2
              } else if (pathParts.length === 3) {
                return item.name.toLowerCase() === pathParts[2].toLowerCase();
              }
              return false;
            })
          }))
        }));
      } else if (searchScope.startsWith('Search:') || searchScope.startsWith('Application:') || 
                 searchScope.startsWith('IT Component:') || searchScope.startsWith('Interface:') ||
                 searchScope.startsWith('Data Object:') || searchScope.startsWith('Initiative:')) {
        const scopeSearchTerm = searchScope.replace(/^(Search|Application|IT Component|Interface|Data Object|Initiative): /, '').toLowerCase();
        
        // First get all applications linked to the searched entity
        let entityLinkedApps: Application[] = [];
        let showAllCapabilitiesWithITComponents = false;
        
        if (searchScope.startsWith('IT Component:')) {
          // For IT Component search, show all capabilities where applications have ANY IT components
          showAllCapabilitiesWithITComponents = true;
        } else if (searchScope.startsWith('Interface:')) {
          entityLinkedApps = getApplicationsLinkedToInterface(scopeSearchTerm);
        } else if (searchScope.startsWith('Data Object:')) {
          entityLinkedApps = getApplicationsLinkedToDataObject(scopeSearchTerm);
        } else if (searchScope.startsWith('Initiative:')) {
          entityLinkedApps = getApplicationsLinkedToInitiative(scopeSearchTerm);
        }
        
        filtered = processedData.filter((column: ColumnData) => {
          // Check if this column has any capabilities with linked applications
          const hasLinkedCapabilities = column.level2Groups.some(group => 
            group.level3Items.some(item => {
              if (searchScope.startsWith('Application:')) {
                return getApplicationsForCapability(item.name).some(app => 
                  app.name.toLowerCase().includes(scopeSearchTerm)
                );
              } else if (showAllCapabilitiesWithITComponents) {
                // For IT Component search, show all capabilities with applications that have ANY IT components
                const capabilityApps = getApplicationsForCapability(item.name);
                const appsWithITComponents = getApplicationsWithITComponents();
                const hasAppsWithComponents = capabilityApps.some(app => 
                  appsWithITComponents.some(compApp => compApp.id === app.id)
                );
                // Also check if this capability has linked initiatives
                const hasLinkedInitiatives = getInitiativesLinkedToCapability(item.name).length > 0;
                return hasAppsWithComponents || hasLinkedInitiatives;
              } else if (entityLinkedApps.length > 0) {
                const capabilityApps = getApplicationsForCapability(item.name);
                const hasLinkedApps = capabilityApps.some(app => 
                  entityLinkedApps.some(linkedApp => linkedApp.id === app.id)
                );
                // Also check if this capability has linked initiatives
                const hasLinkedInitiatives = getInitiativesLinkedToCapability(item.name).length > 0;
                return hasLinkedApps || hasLinkedInitiatives;
              } else {
                // General search, search capability names
                return column.level1Name.toLowerCase().includes(scopeSearchTerm) ||
                       group.level2Name.toLowerCase().includes(scopeSearchTerm) ||
                       item.name.toLowerCase().includes(scopeSearchTerm);
              }
            })
          );
          return hasLinkedCapabilities;
        });
        
        // For entity-linked searches, also filter the internal structure to show complete hierarchy
        if (entityLinkedApps.length > 0 || searchScope.startsWith('Application:') || showAllCapabilitiesWithITComponents) {
          filtered = filtered.map(column => ({
            ...column,
            level2Groups: column.level2Groups.filter(group => {
              // Keep L2 groups that have L3 items with linked applications
              return group.level3Items.some(item => {
                if (searchScope.startsWith('Application:')) {
                  return getApplicationsForCapability(item.name).some(app => 
                    app.name.toLowerCase().includes(scopeSearchTerm)
                  );
                } else {
                  const capabilityApps = getApplicationsForCapability(item.name);
                  return capabilityApps.some(app => 
                    entityLinkedApps.some(linkedApp => linkedApp.id === app.id)
                  );
                }
              });
            }).map(group => ({
              ...group,
              level3Items: group.level3Items.filter(item => {
                if (searchScope.startsWith('Application:')) {
                  return getApplicationsForCapability(item.name).some(app => 
                    app.name.toLowerCase().includes(scopeSearchTerm)
                  );
                } else if (showAllCapabilitiesWithITComponents) {
                  const capabilityApps = getApplicationsForCapability(item.name);
                  const appsWithITComponents = getApplicationsWithITComponents();
                  const hasAppsWithComponents = capabilityApps.some(app => 
                    appsWithITComponents.some(compApp => compApp.id === app.id)
                  );
                  const hasLinkedInitiatives = getInitiativesLinkedToCapability(item.name).length > 0;
                  return hasAppsWithComponents || hasLinkedInitiatives;
                } else {
                  const capabilityApps = getApplicationsForCapability(item.name);
                  const hasLinkedApps = capabilityApps.some(app => 
                    entityLinkedApps.some(linkedApp => linkedApp.id === app.id)
                  );
                  // Also check if this capability has linked initiatives
                  const hasLinkedInitiatives = getInitiativesLinkedToCapability(item.name).length > 0;
                  return hasLinkedApps || hasLinkedInitiatives;
                }
              })
            }))
          }));
        }
      }
    }
    
    // Apply additional search term filter if present and not already covered by scope
    if (searchTerm.trim() && (!searchScope || !searchScope.includes(searchTerm))) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((column: ColumnData) => {
        return column.level1Name.toLowerCase().includes(searchLower) ||
          column.level2Groups.some(group => {
            return group.level2Name.toLowerCase().includes(searchLower) ||
              group.level3Items.some(item => 
                item.name.toLowerCase().includes(searchLower)
              );
          });
      });
      
      // Also filter within the hierarchy for regular search
      filtered = filtered.map(column => ({
        ...column,
        level2Groups: column.level2Groups.filter(group => {
          return group.level2Name.toLowerCase().includes(searchLower) ||
                 group.level3Items.some(item => item.name.toLowerCase().includes(searchLower)) ||
                 column.level1Name.toLowerCase().includes(searchLower);
        }).map(group => ({
          ...group,
          level3Items: group.level3Items.filter(item => 
            item.name.toLowerCase().includes(searchLower) ||
            group.level2Name.toLowerCase().includes(searchLower) ||
            column.level1Name.toLowerCase().includes(searchLower)
          )
        }))
      }));
    }
    
    return filtered;
  }, [processedData, searchTerm, searchScope, itComponents, interfaces, dataObjects, initiatives]);

  const baseColors = [
    { bg: 'bg-blue-500', text: 'text-white' },
    { bg: 'bg-green-500', text: 'text-white' },
    { bg: 'bg-purple-500', text: 'text-white' },
    { bg: 'bg-orange-500', text: 'text-white' },
    { bg: 'bg-red-500', text: 'text-white' },
    { bg: 'bg-teal-500', text: 'text-white' },
    { bg: 'bg-indigo-500', text: 'text-white' },
    { bg: 'bg-pink-500', text: 'text-white' },
  ];

  const getBackgroundColor = (level: number, colorInfo: any) => {
    if (level === 1) {
      return colorInfo.bg;
    } else if (level === 2) {
      return `${colorInfo.bg.replace('bg-', 'bg-')}/60`;
    } else {
      return `${colorInfo.bg.replace('bg-', 'bg-')}/35`;
    }
  };

  const getTextColor = (level: number) => {
    if (level === 1) {
      return 'text-white';
    } else if (level === 2) {
      return 'text-white';
    } else {
      return 'text-gray-800 dark:text-white';
    }
  };

  const handleExpandColumn = (columnId: string) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(columnId)) {
      newExpanded.delete(columnId);
    } else {
      newExpanded.add(columnId);
    }
    setExpandedColumns(newExpanded);
  };

  const handleExpandLevel2Group = (groupId: string) => {
    const newExpanded = new Set(expandedLevel2Groups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedLevel2Groups(newExpanded);
  };

  const handleCapabilitySelect = (capabilityId: string) => {
    setSelectedCapability(capabilityId);
  };

  const handleAddApplications = () => {
    const selectedCapabilityData = capabilities.find((cap: BusinessCapability) => cap.id === selectedCapability);
    if (!selectedCapabilityData) return;

    selectedApplications.forEach(appId => {
      addApplicationMutation.mutate({
        applicationId: appId,
        capabilityName: selectedCapabilityData.name
      });
    });
  };

  const handleRemoveApplication = (applicationId: string) => {
    const selectedCapabilityData = capabilities.find((cap: BusinessCapability) => cap.id === selectedCapability);
    if (!selectedCapabilityData) return;

    removeApplicationMutation.mutate({
      applicationId,
      capabilityName: selectedCapabilityData.name
    });
  };

  const filteredApplicationsForAdd = allApplications.filter((app: Application) => {
    const matchesSearch = applicationSearchTerm === "" || 
      app.name.toLowerCase().includes(applicationSearchTerm.toLowerCase());
    
    const selectedCapabilityData = capabilities.find((cap: BusinessCapability) => cap.id === selectedCapability);
    const notAlreadyMapped = !selectedCapabilityData || 
      !app.businessCapabilities?.toLowerCase().includes(selectedCapabilityData.name.toLowerCase());
    
    return matchesSearch && notAlreadyMapped;
  });

  const renderExpandButton = (count: number, onClick: () => void) => (
    <Button
      variant="outline"
      size="sm"
      className="w-full h-12 mb-1 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-1">
        <Plus className="h-3 w-3" />
        <span className="text-xs">+{count} more</span>
      </div>
    </Button>
  );

  const renderCapabilityCard = (
    name: string, 
    id: string, 
    colorInfo: any, 
    level: number, 
    capability?: BusinessCapability
  ) => {
    const applications = capability ? getApplicationsForCapability(capability.name) : [];
    const isSelected = selectedCapability === id;
    const appCount = getRollupCount(capability || { name, level } as BusinessCapability);
    
    return (
      <Card 
        key={id} 
        className={`mb-1 cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
          isSelected && applications.length > 0 ? 'h-auto' : 'h-12'
        } ${
          isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
        }`}
        onClick={() => handleCapabilitySelect(id)}
      >
        <CardContent className="p-0">
          <div className={`rounded-t-lg px-3 py-2 h-12 flex items-center justify-between ${getBackgroundColor(level, colorInfo)} ${getTextColor(level)}`}>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-tight truncate">
                {name}
              </h4>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Badge variant="secondary" className="text-xs bg-white/20 text-inherit border-none">
                {appCount}
              </Badge>
              {isSelected && (
                <div className="flex gap-1">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Add Applications to {name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Search applications..."
                          value={applicationSearchTerm}
                          onChange={(e) => setApplicationSearchTerm(e.target.value)}
                        />
                        
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {filteredApplicationsForAdd.map((app: Application) => (
                            <div key={app.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedApplications.has(app.id)}
                                onChange={(e) => {
                                  const newSet = new Set(selectedApplications);
                                  if (e.target.checked) {
                                    newSet.add(app.id);
                                  } else {
                                    newSet.delete(app.id);
                                  }
                                  setSelectedApplications(newSet);
                                }}
                              />
                              <span className="text-sm">{app.name}</span>
                            </div>
                          ))}
                          {filteredApplicationsForAdd.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4">
                              No applications available to add
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleAddApplications}
                            disabled={selectedApplications.size === 0 || addApplicationMutation.isPending}
                          >
                            {addApplicationMutation.isPending ? 'Adding...' : `Add ${selectedApplications.size} Applications`}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
          
          {isSelected && applications.length > 0 && (
            <div className="bg-white/5 border-t border-white/20 rounded-b-lg">
              <div className="px-3 py-2">
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {applications.map((app: Application) => (
                    <div key={app.id} className="flex items-center justify-between bg-white/10 rounded px-2 py-1.5 text-gray-800 dark:text-white">
                      <span className="text-xs truncate flex-1 font-medium">{app.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 text-red-600 hover:text-red-800 hover:bg-red-100/30 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveApplication(app.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">

      {/* Horizontal scrollable columnar layout */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-3 p-4 min-w-max">
          {filteredColumns.map((column: ColumnData, columnIndex: number) => {
            const colorInfo = baseColors[columnIndex % baseColors.length];
            const isColumnExpanded = expandedColumns.has(column.level1Id);
            const visibleLevel2Groups = isColumnExpanded ? column.level2Groups : column.level2Groups.slice(0, MAX_ITEMS_PER_LEVEL);
            const hiddenLevel2Count = Math.max(0, column.level2Groups.length - MAX_ITEMS_PER_LEVEL);
            
            return (
              <div key={column.level1Id} className="flex flex-col w-56 min-w-56">
                {/* Level 1 Capability Header */}
                {renderCapabilityCard(column.level1Name, column.level1Id, colorInfo, 1)}
                
                {/* Level 2 Groups */}
                {visibleLevel2Groups.map((level2Group) => {
                  const isLevel2Expanded = expandedLevel2Groups.has(level2Group.level2Id);
                  const visibleLevel3Items = isLevel2Expanded ? level2Group.level3Items : level2Group.level3Items.slice(0, MAX_ITEMS_PER_LEVEL);
                  const hiddenLevel3Count = Math.max(0, level2Group.level3Items.length - MAX_ITEMS_PER_LEVEL);
                  
                  return (
                    <div key={level2Group.level2Id} className="ml-2 mt-1 border-l-2 border-white/30 pl-2">
                      {/* Level 2 Capability */}
                      {renderCapabilityCard(level2Group.level2Name, level2Group.level2Id, colorInfo, 2)}
                      
                      {/* Level 3 Capabilities Container */}
                      {(visibleLevel3Items.length > 0 || (!isLevel2Expanded && hiddenLevel3Count > 0)) && (
                        <div className="ml-2 mt-1 border-l-2 border-white/20 pl-2">
                          {/* Level 3 Capabilities */}
                          {visibleLevel3Items.map((level3Cap) => (
                            <div key={level3Cap.id}>
                              {renderCapabilityCard(level3Cap.name, level3Cap.id, colorInfo, 3, level3Cap)}
                            </div>
                          ))}
                          
                          {/* Level 3 Expand Button */}
                          {!isLevel2Expanded && hiddenLevel3Count > 0 && (
                            <div>
                              {renderExpandButton(hiddenLevel3Count, () => handleExpandLevel2Group(level2Group.level2Id))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Level 2 Expand Button */}
                {!isColumnExpanded && hiddenLevel2Count > 0 && (
                  <div className="ml-2 mt-1 border-l-2 border-white/30 pl-2">
                    {renderExpandButton(hiddenLevel2Count, () => handleExpandColumn(column.level1Id))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredColumns.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No capabilities found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}