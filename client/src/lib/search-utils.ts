import type { BusinessCapability, Application, ITComponent, Interface, DataObject, Initiative } from "@shared/schema";

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

export function getApplicationsForCapability(capabilityName: string, applications: Application[]): Application[] {
  return applications.filter((app: Application) => {
    if (!app.businessCapabilities) return false;
    const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
    return appCapabilities.some(appCap => 
      capabilityName === appCap || 
      capabilityName.includes(appCap) || 
      appCap.includes(capabilityName)
    );
  });
}

export function getApplicationsLinkedToITComponent(componentName: string, applications: Application[]): Application[] {
  return applications.filter(app => {
    if (!app.itComponents) return false;
    const components = app.itComponents.split(';').map(c => c.trim());
    return components.some(comp => 
      comp.toLowerCase().includes(componentName.toLowerCase()) ||
      componentName.toLowerCase().includes(comp.toLowerCase())
    );
  });
}

export function getApplicationsLinkedToInterface(interfaceName: string, applications: Application[]): Application[] {
  return applications.filter(app => {
    if (!app.interfaces) return false;
    const appInterfaces = app.interfaces.split(';').map(i => i.trim());
    return appInterfaces.some(iface => 
      iface.toLowerCase().includes(interfaceName.toLowerCase()) ||
      interfaceName.toLowerCase().includes(iface.toLowerCase())
    );
  });
}

export function getApplicationsLinkedToDataObject(dataObjectName: string, applications: Application[]): Application[] {
  return applications.filter(app => {
    if (!app.dataObjects) return false;
    const appDataObjects = app.dataObjects.split(';').map(d => d.trim());
    return appDataObjects.some(dataObj => 
      dataObj.toLowerCase().includes(dataObjectName.toLowerCase()) ||
      dataObjectName.toLowerCase().includes(dataObj.toLowerCase())
    );
  });
}

export function getApplicationsLinkedToInitiative(initiativeName: string, applications: Application[]): Application[] {
  return applications.filter(app => {
    if (!app.initiatives) return false;
    const appInitiatives = app.initiatives.split(';').map(i => i.trim());
    return appInitiatives.some(init => 
      init.toLowerCase().includes(initiativeName.toLowerCase()) ||
      initiativeName.toLowerCase().includes(init.toLowerCase())
    );
  });
}

