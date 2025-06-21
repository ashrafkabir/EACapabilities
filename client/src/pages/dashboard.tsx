import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MetisMap from "@/components/views/metis-map";
import StackedMap from "@/components/views/stacked-map";
import HeatmapView from "@/components/views/heatmap-view";
import DashboardView from "@/components/views/dashboard-view";
import ModelView from "@/components/views/model-view";
import DetailModal from "@/components/modals/detail-modal";
import type { BusinessCapability } from "@shared/schema";

export type ViewType = 'network' | 'hierarchy' | 'heatmap' | 'dashboard' | 'model';

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
  const [selectedITComponent, setSelectedITComponent] = useState<string | null>(null);
  const [searchScope, setSearchScope] = useState<string | null>(null);
  
  // Debug effect to track searchScope changes
  useEffect(() => {
    console.log('Dashboard searchScope state changed to:', searchScope);
  }, [searchScope]); // Unified search scope across all tabs
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

  const handleViewChange = (view: ViewType) => {
    // Reset search and navigation when switching tabs
    setSearchTerm('');
    setSelectedCapability(null);
    setSelectedITComponent(null);
    setSearchScope(null);
    setCurrentView(view);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    
    // Reset selections when search changes
    setSelectedCapability(null);
    setSelectedITComponent(null);
    
    // Set search scope based on active filters and search term
    console.log('Dashboard search - term:', term, 'filters:', filters);
    if (term.trim()) {
      const enabledFilters = Object.entries(filters).filter(([_, enabled]) => enabled);
      console.log('Dashboard search - enabledFilters:', enabledFilters);
      
      if (enabledFilters.length === 1) {
        const [filterType] = enabledFilters[0];
        console.log('Dashboard search - filterType:', filterType);
        if (filterType === 'capabilities') {
          // For capability search, we need to find matches at any level and build the hierarchy path
          const newScope = `Business Capability: ${term}`;
          console.log('Dashboard search - setting capability scope:', newScope);
          setSearchScope(newScope);
          console.log('Dashboard search - scope state updated to:', newScope);
        } else if (filterType === 'applications') {
          setSearchScope(`Application: ${term}`);
        } else if (filterType === 'components') {
          setSearchScope(`IT Component: ${term}`);
          setSelectedITComponent(term); // Set selected IT component for seamless navigation
        } else if (filterType === 'interfaces') {
          setSearchScope(`Interface: ${term}`);
        } else if (filterType === 'dataObjects') {
          setSearchScope(`Data Object: ${term}`);
        } else if (filterType === 'initiatives') {
          setSearchScope(`Initiative: ${term}`);
        } else {
          setSearchScope(`Search: ${term} (${filterType})`);
        }
      } else {
        // General search across enabled filters
        const activeFilters = enabledFilters.map(([type, _]) => type).join(', ');
        setSearchScope(`Search: ${term} (${activeFilters})`);
      }
    } else {
      setSearchScope(null);
    }
  };

  const handleCapabilityTreeSelect = (capability: BusinessCapability) => {
    // Build the capability path for search scope
    const capabilityPath = [
      capability.level1Capability,
      capability.level2Capability,
      capability.level3Capability
    ].filter(Boolean).join('/');
    
    setSearchScope(`Business Capability: ${capabilityPath}`);
    setSelectedCapability(capability.id);
    // Clear any open entity detail when selecting from sidebar
    setSelectedEntity(null);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Update search scope if there's an active search term
    if (searchTerm.trim()) {
      if (newFilters.applications && !newFilters.capabilities) {
        setSearchScope(`Application: ${searchTerm}`);
      } else if (newFilters.components && !newFilters.capabilities && !newFilters.applications) {
        setSearchScope(`Component: ${searchTerm}`);
      } else {
        const activeFilters = Object.entries(newFilters)
          .filter(([_, enabled]) => enabled)
          .map(([type, _]) => type)
          .join(', ');
        setSearchScope(`Search: ${searchTerm} (${activeFilters})`);
      }
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'network':
        return (
          <MetisMap
            selectedCapability={selectedCapability}
            selectedITComponent={selectedITComponent}
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            searchScope={searchScope}
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
            searchScope={searchScope}
          />
        );
      case 'heatmap':
        return (
          <HeatmapView
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            selectedCapability={selectedCapability}
            filters={filters}
            searchScope={searchScope}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            selectedCapability={selectedCapability}
            filters={filters}
            searchScope={searchScope}
          />
        );
      case 'model':
        return (
          <ModelView 
            searchTerm={searchTerm}
            selectedCapability={selectedCapability}
            selectedITComponent={selectedITComponent}
            searchScope={searchScope}
          />
        );
      default:
        console.log('Dashboard rendering MetisMap with searchScope:', searchScope);
        return <MetisMap selectedCapability={selectedCapability} selectedITComponent={selectedITComponent} onEntitySelect={handleEntitySelect} searchTerm={searchTerm} searchScope={searchScope} filters={filters} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        onCapabilitySelect={handleCapabilityTreeSelect}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        selectedCapability={selectedCapability}
        searchScope={searchScope}
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar
          currentView={currentView}
          onViewChange={handleViewChange}
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
