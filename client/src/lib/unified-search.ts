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

/**
 * Universal search function that finds L1 capabilities based on search term and filters
 * Returns L1 capabilities that have dependent associations matching the search criteria
 */
export function findMatchingL1Capabilities(
  searchTerm: string,
  filters: SearchFilters,
  context: SearchContext
): BusinessCapability[] {
  if (!searchTerm.trim()) {
    return context.allCapabilities.filter(cap => cap.level === 1);
  }

  const searchLower = searchTerm.toLowerCase().trim();
  const matchingL1Capabilities = new Set<string>();

  // 1. Direct capability name matches (all levels)
  if (filters.capabilities) {
    context.allCapabilities.forEach(cap => {
      if (cap.name.toLowerCase().includes(searchLower) || 
          (cap.displayName && cap.displayName.toLowerCase().includes(searchLower))) {
        // Get the L1 capability for this match
        const l1Name = cap.level === 1 ? cap.name : cap.level1Capability;
        if (l1Name) {
          matchingL1Capabilities.add(l1Name);
        }
      }
    });
  }

  // 2. Application name matches
  if (filters.applications) {
    context.applications.forEach(app => {
      if (app.name.toLowerCase().includes(searchLower) || 
          (app.displayName && app.displayName.toLowerCase().includes(searchLower))) {
        // Find L1 capabilities associated with this application
        const l1Caps = getL1CapabilitiesForApplication(app, context.allCapabilities);
        l1Caps.forEach(capName => matchingL1Capabilities.add(capName));
      }
    });
  }

  // 3. IT Component name matches
  if (filters.components) {
    context.itComponents.forEach(component => {
      if (component.name.toLowerCase().includes(searchLower) || 
          (component.displayName && component.displayName.toLowerCase().includes(searchLower))) {
        // Find applications using this component, then their L1 capabilities
        const relatedApps = getApplicationsForITComponent(component, context.applications);
        relatedApps.forEach(app => {
          const l1Caps = getL1CapabilitiesForApplication(app, context.allCapabilities);
          l1Caps.forEach(capName => matchingL1Capabilities.add(capName));
        });
      }
    });
  }

  // 4. Interface name matches
  if (filters.interfaces) {
    context.interfaces.forEach(intf => {
      if (intf.name.toLowerCase().includes(searchLower)) {
        // Find applications connected to this interface, then their L1 capabilities
        const relatedApps = getApplicationsForInterface(intf, context.applications);
        relatedApps.forEach(app => {
          const l1Caps = getL1CapabilitiesForApplication(app, context.allCapabilities);
          l1Caps.forEach(capName => matchingL1Capabilities.add(capName));
        });
      }
    });
  }

  // 5. Data Object name matches
  if (filters.dataObjects) {
    context.dataObjects.forEach(dataObj => {
      if (dataObj.name.toLowerCase().includes(searchLower) || 
          (dataObj.displayName && dataObj.displayName.toLowerCase().includes(searchLower))) {
        // Find interfaces using this data object, then applications, then L1 capabilities
        const relatedInterfaces = getInterfacesForDataObject(dataObj, context.interfaces);
        const relatedApps = new Set<Application>();
        
        relatedInterfaces.forEach(intf => {
          const apps = getApplicationsForInterface(intf, context.applications);
          apps.forEach(app => relatedApps.add(app));
        });

        // Also check direct application relationships
        const directApps = getApplicationsForDataObject(dataObj, context.applications);
        directApps.forEach(app => relatedApps.add(app));

        relatedApps.forEach(app => {
          const l1Caps = getL1CapabilitiesForApplication(app, context.allCapabilities);
          l1Caps.forEach(capName => matchingL1Capabilities.add(capName));
        });
      }
    });
  }

  // 6. Initiative name matches
  if (filters.initiatives) {
    context.initiatives.forEach(initiative => {
      if (initiative.name.toLowerCase().includes(searchLower) || 
          (initiative.description && initiative.description.toLowerCase().includes(searchLower))) {
        // Find L1 capabilities directly associated with this initiative
        if (initiative.businessCapabilities) {
          const capNames = initiative.businessCapabilities.split(';')
            .map(cap => cap.trim().replace(/^~/, ''));
          
          capNames.forEach(capName => {
            const capability = context.allCapabilities.find(cap => cap.name === capName);
            if (capability) {
              const l1Name = capability.level === 1 ? capability.name : capability.level1Capability;
              if (l1Name) {
                matchingL1Capabilities.add(l1Name);
              }
            }
          });
        }

        // Also find applications associated with this initiative, then their L1 capabilities
        if (initiative.applications) {
          const appNames = initiative.applications.split(';').map(app => app.trim());
          appNames.forEach(appName => {
            const app = context.applications.find(a => a.name === appName);
            if (app) {
              const l1Caps = getL1CapabilitiesForApplication(app, context.allCapabilities);
              l1Caps.forEach(capName => matchingL1Capabilities.add(capName));
            }
          });
        }
      }
    });
  }

  // Return the actual L1 capability objects
  return context.allCapabilities.filter(cap => 
    cap.level === 1 && matchingL1Capabilities.has(cap.name)
  );
}

