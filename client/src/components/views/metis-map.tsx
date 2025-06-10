import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Info, Expand, ExternalLink } from "lucide-react";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application, Initiative, DataObject, Interface, ITComponent } from "@shared/schema";

interface MetisMapProps {
  selectedCapability: string | null;
  searchTerm: string;
  searchType?: 'capabilities' | 'applications' | 'components';
  onEntitySelect: (entity: EntityReference) => void;
  filters: {
    capabilities: boolean;
    applications: boolean;
    components: boolean;
    interfaces: boolean;
  };
}

interface HeatmapFilters {
  metric: 'technicalSuitability' | 'functionalFit' | 'none';
  showColors: boolean;
}

export default function MetisMap({ selectedCapability, searchTerm, searchType = 'capabilities', onEntitySelect, filters }: MetisMapProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [heatmapFilters, setHeatmapFilters] = useState<HeatmapFilters>({
    metric: 'none',
    showColors: false
  });
  const [expandedCapability, setExpandedCapability] = useState<BusinessCapability | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<Application | null>(null);

  const { data: allCapabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

  // Sync with sidebar selection
  useEffect(() => {
    if (selectedCapability && allCapabilities.length > 0) {
      const capability = allCapabilities.find(cap => cap.id === selectedCapability);
      if (capability) {
        // Navigate to the appropriate level and parent based on the selected capability
        if (capability.level === 1) {
          setCurrentLevel(1);
          setSelectedParent(null);
        } else if (capability.level === 2) {
          setCurrentLevel(2);
          setSelectedParent(capability.level1Capability);
        } else if (capability.level === 3) {
          setCurrentLevel(3);
          setSelectedParent(capability.level2Capability);
        }
      }
    }
  }, [selectedCapability, allCapabilities]);

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const { data: dataObjects = [] } = useQuery<DataObject[]>({
    queryKey: ['/api/data-objects'],
  });

  const { data: interfaces = [] } = useQuery<Interface[]>({
    queryKey: ['/api/interfaces'],
  });

  const { data: itComponents = [] } = useQuery<ITComponent[]>({
    queryKey: ['/api/it-components'],
  });

  const handleGoBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      if (currentLevel === 2) {
        // Going back from L2 to L1
        setSelectedParent(null);
      } else if (currentLevel === 3) {
        // Going back from L3 to L2 - find the L1 parent of the current L2
        const currentL2Cap = allCapabilities.find(cap => cap.name === selectedParent && cap.level === 2);
        setSelectedParent(currentL2Cap?.level1Capability || null);
      }
    }
  };

  const handleCapabilityClick = (capability: BusinessCapability) => {
    // Check for children based on explicit level columns
    let children: BusinessCapability[] = [];
    if (currentLevel === 1) {
      children = allCapabilities.filter(cap => 
        cap.level === 2 && cap.level1Capability === capability.name
      );
    } else if (currentLevel === 2) {
      children = allCapabilities.filter(cap => 
        cap.level === 3 && cap.level1Capability === capability.level1Capability && cap.level2Capability === capability.name
      );
    }
    
    const hasChildren = children.length > 0;
    
    if (hasChildren && currentLevel < 3) {
      // Use capability name for navigation since that's what the filtering expects
      setSelectedParent(capability.name);
      setCurrentLevel(currentLevel + 1);
    } else {
      // Show details for capabilities without children or Level 3 capabilities
      onEntitySelect({
        type: 'capability',
        id: capability.id,
        data: capability
      });
    }
  };

  const getCapabilitiesToShow = () => {
    if (currentLevel === 1) {
      return allCapabilities.filter(cap => cap.level === 1);
    } else if (currentLevel === 2) {
      // selectedParent now contains the name of the L1 capability
      return allCapabilities.filter(cap => 
        cap.level === 2 && cap.level1Capability === selectedParent
      );
    } else if (currentLevel === 3) {
      // selectedParent now contains the name of the L2 capability
      // We need to find the L1 capability that contains this L2 capability
      const parentL2Cap = allCapabilities.find(c => c.name === selectedParent && c.level === 2);
      return allCapabilities.filter(cap => 
        cap.level === 3 && 
        cap.level1Capability === parentL2Cap?.level1Capability && 
        cap.level2Capability === selectedParent
      );
    }
    return [];
  };

  const capabilitiesToShow = getCapabilitiesToShow();
  
  // Find capabilities that match the search criteria based on search type
  const allMatchingCapabilities = searchTerm ? (() => {
    if (searchType === 'components') {
      // IT Component search: find components that match, then find applications using them, then find capabilities
      const matchingComponents = itComponents.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comp.displayName && comp.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      const applicationsUsingComponents = applications.filter(app => {
        return matchingComponents.some(comp => {
          // Check if application is mentioned in component's applications field
          return comp.applications && comp.applications.toLowerCase().includes(app.name.toLowerCase());
        });
      });
      
      // Find capabilities that use these applications
      return allCapabilities.filter(cap => {
        return applicationsUsingComponents.some(app => {
          if (!app.businessCapabilities) return false;
          const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
          return appCapabilities.some(appCap => 
            cap.name === appCap || 
            cap.name.includes(appCap) || 
            appCap.includes(cap.name) ||
            appCap.includes(cap.hierarchy || '')
          );
        });
      });
    } else if (searchType === 'applications') {
      // Application-only search
      const matchingApps = applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.displayName && app.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      return allCapabilities.filter(cap => {
        return matchingApps.some(app => {
          if (!app.businessCapabilities) return false;
          const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
          return appCapabilities.some(appCap => 
            cap.name === appCap || 
            cap.name.includes(appCap) || 
            appCap.includes(cap.name) ||
            appCap.includes(cap.hierarchy || '')
          );
        });
      });
    } else {
      // Default capabilities & applications search
      return allCapabilities.filter(cap => {
        const matchesCapabilityName = cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cap.displayName && cap.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Search by related applications
        const relatedApps = applications.filter(app => {
          if (!app.businessCapabilities) return false;
          const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
          return appCapabilities.some(appCap => 
            cap.name === appCap || 
            cap.name.includes(appCap) || 
            appCap.includes(cap.name) ||
            appCap.includes(cap.hierarchy || '')
          );
        });
        
        const matchesApplicationName = relatedApps.some(app => 
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.displayName && app.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        return matchesCapabilityName || matchesApplicationName;
      });
    }
  })() : null;



  // If searching, find the capabilities that should be shown at the current display level
  const filteredCapabilities = searchTerm && allMatchingCapabilities ? 
    capabilitiesToShow.filter(cap => {
      // If the capability itself matches and is at the current display level, include it
      if (allMatchingCapabilities.some(match => match.id === cap.id && match.level === currentLevel)) {
        return true;
      }
      
      // If any descendant capabilities match, include this ancestor at the current display level
      const hasMatchingDescendants = allMatchingCapabilities.some(match => {
        if (currentLevel === 1) {
          // For Level 1 display, include if any L2 or L3 capabilities have this as their L1 parent
          return match.level1Capability === cap.name;
        } else if (currentLevel === 2) {
          // For Level 2 display, include if any L3 capabilities have this as their L2 parent
          return match.level2Capability === cap.name;
        }
        return false;
      });
      
      return hasMatchingDescendants;
    }) : capabilitiesToShow;

  // Generate legend data for the current metric
  const legendData = useMemo(() => {
    if (!heatmapFilters.showColors || heatmapFilters.metric === 'none' || !applications.length) {
      return [];
    }

    const allValues = new Set<string>();
    applications.forEach(app => {
      let value: string | null = null;
      switch (heatmapFilters.metric) {
        case 'technicalSuitability':
          value = app.technicalSuitability;
          break;
        case 'functionalFit':
          value = app.functionalFit;
          break;
      }
      if (value && value.trim()) {
        allValues.add(value.trim());
      }
    });

    const uniqueValues = Array.from(allValues).sort();

    if (heatmapFilters.metric === 'technicalSuitability' || heatmapFilters.metric === 'functionalFit') {
      // Score-based coloring
      return uniqueValues.map(value => {
        const score = (() => {
          switch (value.toLowerCase()) {
            case 'perfect': case 'fullyappropriate': return 5;
            case 'appropriate': case 'adequate': return 3;
            case 'partiallyappropriate': case 'poor': return 1;
            default: return 2;
          }
        })();

        let color;
        if (score >= 4) color = 'bg-green-500';
        else if (score >= 2.5) color = 'bg-yellow-500';
        else color = 'bg-red-500';

        return { value, color, score };
      }).sort((a, b) => b.score - a.score);
    } else {
      // Categorical coloring
      const colors = [
        'bg-purple-500', 'bg-indigo-500', 'bg-pink-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-lime-500'
      ];
      
      return uniqueValues.map((value, index) => ({
        value,
        color: colors[index % colors.length],
        score: 0
      }));
    }
  }, [heatmapFilters.metric, heatmapFilters.showColors, applications]);

  const getHeatmapColor = (capability: BusinessCapability, relatedApps: Application[]) => {
    if (!heatmapFilters.showColors || heatmapFilters.metric === 'none') {
      return getDefaultLevelColor(capability.level);
    }

    // Calculate metric based on related applications
    const metricValues = relatedApps.map(app => {
      switch (heatmapFilters.metric) {
        case 'technicalSuitability':
          return app.technicalSuitability;
        case 'functionalFit':
          return app.functionalFit;
        default:
          return null;
      }
    }).filter(Boolean);

    if (metricValues.length === 0) {
      return { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-300 dark:border-gray-600', color: 'text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' };
    }

    // Color coding based on metric scores (only for technical suitability and functional fit)
    const scores = metricValues.map(val => {
      switch (val?.toLowerCase()) {
        case 'perfect': case 'fullyappropriate': return 5;
        case 'appropriate': case 'adequate': return 3;
        case 'partiallyappropriate': case 'poor': return 1;
        default: return 2;
      }
    });
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    if (avgScore >= 4) return { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-400 dark:border-green-600', color: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' };
    if (avgScore >= 2.5) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-400 dark:border-yellow-600', color: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' };
    return { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-400 dark:border-red-600', color: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' };
  };

  const getDefaultLevelColor = (level: number | null) => {
    if (!level) return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-700', color: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' };
    switch (level) {
      case 1: return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' };
      case 2: return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', color: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' };
      case 3: return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' };
      default: return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-700', color: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-slate-50 dark:bg-slate-900 p-6">
      {/* Navigation breadcrumb */}
      {currentLevel > 1 && (
        <div className="mb-6 flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md w-fit">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Level {currentLevel}</span>
            {selectedParent && (
              <>
                <span>•</span>
                <span className="font-medium">{selectedParent}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Level indicator and filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Level {currentLevel} Capabilities ({filteredCapabilities.length})
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLevel === 1 && "Enterprise capability overview - Click any capability to explore sub-capabilities"}
            {currentLevel === 2 && "Sub-capabilities - Click any capability to see detailed capabilities"}
            {currentLevel === 3 && "Detailed capabilities - Click any capability to view applications and details"}
          </p>
        </div>

        {/* Heatmap filters */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showHeatmap"
              checked={heatmapFilters.showColors}
              onChange={(e) => setHeatmapFilters(prev => ({ ...prev, showColors: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showHeatmap" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Heatmap
            </label>
          </div>

          <select
            value={heatmapFilters.metric}
            onChange={(e) => setHeatmapFilters(prev => ({ 
              ...prev, 
              metric: e.target.value as HeatmapFilters['metric']
            }))}
            disabled={!heatmapFilters.showColors}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            <option value="none">Select Metric</option>
            <option value="technicalSuitability">Technical Suitability</option>
            <option value="functionalFit">Functional Fit</option>
          </select>

          {heatmapFilters.showColors && heatmapFilters.metric !== 'none' && (
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Colors: {heatmapFilters.metric === 'technicalSuitability' ? 'Technical Suitability' :
                         heatmapFilters.metric === 'functionalFit' ? 'Functional Fit' :
                         heatmapFilters.metric === 'region' ? 'Region' :
                         heatmapFilters.metric === 'organization' ? 'Organization' : 'Ownership'}
              </div>
              
              {/* Legend tooltip */}
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                
                {/* Tooltip content */}
                <div className="absolute top-6 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-64">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Color Legend - {heatmapFilters.metric === 'technicalSuitability' ? 'Technical Suitability' :
                                   heatmapFilters.metric === 'functionalFit' ? 'Functional Fit' :
                                   heatmapFilters.metric === 'region' ? 'Region' :
                                   heatmapFilters.metric === 'organization' ? 'Organization' : 'Ownership'}
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {legendData.map(({ value, color }, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${color}`}></div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>
                      </div>
                    ))}
                    
                    {/* No data indicator */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="w-3 h-3 rounded bg-gray-400"></div>
                      <span className="text-xs text-gray-700 dark:text-gray-300">No Data</span>
                    </div>
                  </div>
                  
                  {legendData.length > 8 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      Showing {legendData.length} unique values
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Columnar grid layout */}
      <div className="grid grid-cols-3 gap-6 auto-rows-min">
        {filteredCapabilities.map((capability) => {
          // Get related applications for heatmap calculation
          const relatedApps = applications.filter(app => {
            if (!app.businessCapabilities) return false;
            const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
            return appCapabilities.some(appCap => 
              capability.name === appCap || 
              capability.name.includes(appCap) || 
              appCap.includes(capability.name) ||
              appCap.includes(capability.hierarchy || '')
            );
          });

          const colors = getHeatmapColor(capability, relatedApps);
          
          // Get children count or applications count based on level
          let itemCount = 0;
          let itemLabel = '';
          let previewItems: string[] = [];
          let hasChildren = false;
          
          if (currentLevel === 1) {
            const l2Children = allCapabilities.filter(cap => 
              cap.level === 2 && cap.level1Capability === capability.name
            );
            itemCount = l2Children.length;
            itemLabel = 'Sub-capabilities';
            previewItems = l2Children.slice(0, 3).map(cap => cap.name);
            hasChildren = l2Children.length > 0;
          } else if (currentLevel === 2) {
            const l3Children = allCapabilities.filter(cap => 
              cap.level === 3 && cap.level1Capability === capability.level1Capability && cap.level2Capability === capability.name
            );
            itemCount = l3Children.length;
            itemLabel = 'Detailed capabilities';
            previewItems = l3Children.slice(0, 3).map(cap => cap.name);
            hasChildren = l3Children.length > 0;
          } else if (currentLevel === 3) {
            itemCount = relatedApps.length;
            itemLabel = 'Applications';
            previewItems = relatedApps.slice(0, 3).map(app => app.name);
            hasChildren = false;
          }
          
          return (
            <div
              key={capability.id}
              className={`relative ${colors.bg} rounded-xl border-2 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group`}
              onClick={() => handleCapabilityClick(capability)}
            >
              {/* Hover tooltip for heatmap information */}
              {heatmapFilters.showColors && heatmapFilters.metric !== 'none' && relatedApps.length > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-64">
                  <div className="font-medium mb-2">
                    {heatmapFilters.metric === 'technicalSuitability' ? 'Technical Suitability' :
                     heatmapFilters.metric === 'functionalFit' ? 'Functional Fit' : 'Metric'}
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {(() => {
                      const metricValues = relatedApps.map(app => {
                        switch (heatmapFilters.metric) {
                          case 'technicalSuitability': return app.technicalSuitability;
                          case 'functionalFit': return app.functionalFit;
                          default: return null;
                        }
                      }).filter((value): value is string => Boolean(value));
                      
                      // Count occurrences
                      const valueCounts = metricValues.reduce((acc, value) => {
                        if (value) {
                          acc[value] = (acc[value] || 0) + 1;
                        }
                        return acc;
                      }, {} as Record<string, number>);
                      
                      const sortedValues = Object.entries(valueCounts)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 6);
                      
                      return sortedValues.map(([value, count], idx) => (
                        <div key={idx} className="text-xs flex justify-between">
                          <span>• {value}</span>
                          <span className="opacity-75">({count})</span>
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="text-xs opacity-75 mt-2 pt-2 border-t border-gray-600">
                    From {relatedApps.length} application{relatedApps.length !== 1 ? 's' : ''}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white group-hover:${colors.color} transition-colors`}>
                    {capability.displayName || capability.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${colors.dot}`}></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCapability(capability);
                      }}
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="View detailed information"
                    >
                      <Expand className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    {hasChildren && (
                      <div className="text-blue-600 dark:text-blue-400 text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                        Expand
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {itemLabel}: {itemCount}
                  </div>
                  
                  {searchTerm && allMatchingCapabilities && (() => {
                    // Check if this capability is shown because of direct matches
                    const directMatch = allMatchingCapabilities.some(match => match.id === capability.id);
                    
                    if (directMatch) {
                      if (searchType === 'components') {
                        // Show IT component matches
                        const matchingComponents = itComponents.filter(comp =>
                          comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (comp.displayName && comp.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
                        );
                        
                        const relatedApps = applications.filter(app => {
                          if (!app.businessCapabilities) return false;
                          const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
                          return appCapabilities.some(appCap => 
                            capability.name === appCap || 
                            capability.name.includes(appCap) || 
                            appCap.includes(capability.name) ||
                            appCap.includes(capability.hierarchy || '')
                          );
                        });
                        
                        const componentsUsedByCapability = matchingComponents.filter(comp => {
                          return relatedApps.some(app => 
                            comp.applications && comp.applications.toLowerCase().includes(app.name.toLowerCase())
                          );
                        });
                        
                        if (componentsUsedByCapability.length > 0) {
                          return (
                            <div className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                              Uses {componentsUsedByCapability.length} IT component{componentsUsedByCapability.length > 1 ? 's' : ''}: {componentsUsedByCapability.slice(0, 2).map(comp => comp.name).join(', ')}
                              {componentsUsedByCapability.length > 2 && ` +${componentsUsedByCapability.length - 2} more`}
                            </div>
                          );
                        }
                      } else if (searchType === 'applications') {
                        // Show application matches
                        const relatedApps = applications.filter(app => {
                          if (!app.businessCapabilities) return false;
                          const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
                          return appCapabilities.some(appCap => 
                            capability.name === appCap || 
                            capability.name.includes(appCap) || 
                            appCap.includes(capability.name) ||
                            appCap.includes(capability.hierarchy || '')
                          );
                        });
                        
                        const matchingApps = relatedApps.filter(app => 
                          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.displayName && app.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
                        );
                        
                        if (matchingApps.length > 0) {
                          return (
                            <div className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                              Found via {matchingApps.length} application{matchingApps.length > 1 ? 's' : ''}: {matchingApps.slice(0, 2).map(app => app.name).join(', ')}
                              {matchingApps.length > 2 && ` +${matchingApps.length - 2} more`}
                            </div>
                          );
                        }
                      } else {
                        // Default capabilities & applications search
                        const relatedApps = applications.filter(app => {
                          if (!app.businessCapabilities) return false;
                          const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
                          return appCapabilities.some(appCap => 
                            capability.name === appCap || 
                            capability.name.includes(appCap) || 
                            appCap.includes(capability.name) ||
                            appCap.includes(capability.hierarchy || '')
                          );
                        });
                        
                        const matchingApps = relatedApps.filter(app => 
                          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.displayName && app.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
                        );
                        
                        if (matchingApps.length > 0) {
                          return (
                            <div className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                              Found via {matchingApps.length} application{matchingApps.length > 1 ? 's' : ''}: {matchingApps.slice(0, 2).map(app => app.name).join(', ')}
                              {matchingApps.length > 2 && ` +${matchingApps.length - 2} more`}
                            </div>
                          );
                        }
                      }
                    } else {
                      // Check if shown because of descendant matches
                      const descendantMatches = allMatchingCapabilities.filter(match => {
                        if (currentLevel === 1) {
                          return match.level1Capability === capability.name;
                        } else if (currentLevel === 2) {
                          return match.level2Capability === capability.name;
                        }
                        return false;
                      });
                      
                      if (descendantMatches.length > 0) {
                        const levelName = currentLevel === 1 ? 'sub-capabilities' : 'detailed capabilities';
                        const searchTypeLabel = searchType === 'components' ? 'IT components' : searchType === 'applications' ? 'applications' : 'matches';
                        return (
                          <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            Contains {descendantMatches.length} {levelName} with matching {searchTypeLabel}
                          </div>
                        );
                      }
                    }
                    return null;
                  })()}
                  
                  {previewItems.map((item, index) => (
                    <div key={index} className="text-sm text-gray-500 dark:text-gray-500 truncate">
                      • {item}
                    </div>
                  ))}
                  
                  {itemCount > 3 && (
                    <div className="text-sm text-gray-400 dark:text-gray-600">
                      +{itemCount - 3} more...
                    </div>
                  )}

                  {capability.hierarchy && (
                    <div className="text-xs text-gray-400 dark:text-gray-600 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      Path: {capability.hierarchy}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCapabilities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600">
            {searchTerm ? `No capabilities found matching "${searchTerm}"` : 'No capabilities available at this level'}
          </div>
        </div>
      )}

      {/* Capability Detail Modal */}
      {expandedCapability && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {expandedCapability.displayName || expandedCapability.name}
              </h2>
              <button
                onClick={() => setExpandedCapability(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                    <p className="text-gray-900 dark:text-white">{expandedCapability.name}</p>
                  </div>
                  {expandedCapability.displayName && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Display Name:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.displayName}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Level:</span>
                    <p className="text-gray-900 dark:text-white">{expandedCapability.level}</p>
                  </div>
                  {expandedCapability.hierarchy && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Hierarchy:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.hierarchy}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Level Mappings */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Level Mappings</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {expandedCapability.level1Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Level 1 Capability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.level1Capability}</p>
                    </div>
                  )}
                  {expandedCapability.level2Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Level 2 Capability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.level2Capability}</p>
                    </div>
                  )}
                  {expandedCapability.level3Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Level 3 Capability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.level3Capability}</p>
                    </div>
                  )}
                  {expandedCapability.mappedLevel1Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Mapped Level 1:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.mappedLevel1Capability}</p>
                    </div>
                  )}
                  {expandedCapability.mappedToLifesciencesCapabilities && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Mapped to Life Sciences:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.mappedToLifesciencesCapabilities}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Applications */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Applications</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const relatedApps = applications.filter(app => {
                      if (!app.businessCapabilities) return false;
                      const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
                      return appCapabilities.some(appCap => 
                        expandedCapability.name === appCap || 
                        expandedCapability.name.includes(appCap) || 
                        appCap.includes(expandedCapability.name) ||
                        appCap.includes(expandedCapability.hierarchy || '')
                      );
                    });

                    if (relatedApps.length === 0) {
                      return <p className="text-gray-500 dark:text-gray-400">No applications found for this capability.</p>;
                    }

                    return relatedApps.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => setExpandedApplication(app)}
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{app.displayName || app.name}</p>
                          {app.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{app.description}</p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {expandedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {expandedApplication.displayName || expandedApplication.name}
              </h2>
              <button
                onClick={() => setExpandedApplication(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                    <p className="text-gray-900 dark:text-white">{expandedApplication.name}</p>
                  </div>
                  {expandedApplication.displayName && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Display Name:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.displayName}</p>
                    </div>
                  )}
                  {expandedApplication.description && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Description:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.description}</p>
                    </div>
                  )}
                  {expandedApplication.vendor && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Vendor:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.vendor}</p>
                    </div>
                  )}
                  {expandedApplication.businessDomain && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Business Domain:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.businessDomain}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical & Operational Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Technical & Operational</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {expandedApplication.technicalSuitability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Technical Suitability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.technicalSuitability}</p>
                    </div>
                  )}
                  {expandedApplication.functionalFit && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Functional Fit:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.functionalFit}</p>
                    </div>
                  )}
                  {expandedApplication.technicalFit && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Technical Fit:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.technicalFit}</p>
                    </div>
                  )}
                  {expandedApplication.serviceLevel && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Service Level:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.serviceLevel}</p>
                    </div>
                  )}
                  {expandedApplication.maturityStatus && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Maturity Status:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.maturityStatus}</p>
                    </div>
                  )}
                  {expandedApplication.obsolescenceRiskStatus && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Obsolescence Risk:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.obsolescenceRiskStatus}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Business Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {expandedApplication.ownedBy && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Owned By:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.ownedBy}</p>
                    </div>
                  )}
                  {expandedApplication.owningFunction && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Owning Function:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.owningFunction}</p>
                    </div>
                  )}
                  {expandedApplication.businessUnit && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Business Unit:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.businessUnit}</p>
                    </div>
                  )}
                  {expandedApplication.organizations && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Organizations:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.organizations}</p>
                    </div>
                  )}
                  {expandedApplication.region && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Region:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.region}</p>
                    </div>
                  )}
                  {expandedApplication.mainArea && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Main Area:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.mainArea}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lifecycle & Cost Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Lifecycle & Cost</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {expandedApplication.activeFrom && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Active From:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.activeFrom}</p>
                    </div>
                  )}
                  {expandedApplication.activeUntil && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Active Until:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.activeUntil}</p>
                    </div>
                  )}
                  {expandedApplication.costTotalAnnual && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Annual Cost:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.costTotalAnnual}</p>
                    </div>
                  )}
                  {expandedApplication.pace && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Pace:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.pace}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Components */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Components</h3>
                <div className="grid grid-cols-1 gap-3">
                  {expandedApplication.itComponentDisplayName && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">IT Component:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.itComponentDisplayName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Data Objects */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Data Objects</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const relatedDataObjects = dataObjects.filter(dataObj => 
                      dataObj.relDataObjectToApplication?.includes(expandedApplication.name)
                    );

                    if (relatedDataObjects.length === 0) {
                      return <p className="text-gray-500 dark:text-gray-400">No data objects found for this application.</p>;
                    }

                    return relatedDataObjects.map((dataObj) => (
                      <div key={dataObj.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{dataObj.displayName || dataObj.name}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Related Interfaces */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Interfaces</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const relatedInterfaces = interfaces.filter(intf => 
                      intf.sourceApplication === expandedApplication.name || 
                      intf.targetApplication === expandedApplication.name
                    );

                    if (relatedInterfaces.length === 0) {
                      return <p className="text-gray-500 dark:text-gray-400">No interfaces found for this application.</p>;
                    }

                    return relatedInterfaces.map((intf) => (
                      <div key={intf.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">{intf.name}</p>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {intf.sourceApplication === expandedApplication.name ? 'Source' : 'Target'}
                          </span>
                        </div>
                        {intf.dataFlow && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{intf.dataFlow}</p>
                        )}
                        {intf.frequency && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">Frequency: {intf.frequency}</p>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Business Capabilities */}
              {expandedApplication.businessCapabilities && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Business Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {expandedApplication.businessCapabilities.split(';').map((cap, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {cap.trim().replace(/^~/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {expandedApplication.obsolescenceRiskComment && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Risk Comments</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    {expandedApplication.obsolescenceRiskComment}
                  </p>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {expandedApplication.cmdbApplicationServiceUrl && (
                  <a
                    href={expandedApplication.cmdbApplicationServiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    CMDB Application Service
                  </a>
                )}
                {expandedApplication.cmdbBusinessApplicationUrl && (
                  <a
                    href={expandedApplication.cmdbBusinessApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    CMDB Business Application
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}