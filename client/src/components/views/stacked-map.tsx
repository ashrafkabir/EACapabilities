import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { BusinessCapability, Application } from '@shared/schema';

interface StackedMapProps {
  capabilities: BusinessCapability[];
  onCapabilitySelect: (cap: BusinessCapability) => void;
  searchTerm: string;
  selectedCapability: string | null;
  searchScope: string | null;
}

interface CapabilityColumn {
  level1Name: string;
  level1Id: string;
  level2Groups: {
    level2Name: string;
    level2Id: string;
    level3Items: BusinessCapability[];
    expanded?: boolean;
  }[];
  expanded?: boolean;
}

const baseColors = [
  { bg: 'bg-blue-500', text: 'text-white', rgb: '59, 130, 246' },
  { bg: 'bg-green-500', text: 'text-white', rgb: '34, 197, 94' },
  { bg: 'bg-purple-500', text: 'text-white', rgb: '168, 85, 247' },
  { bg: 'bg-orange-500', text: 'text-white', rgb: '249, 115, 22' },
  { bg: 'bg-pink-500', text: 'text-white', rgb: '236, 72, 153' },
  { bg: 'bg-teal-500', text: 'text-white', rgb: '20, 184, 166' },
  { bg: 'bg-red-500', text: 'text-white', rgb: '239, 68, 68' },
  { bg: 'bg-yellow-500', text: 'text-black', rgb: '234, 179, 8' },
  { bg: 'bg-cyan-500', text: 'text-white', rgb: '6, 182, 212' },
  { bg: 'bg-violet-500', text: 'text-white', rgb: '139, 92, 246' },
  { bg: 'bg-emerald-500', text: 'text-white', rgb: '16, 185, 129' },
  { bg: 'bg-rose-500', text: 'text-white', rgb: '244, 63, 94' },
  { bg: 'bg-amber-500', text: 'text-black', rgb: '245, 158, 11' },
  { bg: 'bg-lime-500', text: 'text-black', rgb: '132, 204, 22' },
  { bg: 'bg-sky-500', text: 'text-white', rgb: '14, 165, 233' },
  { bg: 'bg-fuchsia-500', text: 'text-white', rgb: '217, 70, 239' },
  { bg: 'bg-gray-400', text: 'text-white', rgb: '156, 163, 175' },
  { bg: 'bg-indigo-500', text: 'text-white', rgb: '99, 102, 241' },
];

// Generate faded colors for nested levels with better visual hierarchy
const getFadedColor = (baseRgb: string, level: number): string => {
  if (level === 1) return '';
  const opacity = level === 2 ? 0.6 : 0.35;
  return `rgba(${baseRgb}, ${opacity})`;
};

