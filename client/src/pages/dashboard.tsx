import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MetisMap from "@/components/views/metis-map";
import StackedMap from "@/components/views/stacked-map";
import HeatmapView from "@/components/views/heatmap-view";
import DashboardView from "@/components/views/dashboard-view";
import ModelView from "@/components/views/model-view";
import DetailModal from "@/components/modals/detail-modal";
import type { BusinessCapability } from "@shared/schema";
import { filterCapabilitiesByName } from "@/lib/unified-search";

export type ViewType = 'network' | 'hierarchy' | 'model' | 'decide' | 'monitor' | 'dashboard';

export interface EntityReference {
  type: 'capability' | 'application' | 'component' | 'dataObject' | 'interface';
  id: string;
  data?: any;
}

export default function Dashboard() {
  const [location] = useLocation();
  
  // Determine current view based on URL
  const getCurrentView = (): ViewType => {
    switch (location) {
      case '/map': return 'hierarchy';
      case '/model': return 'model';
      case '/monitor': return 'monitor';
      case '/admin': return 'dashboard';
      default: return 'network'; // for '/'
    }
  };
  
  const [currentView, setCurrentView] = useState<ViewType>(getCurrentView());
  const [selectedEntity, setSelectedEntity] = useState<EntityReference | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [selectedITComponent, setSelectedITComponent] = useState<string | null>(null);
  const [searchScope, setSearchScope] = useState<string | null>(null); // Unified search scope across all tabs

  // Fetch all capabilities for centralized filtering
  const { data: allCapabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

  // Centralized filtered capabilities - this single array drives all views
  const filteredCapabilities = useMemo(() => {
    console.log('Dashboard: Computing filtered capabilities for searchTerm:', searchTerm);
    if (!searchTerm?.trim()) {
      console.log('Dashboard: No search term, returning all capabilities:', allCapabilities.length);
      return allCapabilities;
    }
    
    const filtered = filterCapabilitiesByName(allCapabilities, searchTerm);
    console.log('Dashboard: Filtered capabilities:', filtered.length, 'from', allCapabilities.length);
    console.log('Dashboard: Filtered names:', filtered.map(c => c.name));
    return filtered;
  }, [allCapabilities, searchTerm]);

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

  // Update view when URL changes
  useEffect(() => {
    setCurrentView(getCurrentView());
  }, [location]);

  const handleViewChange = (view: ViewType) => {
    // Don't reset search when switching tabs to maintain unified search
    setSelectedCapability(null);
    setSelectedITComponent(null);
    setCurrentView(view);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    
    // Reset selections when search changes
    setSelectedCapability(null);
    setSelectedITComponent(null);
    
    // Set simple search scope
    if (term.trim()) {
      setSearchScope(`Searching capabilities: "${term}"`);
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'network':
        return (
          <MetisMap
            selectedCapability={selectedCapability}
            selectedITComponent={selectedITComponent}
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            filteredCapabilities={filteredCapabilities}
          />
        );
      case 'hierarchy':
        return (
          <StackedMap
            capabilities={filteredCapabilities}
            selectedCapability={selectedCapability}
            onCapabilitySelect={(cap: BusinessCapability) => handleEntitySelect({ type: 'capability', id: cap.id, data: cap })}
            searchTerm={searchTerm}
          />
        );
      case 'model':
        return (
          <ModelView 
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            filteredCapabilities={filteredCapabilities}
            selectedITComponent={selectedITComponent}
            searchScope={searchScope}
          />
        );
      case 'decide':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Architecture Decision Records</h2>
              <p className="text-gray-600 mb-6">Manage and track architectural decisions with AI-powered assistance.</p>
              <a href="/adr-generator" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Go to ADR Generator
              </a>
            </div>
          </div>
        );
      case 'monitor':
        return (
          <HeatmapView
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            selectedCapability={selectedCapability}
            filteredCapabilities={filteredCapabilities}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            onEntitySelect={handleEntitySelect}
            searchTerm={searchTerm}
            filteredCapabilities={filteredCapabilities}
          />
        );
      default:
        return <MetisMap selectedCapability={selectedCapability} onEntitySelect={handleEntitySelect} searchTerm={searchTerm} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        onCapabilitySelect={handleCapabilityTreeSelect}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        selectedCapability={selectedCapability}
        searchScope={searchScope}
        filteredCapabilities={filteredCapabilities}
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