export function getCapabilitiesMatchingSearch(
  searchTerm: string,
  searchScope: string | null,
  filters: SearchFilters,
  context: SearchContext
): BusinessCapability[] {
  if (!searchTerm && !searchScope) return context.allCapabilities;

  const searchLower = searchTerm.toLowerCase();

  // Handle search scope filtering
  if (searchScope) {
    let entityLinkedApps: Application[] = [];
    
    if (searchScope.startsWith('Business Capability:')) {
      const capabilityPath = searchScope.replace('Business Capability: ', '');
      const pathParts = capabilityPath.split('/');
      
      return context.allCapabilities.filter(cap => {
        if (pathParts.length === 1) {
          return cap.level1Capability?.toLowerCase() === pathParts[0].toLowerCase();
        } else if (pathParts.length === 2) {
          return cap.level1Capability?.toLowerCase() === pathParts[0].toLowerCase() &&
                 cap.level2Capability?.toLowerCase() === pathParts[1].toLowerCase();
        } else if (pathParts.length === 3) {
          return cap.level1Capability?.toLowerCase() === pathParts[0].toLowerCase() &&
                 cap.level2Capability?.toLowerCase() === pathParts[1].toLowerCase() &&
                 cap.level3Capability?.toLowerCase() === pathParts[2].toLowerCase();
        }
        return false;
      });
    }
    
    const scopeSearchTerm = searchScope.replace(/^(Search|Application|IT Component|Interface|Data Object|Initiative): /, '').toLowerCase();
    
    if (searchScope.startsWith('IT Component:')) {
      entityLinkedApps = getApplicationsLinkedToITComponent(scopeSearchTerm, context.applications);
    } else if (searchScope.startsWith('Interface:')) {
      entityLinkedApps = getApplicationsLinkedToInterface(scopeSearchTerm, context.applications);
    } else if (searchScope.startsWith('Data Object:')) {
      entityLinkedApps = getApplicationsLinkedToDataObject(scopeSearchTerm, context.applications);
    } else if (searchScope.startsWith('Initiative:')) {
      entityLinkedApps = getApplicationsLinkedToInitiative(scopeSearchTerm, context.applications);
    } else if (searchScope.startsWith('Application:')) {
      entityLinkedApps = context.applications.filter(app => 
        app.name.toLowerCase().includes(scopeSearchTerm)
      );
    }
    
    if (entityLinkedApps.length > 0) {
      return context.allCapabilities.filter(cap => {
        const capabilityApps = getApplicationsForCapability(cap.name, context.applications);
        return capabilityApps.some(app => 
          entityLinkedApps.some(linkedApp => linkedApp.id === app.id)
        );
      });
    }
  }

  // Determine search scope based on filters
  const searchComponents = filters.components && !filters.capabilities && !filters.applications && !filters.interfaces && !filters.dataObjects && !filters.initiatives;
  const searchApplicationsOnly = filters.applications && !filters.capabilities && !filters.components && !filters.interfaces && !filters.dataObjects && !filters.initiatives;
  const searchInterfacesOnly = filters.interfaces && !filters.capabilities && !filters.applications && !filters.components && !filters.dataObjects && !filters.initiatives;
  const searchDataObjectsOnly = filters.dataObjects && !filters.capabilities && !filters.applications && !filters.components && !filters.interfaces && !filters.initiatives;
  const searchInitiativesOnly = filters.initiatives && !filters.capabilities && !filters.applications && !filters.components && !filters.interfaces && !filters.dataObjects;
  const searchCapabilitiesOnly = filters.capabilities && !filters.applications && !filters.components && !filters.interfaces && !filters.dataObjects && !filters.initiatives;

  if (searchCapabilitiesOnly || (!searchComponents && !searchApplicationsOnly && !searchInterfacesOnly && !searchDataObjectsOnly && !searchInitiativesOnly)) {
    // Direct capability search - find capabilities that match and their hierarchy
    const directMatches = context.allCapabilities.filter(cap => {
      return cap.name.toLowerCase().includes(searchLower) ||
             (cap.displayName && cap.displayName.toLowerCase().includes(searchLower));
    });
    
    // Also find parent capabilities that contain matching child capabilities
    const parentCapabilities = new Set<BusinessCapability>();
    
    directMatches.forEach(matchedCap => {
      // Add the matched capability itself
      parentCapabilities.add(matchedCap);
      
      // Find and add parent capabilities
      if (matchedCap.level === 2 || matchedCap.level === 3) {
        // Find L1 parent
        const l1Parent = context.allCapabilities.find(cap => 
          cap.level === 1 && cap.name === matchedCap.level1Capability
        );
        if (l1Parent) {
          parentCapabilities.add(l1Parent);
        }
        
        // Find L2 parent for L3 capabilities
        if (matchedCap.level === 3) {
          const l2Parent = context.allCapabilities.find(cap => 
            cap.level === 2 && cap.name === matchedCap.level2Capability
          );
          if (l2Parent) {
            parentCapabilities.add(l2Parent);
          }
        }
      }
    });
    
    console.log('Search results for', searchTerm, ':', Array.from(parentCapabilities).map(c => `${c.name} (L${c.level})`));
    return Array.from(parentCapabilities);
  }

  // Entity-based search - find capabilities through linked applications
  let matchingApplications: Application[] = [];

  if (searchComponents) {
    const matchingComponents = context.itComponents.filter(comp =>
      comp.name.toLowerCase().includes(searchLower) ||
      (comp.displayName && comp.displayName.toLowerCase().includes(searchLower))
    );
    
    matchingApplications = context.applications.filter(app => {
      if (!app.itComponents) return false;
      const appComponents = app.itComponents.split(';').map(c => c.trim());
      return matchingComponents.some(comp =>
        appComponents.some(appComp => 
          appComp.toLowerCase().includes(comp.name.toLowerCase()) ||
          comp.name.toLowerCase().includes(appComp.toLowerCase())
        )
      );
    });
  } else if (searchApplicationsOnly) {
    matchingApplications = context.applications.filter(app =>
      app.name.toLowerCase().includes(searchLower) ||
      (app.displayName && app.displayName.toLowerCase().includes(searchLower))
    );
  } else if (searchInterfacesOnly) {
    const matchingInterfaces = context.interfaces.filter(iface =>
      iface.name.toLowerCase().includes(searchLower) ||
      (iface.displayName && iface.displayName.toLowerCase().includes(searchLower))
    );
    
    matchingApplications = context.applications.filter(app => {
      if (!app.interfaces) return false;
      const appInterfaces = app.interfaces.split(';').map(i => i.trim());
      return matchingInterfaces.some(iface =>
        appInterfaces.some(appIface => 
          appIface.toLowerCase().includes(iface.name.toLowerCase()) ||
          iface.name.toLowerCase().includes(appIface.toLowerCase())
        )
      );
    });
  } else if (searchDataObjectsOnly) {
    const matchingDataObjects = context.dataObjects.filter(dataObj =>
      dataObj.name.toLowerCase().includes(searchLower) ||
      (dataObj.displayName && dataObj.displayName.toLowerCase().includes(searchLower))
    );
    
    matchingApplications = context.applications.filter(app => {
      if (!app.dataObjects) return false;
      const appDataObjects = app.dataObjects.split(';').map(d => d.trim());
      return matchingDataObjects.some(dataObj =>
        appDataObjects.some(appDataObj => 
          appDataObj.toLowerCase().includes(dataObj.name.toLowerCase()) ||
          dataObj.name.toLowerCase().includes(appDataObj.toLowerCase())
        )
      );
    });
  } else if (searchInitiativesOnly) {
    const matchingInitiatives = context.initiatives.filter(init =>
      init.name.toLowerCase().includes(searchLower) ||
      (init.displayName && init.displayName.toLowerCase().includes(searchLower))
    );
    
    matchingApplications = context.applications.filter(app => {
      if (!app.initiatives) return false;
      const appInitiatives = app.initiatives.split(';').map(i => i.trim());
      return matchingInitiatives.some(init =>
        appInitiatives.some(appInit => 
          appInit.toLowerCase().includes(init.name.toLowerCase()) ||
          init.name.toLowerCase().includes(appInit.toLowerCase())
        )
      );
    });
  }

  // Find capabilities that have these applications
  return context.allCapabilities.filter(cap => {
    const capabilityApps = getApplicationsForCapability(cap.name, context.applications);
    return capabilityApps.some(app => 
      matchingApplications.some(matchApp => matchApp.id === app.id)
    );
  });
}

// Helper function to get minimal related capabilities - only matching capabilities and their necessary parents
function getMinimalRelatedCapabilities(matchedCapabilities: BusinessCapability[], allCapabilities: BusinessCapability[]): BusinessCapability[] {
  const relatedCapabilities = new Set<BusinessCapability>();
  
  matchedCapabilities.forEach(cap => {
    // Add the matched capability itself
    relatedCapabilities.add(cap);
    
    // Add parent capabilities for context (needed for navigation)
    if (cap.level === 2 || cap.level === 3) {
      const parentCaps = allCapabilities.filter(parent => {
        if (cap.level === 2) {
          return parent.level === 1 && parent.name === cap.level1Capability;
        } else if (cap.level === 3) {
          return (parent.level === 1 && parent.name === cap.level1Capability) ||
                 (parent.level === 2 && parent.name === cap.level2Capability);
        }
        return false;
      });
      parentCaps.forEach(parent => relatedCapabilities.add(parent));
    }
  });
  
  return Array.from(relatedCapabilities);
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