import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Info } from "lucide-react";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application, Initiative } from "@shared/schema";

interface MetisMapProps {
  selectedCapability: string | null;
  searchTerm: string;
  onEntitySelect: (entity: EntityReference) => void;
  filters: {
    capabilities: boolean;
    applications: boolean;
    components: boolean;
    interfaces: boolean;
    capabilityLevel: string;
    vendor: string;
  };
}

interface HeatmapFilters {
  metric: 'technicalSuitability' | 'functionalFit' | 'none';
  showColors: boolean;
}

export default function MetisMap({ selectedCapability, searchTerm, onEntitySelect, filters }: MetisMapProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [heatmapFilters, setHeatmapFilters] = useState<HeatmapFilters>({
    metric: 'none',
    showColors: false
  });

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
  const filteredCapabilities = capabilitiesToShow.filter(cap => {
    // Apply capability level filter
    if (filters.capabilityLevel !== 'all') {
      const targetLevel = parseInt(filters.capabilityLevel);
      if (currentLevel !== targetLevel) {
        return false;
      }
    }
    
    // Apply search term filter
    if (searchTerm) {
      // Search by capability name
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
      
      if (!matchesCapabilityName && !matchesApplicationName) {
        return false;
      }
    }
    
    // Apply vendor filter
    if (filters.vendor) {
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
      
      const hasVendorMatch = relatedApps.some(app => 
        app.vendor && app.vendor.toLowerCase().includes(filters.vendor.toLowerCase())
      );
      
      if (!hasVendorMatch) {
        return false;
      }
    }
    
    return true;
  });

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
        case 'region':
          return app.region;
        case 'organization':
          return app.organizations;
        case 'ownedBy':
          return app.ownedBy;
        default:
          return null;
      }
    }).filter(Boolean);

    if (metricValues.length === 0) {
      return { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-300 dark:border-gray-600', color: 'text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' };
    }

    // Color coding based on metric type
    if (heatmapFilters.metric === 'technicalSuitability' || heatmapFilters.metric === 'functionalFit') {
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
    }

    // For categorical metrics (region, organization, ownedBy), use distinct colors
    const uniqueValues = Array.from(new Set(metricValues.filter(v => v !== null)));
    const colorIndex = uniqueValues.length % 6;
    const colors = [
      { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-400', color: 'text-purple-700', dot: 'bg-purple-500' },
      { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-400', color: 'text-indigo-700', dot: 'bg-indigo-500' },
      { bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-400', color: 'text-pink-700', dot: 'bg-pink-500' },
      { bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-400', color: 'text-teal-700', dot: 'bg-teal-500' },
      { bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-400', color: 'text-cyan-700', dot: 'bg-cyan-500' },
      { bg: 'bg-lime-100 dark:bg-lime-900/30', border: 'border-lime-400', color: 'text-lime-700', dot: 'bg-lime-500' }
    ];
    return colors[colorIndex];
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
                     heatmapFilters.metric === 'functionalFit' ? 'Functional Fit' :
                     heatmapFilters.metric === 'region' ? 'Region' :
                     heatmapFilters.metric === 'organization' ? 'Organization' : 'Ownership'}
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {(() => {
                      const metricValues = relatedApps.map(app => {
                        switch (heatmapFilters.metric) {
                          case 'technicalSuitability': return app.technicalSuitability;
                          case 'functionalFit': return app.functionalFit;
                          case 'region': return app.region;
                          case 'organization': return app.organizations;
                          case 'ownedBy': return app.ownedBy;
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
                  
                  {searchTerm && (() => {
                    // Check if this capability matches through applications
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
    </div>
  );
}