/**
 * Get L1 capability names for a given application
 */
function getL1CapabilitiesForApplication(app: Application, allCapabilities: BusinessCapability[]): string[] {
  if (!app.businessCapabilities) return [];

  const capNames = app.businessCapabilities.split(';')
    .map(cap => cap.trim().replace(/^~/, ''));

  const l1Names = new Set<string>();
  
  capNames.forEach(capName => {
    const capability = allCapabilities.find(cap => cap.name === capName);
    if (capability) {
      const l1Name = capability.level === 1 ? capability.name : capability.level1Capability;
      if (l1Name) {
        l1Names.add(l1Name);
      }
    }
  });

  return Array.from(l1Names);
}

/**
 * Get applications that use a specific IT component
 */
function getApplicationsForITComponent(component: ITComponent, applications: Application[]): Application[] {
  return applications.filter(app => 
    app.itComponentDisplayName === component.name ||
    app.itComponentDisplayName === component.displayName
  );
}

/**
 * Get applications connected to a specific interface
 */
function getApplicationsForInterface(intf: Interface, applications: Application[]): Application[] {
  const relatedApps = new Set<Application>();
  
  if (intf.sourceApplication) {
    const sourceApp = applications.find(app => app.name === intf.sourceApplication);
    if (sourceApp) relatedApps.add(sourceApp);
  }
  
  if (intf.targetApplication) {
    const targetApp = applications.find(app => app.name === intf.targetApplication);
    if (targetApp) relatedApps.add(targetApp);
  }
  
  return Array.from(relatedApps);
}

/**
 * Get interfaces that use a specific data object
 */
function getInterfacesForDataObject(dataObj: DataObject, interfaces: Interface[]): Interface[] {
  return interfaces.filter(intf => 
    intf.dataObjects && intf.dataObjects.includes(dataObj.name)
  );
}

/**
 * Get applications directly related to a data object
 */
function getApplicationsForDataObject(dataObj: DataObject, applications: Application[]): Application[] {
  if (!dataObj.relDataObjectToApplication) return [];
  
  const appNames = dataObj.relDataObjectToApplication.split(';').map(name => name.trim());
  return applications.filter(app => appNames.includes(app.name));
}

/**
 * Filter capabilities based on search results
 */
export function filterCapabilitiesBySearch(
  capabilities: BusinessCapability[],
  searchTerm: string,
  filters: SearchFilters,
  context: SearchContext
): BusinessCapability[] {
  if (!searchTerm.trim()) return capabilities;

  const matchingL1Capabilities = findMatchingL1Capabilities(searchTerm, filters, context);
  const matchingL1Names = new Set(matchingL1Capabilities.map(cap => cap.name));

  // Return capabilities that are either:
  // 1. L1 capabilities that match
  // 2. Child capabilities of matching L1 capabilities
  return capabilities.filter(cap => {
    if (cap.level === 1) {
      return matchingL1Names.has(cap.name);
    } else {
      return cap.level1Capability && matchingL1Names.has(cap.level1Capability);
    }
  });
}