export default function StackedMap({ 
  capabilities, 
  onCapabilitySelect, 
  searchTerm,
  selectedCapability,
  searchScope
}: StackedMapProps) {
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set());
  const [expandedLevel2Groups, setExpandedLevel2Groups] = useState<Set<string>>(new Set());

  const MAX_ITEMS_PER_LEVEL = 5;

  // Fetch applications data for real application counting
  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const getApplicationsForCapability = (capabilityName: string): Application[] => {
    return applications.filter((app: Application) => 
      app.businessCapabilities?.toLowerCase().includes(capabilityName.toLowerCase())
    );
  };

  const getApplicationCountForCapability = (capabilityName: string): number => {
    return getApplicationsForCapability(capabilityName).length;
  };

  const getAggregatedApplicationCount = (capabilityId: string, level: number): number => {
    const capability = capabilities.find(cap => cap.id === capabilityId);
    if (!capability) return 0;

    let count = getApplicationCountForCapability(capability.name);
    
    if (level === 1) {
      const nestedCaps = capabilities.filter(cap => 
        cap.level1Capability === capability.level1Capability && cap.level !== 1
      );
      nestedCaps.forEach(nestedCap => {
        count += getApplicationCountForCapability(nestedCap.name);
      });
    } else if (level === 2) {
      const level3Caps = capabilities.filter(cap => 
        cap.level1Capability === capability.level1Capability && 
        cap.level2Capability === capability.level2Capability && 
        cap.level === 3
      );
      level3Caps.forEach(level3Cap => {
        count += getApplicationCountForCapability(level3Cap.name);
      });
    }
    
    return count;
  };

  const buildColumnarHierarchy = (caps: BusinessCapability[]): CapabilityColumn[] => {
    const columnMap = new Map<string, CapabilityColumn>();
    
    caps.forEach(cap => {
      const level1Name = cap.level1Capability || cap.name;
      const level2Name = cap.level2Capability;
      const level3Name = cap.level === 3 ? cap.name : null;
      
      if (!columnMap.has(level1Name)) {
        columnMap.set(level1Name, {
          level1Name,
          level1Id: cap.level === 1 ? cap.id : '',
          level2Groups: []
        });
      }
      
      const column = columnMap.get(level1Name)!;
      
      if (cap.level === 1) {
        column.level1Id = cap.id;
      }
      
      if (level2Name && cap.level && cap.level >= 2) {
        let level2Group = column.level2Groups.find(g => g.level2Name === level2Name);
        if (!level2Group) {
          level2Group = {
            level2Name,
            level2Id: cap.level === 2 ? cap.id : '',
            level3Items: []
          };
          column.level2Groups.push(level2Group);
        }
        
        if (cap.level === 2) {
          level2Group.level2Id = cap.id;
        }
        
        if (level3Name && level2Group) {
          level2Group.level3Items.push(cap);
        }
      }
    });
    
    // Sort columns by application count descending
    const sortedColumns = Array.from(columnMap.values()).sort((a, b) => {
      const aCount = getAggregatedApplicationCount(a.level1Id, 1);
      const bCount = getAggregatedApplicationCount(b.level1Id, 1);
      return bCount - aCount;
    });
    
    // Sort level 2 groups and level 3 items by application count
    sortedColumns.forEach(column => {
      column.level2Groups.sort((a, b) => {
        const aCount = getAggregatedApplicationCount(a.level2Id, 2);
        const bCount = getAggregatedApplicationCount(b.level2Id, 2);
        return bCount - aCount;
      });
      
      column.level2Groups.forEach(group => {
        group.level3Items.sort((a, b) => {
          const aCount = getAggregatedApplicationCount(a.id, 3);
          const bCount = getAggregatedApplicationCount(b.id, 3);
          return bCount - aCount;
        });
      });
    });
    
    return sortedColumns;
  };

  // Filter capabilities based on search scope
  const filteredCapabilities = useMemo(() => {
    if (!searchScope) return capabilities;
    
    if (searchScope.startsWith('Business Capability:')) {
      const capabilityPath = searchScope.replace('Business Capability: ', '');
      const pathParts = capabilityPath.split('/');
      
      return capabilities.filter(cap => 
        pathParts.some(part => 
          cap.level1Capability?.toLowerCase().includes(part.toLowerCase()) ||
          cap.level2Capability?.toLowerCase().includes(part.toLowerCase()) ||
          cap.name.toLowerCase().includes(part.toLowerCase())
        )
      );
    }

    if (searchScope.startsWith('Search:') || searchScope.startsWith('Application:')) {
      const searchTerm = searchScope.replace(/^(Search|Application): /, '').toLowerCase();
      return capabilities.filter(cap => {
        // Search through applications to find capabilities that contain matching applications
        const capApplications = getApplicationsForCapability(cap.name);
        return capApplications.some(app => 
          app.name.toLowerCase().includes(searchTerm)
        ) || cap.name.toLowerCase().includes(searchTerm);
      });
    }

    return capabilities;
  }, [capabilities, searchScope, applications]);

  const columnarCapabilities = buildColumnarHierarchy(filteredCapabilities);

  // Filter and rebuild hierarchy based on search
  const getFilteredColumns = (columns: CapabilityColumn[], searchTerm: string): CapabilityColumn[] => {
    if (!searchTerm) return columns;

    const search = searchTerm.toLowerCase();
    return columns.map(column => {
      const level1Matches = column.level1Name.toLowerCase().includes(search);
      
      const filteredLevel2Groups = column.level2Groups.map(level2Group => {
        const level2Matches = level2Group.level2Name.toLowerCase().includes(search);
        
        const filteredLevel3Items = level2Group.level3Items.filter(item =>
          level1Matches || level2Matches || item.name.toLowerCase().includes(search)
        );
        
        if (level1Matches || level2Matches || filteredLevel3Items.length > 0) {
          return {
            ...level2Group,
            level3Items: filteredLevel3Items
          };
        }
        return null;
      }).filter(Boolean) as typeof column.level2Groups;
      
      if (level1Matches || filteredLevel2Groups.length > 0) {
        return {
          ...column,
          level2Groups: filteredLevel2Groups
        };
      }
      return null;
    }).filter(Boolean) as CapabilityColumn[];
  };

  const filteredColumns = getFilteredColumns(columnarCapabilities, searchTerm);

  const getAllApplicationsForCapability = (capability: BusinessCapability): { application: Application; paths: string[] }[] => {
    const results: { application: Application; paths: string[] }[] = [];
    const addedApps = new Set<string>();

    const addApplicationsForCapability = (cap: BusinessCapability, pathPrefix: string[] = []) => {
      const apps = getApplicationsForCapability(cap.name);
      const currentPath = [...pathPrefix, cap.name];
      
      apps.forEach(app => {
        if (!addedApps.has(app.id)) {
          addedApps.add(app.id);
          results.push({
            application: app,
            paths: [currentPath.join(' → ')]
          });
        } else {
          const existing = results.find(r => r.application.id === app.id);
          if (existing && !existing.paths.includes(currentPath.join(' → '))) {
            existing.paths.push(currentPath.join(' → '));
          }
        }
      });
    };

    // Build complete hierarchy path for the clicked capability
    const getCompleteCapabilityPath = (cap: BusinessCapability): string[] => {
      const path: string[] = [];
      
      // Add Level 1
      if (cap.level1Capability) {
        path.push(cap.level1Capability);
      }
      
      // Add Level 2
      if (cap.level2Capability && cap.level2Capability !== cap.level1Capability) {
        path.push(cap.level2Capability);
      }
      
      // Add Level 3 (the actual capability name)
      if (cap.level === 3) {
        path.push(cap.name);
      }
      
      return path;
    };
    
    // Add direct applications for this capability with complete path
    const directPath = getCompleteCapabilityPath(capability);
    addApplicationsForCapability(capability, directPath.slice(0, -1));
    
    if (capability.level === 1) {
      // For Level 1, get all nested capabilities
      const nestedCaps = capabilities.filter(cap => 
        cap.level1Capability === capability.level1Capability && cap.level !== 1
      );
      
      nestedCaps.forEach(nestedCap => {
        const nestedPath = getCompleteCapabilityPath(nestedCap);
        addApplicationsForCapability(nestedCap, nestedPath.slice(0, -1));
      });
    } else if (capability.level === 2) {
      // For Level 2, get all Level 3 under it
      const level3Caps = capabilities.filter(cap => 
        cap.level1Capability === capability.level1Capability && 
        cap.level2Capability === capability.level2Capability && 
        cap.level === 3
      );
      
      level3Caps.forEach(level3Cap => {
        const level3Path = getCompleteCapabilityPath(level3Cap);
        addApplicationsForCapability(level3Cap, level3Path.slice(0, -1));
      });
    }
    
    return results;
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

  const getTextColor = (level: number, colorInfo: any) => {
    if (level === 1) {
      return colorInfo.text;
    } else if (level === 2) {
      // For 60% opacity backgrounds, use white text for good contrast
      return 'text-white dark:text-white';
    } else {
      // For 35% opacity backgrounds, use darker text for better readability
      return 'text-gray-800 dark:text-white';
    }
  };

  const renderCapabilityCard = (
    name: string, 
    id: string, 
    colorInfo: any, 
    level: number, 
    capability?: BusinessCapability
  ) => {
    const appCount = getAggregatedApplicationCount(id, level);
    
    return (
      <Card 
        key={id} 
        className="mb-1 cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-gray-200 h-12"
        onClick={() => {
          const cap = capability || capabilities.find(c => c.id === id);
          if (cap) onCapabilitySelect(cap);
        }}
      >
        <CardContent className="p-0 h-full">
          <div 
            className={`rounded-lg px-3 py-2 h-full flex items-center justify-between ${getTextColor(level, colorInfo)}`}
            style={{
              backgroundColor: level === 1 ? '' : getFadedColor(colorInfo.rgb, level)
            }}
            {...(level === 1 && { className: `rounded-lg px-3 py-2 h-full flex items-center justify-between ${colorInfo.bg} ${colorInfo.text}` })}
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-tight truncate">
                {name}
              </h4>
            </div>
            <div className="text-xs opacity-90 ml-2">
              {appCount}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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

  return (
    <div className="h-full flex flex-col">
      {/* Horizontal scrollable columnar layout */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-3 p-4 min-w-max">
          {filteredColumns.map((column, columnIndex) => {
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
                    <div key={level2Group.level2Id} className="ml-1">
                      {/* Level 2 Capability */}
                      {renderCapabilityCard(level2Group.level2Name, level2Group.level2Id, colorInfo, 2)}
                      
                      {/* Level 3 Capabilities */}
                      {visibleLevel3Items.map((level3Cap) => (
                        <div key={level3Cap.id} className="ml-1">
                          {renderCapabilityCard(level3Cap.name, level3Cap.id, colorInfo, 3, level3Cap)}
                        </div>
                      ))}
                      
                      {/* Level 3 Expand Button */}
                      {!isLevel2Expanded && hiddenLevel3Count > 0 && (
                        <div className="ml-1">
                          {renderExpandButton(hiddenLevel3Count, () => handleExpandLevel2Group(level2Group.level2Id))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Level 2 Expand Button */}
                {!isColumnExpanded && hiddenLevel2Count > 0 && (
                  <div className="ml-1">
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