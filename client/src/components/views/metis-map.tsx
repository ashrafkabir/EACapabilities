import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application, Initiative } from "@shared/schema";

interface MetisMapProps {
  selectedCapability: string | null;
  searchTerm: string;
  onEntitySelect: (entity: EntityReference) => void;
}

export default function MetisMap({ selectedCapability, searchTerm, onEntitySelect }: MetisMapProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  const { data: allCapabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const handleGoBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      if (currentLevel === 2) {
        setSelectedParent(null);
      } else {
        const currentParent = allCapabilities.find(cap => cap.id === selectedParent);
        setSelectedParent(currentParent?.parentId || null);
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
      setSelectedParent(capability.id);
      setCurrentLevel(currentLevel + 1);
    } else if (currentLevel === 3) {
      // Show details for Level 3 capabilities
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
      const parentCap = allCapabilities.find(c => c.id === selectedParent);
      return allCapabilities.filter(cap => 
        cap.level === 2 && cap.level1Capability === parentCap?.name
      );
    } else if (currentLevel === 3) {
      const parentCap = allCapabilities.find(c => c.id === selectedParent);
      return allCapabilities.filter(cap => 
        cap.level === 3 && cap.level1Capability === parentCap?.level1Capability && cap.level2Capability === parentCap?.name
      );
    }
    return [];
  };

  const capabilitiesToShow = getCapabilitiesToShow();
  const filteredCapabilities = searchTerm
    ? capabilitiesToShow.filter(cap =>
        cap.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : capabilitiesToShow;

  const getCapabilityColor = (level: number) => {
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
      {(currentLevel > 1 || selectedParent) && (
        <div className="mb-6 flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md w-fit">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Level {currentLevel - 1}
          </button>
        </div>
      )}

      {/* Level indicator */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Level {currentLevel} Capabilities ({filteredCapabilities.length})
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLevel === 1 && "Enterprise capability overview - Click any capability to explore sub-capabilities"}
          {currentLevel === 2 && "Sub-capabilities - Click any capability to see detailed capabilities"}
          {currentLevel === 3 && "Detailed capabilities - Click any capability to view applications and details"}
        </p>
      </div>

      {/* Columnar grid layout */}
      <div className="grid grid-cols-3 gap-6 auto-rows-min">
        {filteredCapabilities.map((capability) => {
          const colors = getCapabilityColor(capability.level);
          
          // Get children count or applications count based on level
          let itemCount = 0;
          let itemLabel = '';
          let previewItems: string[] = [];
          
          if (currentLevel === 1) {
            const l2Children = allCapabilities.filter(cap => 
              cap.level === 2 && cap.level1Capability === capability.name
            );
            itemCount = l2Children.length;
            itemLabel = 'Sub-capabilities';
            previewItems = l2Children.slice(0, 3).map(cap => cap.name);
          } else if (currentLevel === 2) {
            const l3Children = allCapabilities.filter(cap => 
              cap.level === 3 && cap.level1Capability === capability.level1Capability && cap.level2Capability === capability.name
            );
            itemCount = l3Children.length;
            itemLabel = 'Detailed capabilities';
            previewItems = l3Children.slice(0, 3).map(cap => cap.name);
          } else if (currentLevel === 3) {
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
            itemCount = relatedApps.length;
            itemLabel = 'Applications';
            previewItems = relatedApps.slice(0, 3).map(app => app.name);
          }
          
          return (
            <div
              key={capability.id}
              className={`${colors.bg} rounded-xl border-2 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group`}
              onClick={() => handleCapabilityClick(capability)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white group-hover:${colors.color} transition-colors`}>
                    {capability.displayName || capability.name}
                  </h3>
                  <div className={`w-4 h-4 rounded-full ${colors.dot}`}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {itemLabel}: {itemCount}
                  </div>
                  
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