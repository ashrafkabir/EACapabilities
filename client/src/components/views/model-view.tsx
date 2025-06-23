import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Minus, Search, Check, ChevronsUpDown, X, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import DiagramModal from "@/components/diagram-modal";

import type { BusinessCapability, Application, Diagram } from "@shared/schema";
import { filterCapabilitiesBySearch } from "@/lib/unified-search";

interface ModelViewProps {
  onEntitySelect: (entity: any) => void;
  searchTerm: string;
  filteredCapabilities: any[];
  filters: {
    capabilities: boolean;
    applications: boolean;
    components: boolean;
    interfaces: boolean;
    dataObjects: boolean;
    initiatives: boolean;
  };
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

export default function ModelView({ onEntitySelect, searchTerm, filteredCapabilities }: ModelViewProps) {
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set());
  const [expandedLevel2Groups, setExpandedLevel2Groups] = useState<Set<string>>(new Set());
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);

  const MAX_ITEMS_PER_LEVEL = 3;

  const queryClient = useQueryClient();

  // Use centralized filtered capabilities instead of fetching independently
  const capabilities = filteredCapabilities;

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

  const { data: diagrams = [] } = useQuery<Diagram[]>({
    queryKey: ['/api/diagrams'],
  });

  const { data: initiatives = [] } = useQuery<any[]>({
    queryKey: ['/api/initiatives'],
  });

  // Helper function to get diagrams for a specific application
  const getApplicationDiagrams = (applicationId: string): Diagram[] => {
    return diagrams.filter((diagram: Diagram) => {
      if (!diagram.applicationIds) return false;
      try {
        const appIds = JSON.parse(diagram.applicationIds);
        const isLinked = Array.isArray(appIds) && appIds.includes(applicationId);

        return isLinked;
      } catch (error) {
        console.log(`Error parsing applicationIds for diagram ${diagram.name}:`, error);
        return false;
      }
    });
  };

  // Helper function to check if application has diagrams
  const hasApplicationDiagrams = (applicationId: string): boolean => {
    return getApplicationDiagrams(applicationId).length > 0;
  };

  const handleDiagramClick = (applicationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const appDiagrams = getApplicationDiagrams(applicationId);
    console.log(`Diagram click for app ${applicationId}:`, appDiagrams);
    if (appDiagrams.length > 0) {
      setSelectedDiagram(appDiagrams[0]);
      setIsDiagramModalOpen(true);
      console.log('Opening diagram modal with:', appDiagrams[0]);
    }
  };

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
    return allApplications.filter(app => {
      if (!app.businessCapabilities) return false;
      
      // Handle multiple capabilities separated by semicolons
      const appCapabilities = app.businessCapabilities
        .split(';')
        .map(cap => cap.trim().replace(/^~/, ''));
      
      // Check for exact matches or hierarchical matches
      return appCapabilities.some(appCap => {
        // Exact match
        if (appCap === capabilityName) return true;
        
        // Check if the capability name is contained in the app capability
        if (appCap.includes(capabilityName)) return true;
        
        // Check if the app capability starts with the capability name
        if (capabilityName.startsWith(appCap)) return true;
        
        return false;
      });
    });
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
        // Split by both comma and forward slash to handle different delimiters
        const delimiters = /[,/]/;
        comp.applications.split(delimiters).forEach((appName: string) => {
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
        // Split by both comma and forward slash to handle different delimiters
        const delimiters = /[,/]/;
        comp.applications.split(delimiters).forEach((appName: string) => {
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

  // Use the centralized filtered capabilities directly
  console.log('ModelView: Using centralized filtered capabilities:', capabilities.length);

  const filteredColumns = useMemo(() => {
    // Always use the processedData which is already based on centralized filtered capabilities
    console.log('ModelView: Using processedData with', processedData.length, 'columns');
    return processedData;
  }, [processedData]);


  const baseColors = [
    { bg: 'bg-blue-600', text: 'text-white' },
    { bg: 'bg-emerald-600', text: 'text-white' },
    { bg: 'bg-purple-600', text: 'text-white' },
    { bg: 'bg-orange-600', text: 'text-white' },
    { bg: 'bg-red-600', text: 'text-white' },
    { bg: 'bg-teal-600', text: 'text-white' },
    { bg: 'bg-indigo-600', text: 'text-white' },
    { bg: 'bg-pink-600', text: 'text-white' },
    { bg: 'bg-amber-600', text: 'text-white' },
    { bg: 'bg-cyan-600', text: 'text-white' },
    { bg: 'bg-violet-600', text: 'text-white' },
    { bg: 'bg-rose-600', text: 'text-white' },
  ];

  const getBackgroundColor = (level: number, colorInfo: any) => {
    // Fallback to blue if colorInfo is missing
    const safeColor = colorInfo?.bg || 'bg-blue-600';
    
    if (level === 1) {
      // Ensure level 1 tiles always have a strong, visible background with good contrast
      return `${safeColor} shadow-sm`;
    } else if (level === 2) {
      // Make level 2 tiles fully opaque with a darker variant for better visibility
      const level2Color = safeColor.replace('-600', '-500');
      return `${level2Color} border-2 border-gray-300 dark:border-gray-600 shadow-sm`;
    } else {
      return `${safeColor.replace('bg-', 'bg-')}/60 border border-gray-300 dark:border-gray-600`;
    }
  };

  const getTextColor = (level: number) => {
    if (level === 1) {
      // Ensure text is always visible on level 1 tiles
      return 'text-white font-semibold drop-shadow-sm';
    } else if (level === 2) {
      // Ensure level 2 text is clearly visible with better contrast
      return 'text-white font-medium drop-shadow-sm';
    } else {
      return 'text-gray-800 dark:text-white font-normal';
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
    
    // Debug Enterprise Strategy specifically
    if (capability?.name?.toLowerCase().includes('enterprise strategy')) {
      console.log(`🎯 Enterprise Strategy capability selected! Found ${applications.length} applications:`, applications.map(app => app.name));
    }
    const isSelected = selectedCapability === id;
    const appCount = getRollupCount(capability || { name, level } as BusinessCapability);
    
    return (
      <Card 
        key={id} 
        className={`mb-1 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
          isSelected && applications.length > 0 ? 'h-auto' : 'h-12'
        } ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm hover:shadow-md'
        } ${
          level === 1 ? 'border-2 border-gray-300 dark:border-gray-600' : 'border border-gray-200 dark:border-gray-700'
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
                  {applications.map((app: Application) => {
                    const appDiagrams = getApplicationDiagrams(app.id);
                    const hasDiagrams = appDiagrams.length > 0;
                    
                    // Debug logging for Enterprise Strategy apps
                    if (capability?.name?.toLowerCase().includes('enterprise strategy')) {
                      console.log(`App in Enterprise Strategy: ${app.name} (ID: ${app.id}) - Diagrams: ${appDiagrams.length}`);
                    }
                    
                    return (
                      <div key={app.id} className="flex items-center justify-between bg-white/10 rounded px-2 py-1.5 text-gray-800 dark:text-white">
                        <span className="text-xs truncate flex-1 font-medium">{app.name}</span>
                        <div className="flex items-center gap-1 ml-2">
                          {hasDiagrams && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100/30"
                              onClick={(e) => handleDiagramClick(app.id, e)}
                              title={`View diagrams for ${app.name}`}
                            >
                              <FileText className="h-3 w-3" />
                            </Button>
                          )}
                          {/* Temporary debug indicator */}
                          <span className="text-xs text-gray-400" title={`${app.name}: ${appDiagrams.length} diagrams`}>
                            {hasDiagrams ? '📊' : '⭕'}
                          </span>

                          <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 text-red-600 hover:text-red-800 hover:bg-red-100/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveApplication(app.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                    <div key={level2Group.level2Id} className="ml-2 mt-1 border-l-2 border-gray-400 dark:border-gray-500 pl-2">
                      {/* Level 2 Capability */}
                      {renderCapabilityCard(level2Group.level2Name, level2Group.level2Id, colorInfo, 2)}
                      
                      {/* Level 3 Capabilities Container */}
                      {(visibleLevel3Items.length > 0 || (!isLevel2Expanded && hiddenLevel3Count > 0)) && (
                        <div className="ml-2 mt-1 border-l-2 border-gray-300 dark:border-gray-600 pl-2">
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
                  <div className="ml-2 mt-1 border-l-2 border-gray-400 dark:border-gray-500 pl-2">
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

      {/* Diagram Modal */}
      {selectedDiagram && isDiagramModalOpen && (
        <DiagramModal
          diagram={selectedDiagram}
          onClose={() => {
            console.log('Closing diagram modal');
            setSelectedDiagram(null);
            setIsDiagramModalOpen(false);
          }}
          applications={allApplications}
          isEditing={false}
        />
      )}
    </div>
  );
}