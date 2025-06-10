import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MetisMap from "@/components/views/metis-map";
import HierarchyView from "@/components/views/hierarchy-view";
import HeatmapView from "@/components/views/heatmap-view";
import DashboardView from "@/components/views/dashboard-view";
import DetailModal from "@/components/modals/detail-modal";

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
  const [searchType, setSearchType] = useState<'capabilities' | 'applications' | 'components'>('capabilities');
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    capabilities: true,
    applications: true,
    components: true,
    interfaces: true,
  });

  const handleEntitySelect = (entity: EntityReference) => {
    setSelectedEntity(entity);
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
            searchType={searchType}
            filters={filters}
          />
        );
      case 'hierarchy':
        return (
          <HierarchyView
            selectedCapability={selectedCapability}
            onEntitySelect={handleEntitySelect}
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
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        filters={filters}
        onFiltersChange={setFilters}
        selectedCapability={selectedCapability}
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar
          currentView={currentView}
          onViewChange={setCurrentView}
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
