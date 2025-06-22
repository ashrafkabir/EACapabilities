import { BusinessCapability, Application, ITComponent, Interface, DataObject, Initiative } from '../../shared/schema';

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
  console.log('SIMPLE SEARCH FUNCTION CALLED with term:', searchTerm);
  
  if (!searchTerm?.trim()) {
    console.log('Simple search: No search term provided');
    return [];
  }
  
  const searchLower = searchTerm.toLowerCase().trim();
  console.log('Simple search: Starting search for:', searchTerm);
  console.log('Simple search: Total capabilities available:', context.allCapabilities.length);
  
  // Find matching capabilities by name
  const directMatches = context.allCapabilities.filter(cap => {
    const nameMatch = cap.name.toLowerCase().includes(searchLower);
    if (nameMatch) {
      console.log('Simple search: Found direct match:', cap.name, 'Level:', cap.level);
    }
    return nameMatch;
  });
  
  console.log('Simple search: Direct matches found:', directMatches.length);
  
  // Add parent capabilities
  const finalResults = new Set<BusinessCapability>();
  
  directMatches.forEach(cap => {
    finalResults.add(cap);
    console.log('Simple search: Added capability:', cap.name);
    
    // Add L1 parent if this is L2 or L3
    if (cap.level === 2 || cap.level === 3) {
      const l1Parent = context.allCapabilities.find(parent => 
        parent.level === 1 && parent.name === cap.level1Capability
      );
      if (l1Parent) {
        finalResults.add(l1Parent);
        console.log('Simple search: Added L1 parent:', l1Parent.name, 'for', cap.name);
      }
    }
    
    // Add L2 parent if this is L3
    if (cap.level === 3) {
      const l2Parent = context.allCapabilities.find(parent => 
        parent.level === 2 && parent.name === cap.level2Capability
      );
      if (l2Parent) {
        finalResults.add(l2Parent);
        console.log('Simple search: Added L2 parent:', l2Parent.name, 'for', cap.name);
      }
    }
  });
  
  const results = Array.from(finalResults);
  console.log('Simple search: Final results:', results.map(c => `${c.name} (L${c.level})`));
  return results;
}