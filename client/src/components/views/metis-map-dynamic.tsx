import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Info, Expand, ExternalLink } from "lucide-react";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application, Initiative, DataObject, Interface, ITComponent } from "@shared/schema";
import ExportSummaryModal from "@/components/modals/export-summary-modal";

interface MetisMapProps {
  selectedCapability: string | null;
  searchTerm: string;
  onEntitySelect: (entity: EntityReference) => void;
  filters: {
    capabilities: boolean;
    applications: boolean;
    components: boolean;
    interfaces: boolean;
    dataObjects: boolean;
    initiatives: boolean;
  };
}

interface HeatmapFilters {
  metric: 'technicalSuitability' | 'functionalFit' | 'none';
  showColors: boolean;
}

interface NavigationLevel {
  id: string | null;
  name: string;
  level: number;
}

export default function MetisMapDynamic({ selectedCapability, searchTerm, onEntitySelect, filters }: MetisMapProps) {
  const [navigationStack, setNavigationStack] = useState<NavigationLevel[]>([
    { id: null, name: 'Root', level: 0 }
  ]);
  const [heatmapFilters, setHeatmapFilters] = useState<HeatmapFilters>({
    metric: 'none',
    showColors: false
  });
  const [showExportSummary, setShowExportSummary] = useState(false);
  const [exportSummaryData, setExportSummaryData] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<EntityReference | null>(null);

  const { data: allCapabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

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

  const { data: initiatives = [] } = useQuery<Initiative[]>({
    queryKey: ['/api/initiatives'],
  });

  // Get capabilities to display based on current navigation position
  const capabilitiesToShow = useMemo(() => {
    const currentNav = navigationStack[navigationStack.length - 1];
    
    if (currentNav.id === null) {
      // At root level - show top-level capabilities (those without parents)
      return allCapabilities.filter(cap => !cap.parentId);
    } else {
      // Show children of the current capability
      return allCapabilities.filter(cap => cap.parentId === currentNav.id);
    }
  }, [allCapabilities, navigationStack]);

  // Dynamic navigation functions
  const handleCapabilityClick = (capability: BusinessCapability) => {
    console.log('Card clicked for capability:', capability.name);
    console.log('Capability clicked:', capability.name, 'Current level:', navigationStack.length);
    
    // Check if this capability has children
    const children = allCapabilities.filter(cap => cap.parentId === capability.id);
    console.log('Found children:', children.length, 'for capability:', capability.name);
    
    if (children.length > 0) {
      // Navigate to this capability's children
      console.log('Navigating to:', capability.name, 'New level will be:', navigationStack.length + 1);
      setNavigationStack(prev => [...prev, { 
        id: capability.id, 
        name: capability.name, 
        level: navigationStack.length + 1 
      }]);
      console.log('State after navigation - Level:', navigationStack.length + 1, 'Parent:', capability.name);
    } else {
      // Show details for leaf capability
      console.log('Showing details for capability:', capability.name);
      onEntitySelect({
        type: 'capability',
        id: capability.id,
        data: capability
      });
    }
  };

  const handleGoBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  };

  // Default level colors
  const getDefaultLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', color: 'text-blue-900 dark:text-blue-100', dot: 'bg-blue-500' };
      case 2:
        return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', color: 'text-green-900 dark:text-green-100', dot: 'bg-green-500' };
      case 3:
        return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', color: 'text-orange-900 dark:text-orange-100', dot: 'bg-orange-500' };
      default:
        return { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', color: 'text-purple-900 dark:text-purple-100', dot: 'bg-purple-500' };
    }
  };

  // Get heatmap color for capability
  const getHeatmapColor = (capability: BusinessCapability, relatedApps: Application[]) => {
    if (!heatmapFilters.showColors || heatmapFilters.metric === 'none') {
      return getDefaultLevelColor(capability.level || 1);
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

    // Simple color mapping based on metric values
    const hasGood = metricValues.some(v => v && ['Perfect', 'Appropriate', 'FullyAppropriate'].includes(v));
    const hasPoor = metricValues.some(v => v && ['Poor', 'PartiallyAppropriate'].includes(v));

    if (hasGood && !hasPoor) {
      return { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300 dark:border-green-700', color: 'text-green-900 dark:text-green-100', dot: 'bg-green-500' };
    } else if (hasPoor) {
      return { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-300 dark:border-red-700', color: 'text-red-900 dark:text-red-100', dot: 'bg-red-500' };
    } else {
      return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-300 dark:border-yellow-700', color: 'text-yellow-900 dark:text-yellow-100', dot: 'bg-yellow-500' };
    }
  };

  // Filter capabilities based on search
  const filteredCapabilities = searchTerm ? 
    capabilitiesToShow.filter(cap =>
      cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cap.displayName && cap.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : capabilitiesToShow;

  return (
    <div className="w-full h-full overflow-auto bg-slate-50 dark:bg-slate-900 p-6">
      {/* Navigation breadcrumb */}
      {navigationStack.length > 1 && (
        <div className="mb-6 flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md w-fit">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Level {navigationStack.length}</span>
            <span>•</span>
            <span className="font-medium">{navigationStack[navigationStack.length - 1].name}</span>
          </div>
        </div>
      )}

      {/* Heatmap controls */}
      <div className="mb-6 flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md w-fit">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showColors"
            checked={heatmapFilters.showColors}
            onChange={(e) => setHeatmapFilters(prev => ({ ...prev, showColors: e.target.checked }))}
          />
          <label htmlFor="showColors" className="text-sm text-gray-700 dark:text-gray-300">Enable Heatmap</label>
        </div>
        
        {heatmapFilters.showColors && (
          <select
            value={heatmapFilters.metric}
            onChange={(e) => setHeatmapFilters(prev => ({ ...prev, metric: e.target.value as any }))}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="none">No Metric</option>
            <option value="technicalSuitability">Technical Suitability</option>
            <option value="functionalFit">Functional Fit</option>
          </select>
        )}
      </div>

      {/* Capabilities grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCapabilities.map((capability) => {
          // Get related applications for this capability
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
          const hasChildren = allCapabilities.some(cap => cap.parentId === capability.id);

          return (
            <div
              key={capability.id}
              onClick={() => handleCapabilityClick(capability)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${colors.bg} ${colors.border} ${colors.color}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                    <h3 className="font-medium text-sm">{capability.name}</h3>
                  </div>
                  
                  {capability.displayName && capability.displayName !== capability.name && (
                    <p className="text-xs opacity-75 mb-2">{capability.displayName}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span>Apps: {relatedApps.length}</span>
                    {hasChildren && (
                      <span className="flex items-center gap-1">
                        <Expand className="w-3 h-3" />
                        Expandable
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEntitySelect({
                      type: 'capability',
                      id: capability.id,
                      data: capability
                    });
                  }}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCapabilities.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchTerm ? 'No capabilities match your search criteria.' : 'No capabilities found at this level.'}
        </div>
      )}

      {/* Export Summary Modal */}
      <ExportSummaryModal
        isOpen={showExportSummary}
        onClose={() => setShowExportSummary(false)}
        exportData={exportSummaryData}
      />
    </div>
  );
}