import { Button } from "@/components/ui/button";
import { Network, List, Grid3x3, BarChart3, Download, Settings, Wand2, FileText } from "lucide-react";
import { Link } from "wouter";
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
          <Link href="/adr-generator">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Decide</span>
            </Button>
          </Link>
          {currentView === 'model' && (
            <Link href="/diagram-generator">
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Diagrams</span>
              </Button>
            </Link>
          )}
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
