import { BusinessCapability, Application, ITComponent, Interface, DataObject, Initiative } from '@/../../shared/schema';

export interface SearchFilters {
  capabilities: boolean;
  applications: boolean;
  components: boolean;
  interfaces: boolean;
  dataObjects: boolean;
  initiatives: boolean;
}

export interface SearchContext {
  allCapabilities: BusinessCapability[];
  applications: Application[];
  itComponents: ITComponent[];
  interfaces: Interface[];
  dataObjects: DataObject[];
  initiatives: Initiative[];
}

export function getCapabilitiesMatchingSearch(
  searchTerm: string,
  searchScope: string | null,
  filters: SearchFilters,
  context: SearchContext
): BusinessCapability[] {
  if (!searchTerm?.trim()) {
    console.log('No search term provided');
    return [];
  }
  
  const searchLower = searchTerm.toLowerCase().trim();
  console.log('Starting search for:', searchTerm, 'with filters:', filters);
  console.log('Total capabilities available:', context.allCapabilities.length);
  
  // Find all matching capabilities
  const matchingCapabilities = new Set<BusinessCapability>();
  
  // Always search capabilities if capabilities filter is enabled or no specific filters are set
  const shouldSearchCapabilities = filters.capabilities || 
    (!filters.applications && !filters.components && !filters.interfaces && !filters.dataObjects && !filters.initiatives);
  
  if (shouldSearchCapabilities) {
    console.log('Searching capabilities directly...');
    const directMatches = context.allCapabilities.filter(cap => {
      const nameMatch = cap.name.toLowerCase().includes(searchLower);
      const displayMatch = cap.displayName && cap.displayName.toLowerCase().includes(searchLower);
      return nameMatch || displayMatch;
    });
    
    console.log('Direct capability matches found:', directMatches.map(c => `${c.name} (L${c.level})`));
    directMatches.forEach(cap => matchingCapabilities.add(cap));
  }
  
  // Search through applications if filter enabled
  if (filters.applications) {
    console.log('Searching through applications...');
    const matchingApps = context.applications.filter(app =>
      app.name.toLowerCase().includes(searchLower) ||
      (app.displayName && app.displayName.toLowerCase().includes(searchLower))
    );
    
    matchingApps.forEach(app => {
      const relatedCaps = getCapabilitiesForApplication(app, context.allCapabilities);
      relatedCaps.forEach(cap => matchingCapabilities.add(cap));
    });
    console.log('Application-based matches:', matchingApps.length, 'apps found');
  }
  
  // Add other entity searches if needed
  if (filters.components) {
    console.log('Searching through components...');
    const matchingComponents = context.itComponents.filter(comp =>
      comp.name.toLowerCase().includes(searchLower) ||
      (comp.displayName && comp.displayName.toLowerCase().includes(searchLower))
    );
    
    matchingComponents.forEach(comp => {
      const relatedApps = getApplicationsForITComponent(comp, context.applications);
      relatedApps.forEach(app => {
        const relatedCaps = getCapabilitiesForApplication(app, context.allCapabilities);
        relatedCaps.forEach(cap => matchingCapabilities.add(cap));
      });
    });
  }
  
  const results = Array.from(matchingCapabilities);
  console.log('Matched capabilities before adding parents:', results.map(c => `${c.name} (L${c.level})`));
  
  // Add necessary parent capabilities for hierarchy navigation
  const finalResults = new Set<BusinessCapability>();
  results.forEach(cap => {
    finalResults.add(cap);
    
    // Add parent capabilities for navigation context
    if (cap.level === 2 || cap.level === 3) {
      const l1Parent = context.allCapabilities.find(parent => 
        parent.level === 1 && parent.name === cap.level1Capability
      );
      if (l1Parent) {
        console.log('Adding L1 parent:', l1Parent.name, 'for capability:', cap.name);
        finalResults.add(l1Parent);
      }
      
      if (cap.level === 3) {
        const l2Parent = context.allCapabilities.find(parent => 
          parent.level === 2 && parent.name === cap.level2Capability
        );
        if (l2Parent) {
          console.log('Adding L2 parent:', l2Parent.name, 'for capability:', cap.name);
          finalResults.add(l2Parent);
        }
      }
    }
  });
  
  const finalResultsArray = Array.from(finalResults);
  console.log('Final search results:', finalResultsArray.map(c => `${c.name} (L${c.level})`));
  return finalResultsArray;
}

// Helper functions for finding relationships
function getCapabilitiesForApplication(app: Application, allCapabilities: BusinessCapability[]): BusinessCapability[] {
  if (!app.businessCapabilities) return [];
  
  const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
  return allCapabilities.filter(cap => 
    appCapabilities.some(appCap => 
      cap.name === appCap || 
      cap.name.includes(appCap) || 
      appCap.includes(cap.name)
    )
  );
}

function getApplicationsForITComponent(component: ITComponent, applications: Application[]): Application[] {
  return applications.filter(app => {
    if (!app.itComponents) return false;
    const appComponents = app.itComponents.split(';').map(c => c.trim());
    return appComponents.some(appComp => 
      appComp.toLowerCase().includes(component.name.toLowerCase()) ||
      component.name.toLowerCase().includes(appComp.toLowerCase())
    );
  });
}

export function filterCapabilitiesBySearch(
  capabilities: BusinessCapability[],
  searchTerm: string,
  searchScope: string | null,
  filters: SearchFilters,
  context: SearchContext
): BusinessCapability[] {
  if (!searchTerm && !searchScope) return capabilities;

  const matchingCapabilities = getCapabilitiesMatchingSearch(searchTerm, searchScope, filters, context);
  const matchingIds = new Set(matchingCapabilities.map(cap => cap.id));

  return capabilities.filter(cap => matchingIds.has(cap.id));
}