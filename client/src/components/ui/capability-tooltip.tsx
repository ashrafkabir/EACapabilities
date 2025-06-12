import { useState } from "react";

interface CapabilityTooltipProps {
  capability: {
    name: string;
    level?: number | null;
    level1Capability?: string | null;
    level2Capability?: string | null;
    level3Capability?: string | null;
  };
  count: number;
  itemLabel: string;
  relatedApps: any[];
  children: React.ReactNode;
}

export function CapabilityTooltip({ capability, count, itemLabel, relatedApps, children }: CapabilityTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const getTooltipContent = () => {
    const hierarchyPath = [
      capability.level1Capability,
      capability.level2Capability,
      capability.level3Capability
    ].filter(Boolean).join(' → ');

    // Get top applications by technical suitability
    const topApps = relatedApps
      .filter(app => app.technicalSuitability)
      .sort((a, b) => {
        const scoreA = getScore(a.technicalSuitability);
        const scoreB = getScore(b.technicalSuitability);
        return scoreB - scoreA;
      })
      .slice(0, 3);

    return (
      <div className="space-y-3">
        <div className="border-b border-gray-600 pb-2">
          <div className="font-semibold text-white">{capability.name}</div>
          <div className="text-xs text-gray-300">Level {capability.level} Capability</div>
        </div>
        
        {hierarchyPath && (
          <div>
            <div className="text-xs text-gray-400 mb-1">Hierarchy Path:</div>
            <div className="text-xs text-gray-300">{hierarchyPath}</div>
          </div>
        )}
        
        <div>
          <div className="text-xs text-gray-400 mb-1">{itemLabel}:</div>
          <div className="text-sm font-medium text-white">{count}</div>
        </div>
        
        {relatedApps.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-1">Applications ({relatedApps.length}):</div>
            <div className="space-y-1">
              {topApps.map((app, idx) => (
                <div key={idx} className="text-xs text-gray-300 flex justify-between">
                  <span className="truncate">{app.name}</span>
                  {app.technicalSuitability && (
                    <span className={`ml-2 px-1 rounded text-xs ${getSuitabilityColor(app.technicalSuitability)}`}>
                      {app.technicalSuitability}
                    </span>
                  )}
                </div>
              ))}
              {relatedApps.length > 3 && (
                <div className="text-xs text-gray-400">+{relatedApps.length - 3} more</div>
              )}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-600">
          Click to {count > 0 ? 'explore' : 'view details'}
        </div>
      </div>
    );
  };

  const getScore = (suitability: string): number => {
    switch (suitability?.toLowerCase()) {
      case 'perfect': return 5;
      case 'appropriate': return 4;
      case 'adequate': return 3;
      case 'partiallyappropriate': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  };

  const getSuitabilityColor = (suitability: string): string => {
    const score = getScore(suitability);
    if (score >= 4) return 'bg-green-800 text-green-200';
    if (score >= 3) return 'bg-yellow-800 text-yellow-200';
    return 'bg-red-800 text-red-200';
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-xl border border-gray-700 w-80">
            {getTooltipContent()}
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}