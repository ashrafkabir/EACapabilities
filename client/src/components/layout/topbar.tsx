import { Button } from "@/components/ui/button";
import { Network, List, Grid3x3, BarChart3, Download, Settings } from "lucide-react";
import type { ViewType } from "@/pages/dashboard";

interface TopBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onExport?: () => void;
}

const viewConfig = {
  network: { icon: Network, label: 'Business Capabilities' },
  hierarchy: { icon: List, label: 'Map' },
  heatmap: { icon: Grid3x3, label: 'Heatmap' },
  dashboard: { icon: BarChart3, label: 'Dashboard' },
  model: { icon: Settings, label: 'Model' },
};

export default function TopBar({ currentView, onViewChange, onExport }: TopBarProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {Object.entries(viewConfig).map(([viewKey, config]) => {
            const Icon = config.icon;
            const isActive = currentView === viewKey;
            
            return (
              <Button
                key={viewKey}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(viewKey as ViewType)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2"
            onClick={onExport}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>

        </div>
      </div>
    </div>
  );
}
