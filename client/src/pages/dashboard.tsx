import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MetisMap from "@/components/views/metis-map";
import StackedMap from "@/components/views/stacked-map";
import HeatmapView from "@/components/views/heatmap-view";
import DashboardView from "@/components/views/dashboard-view";
import DetailModal from "@/components/modals/detail-modal";
import type { BusinessCapability } from "@shared/schema";

export type ViewType = 'network' | 'hierarchy' | 'heatmap' | 'dashboard';

export interface EntityReference {
  type: 'capability' | 'application' | 'component' | 'dataObject' | 'interface';
  id: string;
  data?: any;
}

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('network');
  const [selectedEntity, setSelectedEntity] = useState<EntityReference | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    capabilities: true,
    applications: true,
    components: true,
    interfaces: true,
    dataObjects: true,
    initiatives: true,
  });

  // Fetch business capabilities for stacked map
  const { data: capabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
    enabled: currentView === 'hierarchy'
  });

  const handleEntitySelect = (entity: EntityReference) => {
    setSelectedEntity(entity);
  };

  const handleExport = () => {
    console.log('Export button clicked, current view:', currentView);
    // Trigger export based on current view
    if (currentView === 'network') {
      // Dispatch a custom event to trigger export from MetisMap
      console.log('Dispatching exportData event');
      window.dispatchEvent(new CustomEvent('exportData'));
    }
  };

  const handleCapabilitySelect = (capabilityId: string) => {
    setSelectedCapability(capabilityId);
    if (currentView !== 'network') {
      setCurrentView('network');
    }
    // Clear any open entity detail when selecting from sidebar
    setSelectedEntity(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'network':
        return (
          <MetisMap
            selectedCapability={selectedCapability}
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            filters={filters}
          />
        );
      case 'hierarchy':
        return (
          <StackedMap
            capabilities={capabilities}
            selectedCapability={selectedCapability}
            onCapabilitySelect={(cap: BusinessCapability) => handleEntitySelect({ type: 'capability', id: cap.id, data: cap })}
            searchTerm={searchTerm}
          />
        );
      case 'heatmap':
        return (
          <HeatmapView
            onEntitySelect={handleEntitySelect}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            onEntitySelect={handleEntitySelect}
          />
        );
      default:
        return <MetisMap selectedCapability={selectedCapability} onEntitySelect={handleEntitySelect} searchTerm={searchTerm} filters={filters} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        onCapabilitySelect={handleCapabilitySelect}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        selectedCapability={selectedCapability}
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar
          currentView={currentView}
          onViewChange={setCurrentView}
          onExport={handleExport}
        />
        
        <div className="flex-1 relative">
          {renderCurrentView()}
        </div>
      </div>

      {selectedEntity && (
        <DetailModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </div>
  );
}
