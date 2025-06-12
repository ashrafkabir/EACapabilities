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
  onSearchChange: (term: string) => void;
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

export default function ModelView({ searchTerm, onSearchChange }: ModelViewProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  const { data: capabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

  const { data: allApplications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
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
    if (!localSearchTerm.trim()) return processedData;
    
    return processedData.filter((column: ColumnData) => {
      const searchLower = localSearchTerm.toLowerCase();
      
      if (column.level1Name.toLowerCase().includes(searchLower)) return true;
      
      return column.level2Groups.some(group => {
        if (group.level2Name.toLowerCase().includes(searchLower)) return true;
        return group.level3Items.some(item => 
          item.name.toLowerCase().includes(searchLower)
        );
      });
    });
  }, [processedData, localSearchTerm]);

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

  const renderCapabilityCard = (
    name: string, 
    id: string, 
    colorInfo: any, 
    level: number, 
    capability?: BusinessCapability
  ) => {
    const applications = capability ? getApplicationsForCapability(capability.name) : [];
    const isSelected = selectedCapability === id;
    
    return (
      <Card 
        key={id} 
        className={`mb-1 cursor-pointer transition-all duration-200 hover:shadow-md border-2 h-auto min-h-[60px] ${
          isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
        }`}
        onClick={() => handleCapabilitySelect(id)}
      >
        <CardContent className="p-3">
          <div className={`rounded-lg p-3 ${getBackgroundColor(level, colorInfo)} ${getTextColor(level)}`}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight truncate">
                  {name}
                </h4>
                <p className="text-xs opacity-90 mt-1">
                  {getRollupCount(capability || { name, level } as BusinessCapability)} apps
                </p>
              </div>
            </div>
            
            {isSelected && applications.length > 0 && (
              <div className="mt-3 space-y-1">
                {applications.slice(0, 5).map((app: Application) => (
                  <div key={app.id} className="flex items-center justify-between bg-white/20 rounded px-2 py-1">
                    <span className="text-xs truncate flex-1">{app.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveApplication(app.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {applications.length > 5 && (
                  <div className="text-xs opacity-75">
                    +{applications.length - 5} more applications
                  </div>
                )}
              </div>
            )}
            
            {isSelected && (
              <div className="mt-3">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full h-8 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Applications
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
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="bg-background border-b border-border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search capabilities..."
            value={localSearchTerm}
            onChange={(e) => {
              setLocalSearchTerm(e.target.value);
              onSearchChange(e.target.value);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Horizontal scrollable columnar layout */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-3 p-4 min-w-max">
          {filteredColumns.map((column: ColumnData, columnIndex) => {
            const colorInfo = baseColors[columnIndex % baseColors.length];
            
            return (
              <div key={column.level1Id} className="flex flex-col w-56 min-w-56">
                {/* Level 1 Capability Header */}
                {renderCapabilityCard(column.level1Name, column.level1Id, colorInfo, 1)}
                
                {/* Level 2 Groups */}
                {column.level2Groups.map((level2Group) => (
                  <div key={level2Group.level2Id} className="ml-1">
                    {/* Level 2 Capability */}
                    {renderCapabilityCard(level2Group.level2Name, level2Group.level2Id, colorInfo, 2)}
                    
                    {/* Level 3 Capabilities */}
                    {level2Group.level3Items.map((level3Cap) => (
                      <div key={level3Cap.id} className="ml-1">
                        {renderCapabilityCard(level3Cap.name, level3Cap.id, colorInfo, 3, level3Cap)}
                      </div>
                    ))}
                  </div>
                ))}
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