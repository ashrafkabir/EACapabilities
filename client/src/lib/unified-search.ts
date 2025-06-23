import type { BusinessCapability } from "@shared/schema";

/**
 * Hierarchical search for business capabilities
 * When a capability matches, includes the entire capability tree (parents and children)
 * This ensures consistent filtering across all views
 */
export function filterCapabilitiesByName(
  allCapabilities: BusinessCapability[],
  searchTerm: string
): BusinessCapability[] {
  if (!searchTerm?.trim() || !allCapabilities || !Array.isArray(allCapabilities)) {
    return allCapabilities || [];
  }

  const searchLower = searchTerm.toLowerCase().trim();
  const matchingCapabilities = new Set<string>();
  
  // First pass: find direct matches
  const directMatches = allCapabilities.filter(cap => {
    if (!cap || !cap.name) return false;
    
    const nameMatch = cap.name.toLowerCase().includes(searchLower);
    const displayNameMatch = cap.displayName && cap.displayName.toLowerCase().includes(searchLower);
    
    if (nameMatch || displayNameMatch) {
      matchingCapabilities.add(cap.id);
      return true;
    }
    return false;
  });
  
  console.log('Unified Search: Direct matches found:', directMatches.length, directMatches.map(c => c.name));
  
  // Second pass: include complete hierarchy trees for matches
  directMatches.forEach(matchedCap => {
    console.log('Unified Search: Processing hierarchy for:', matchedCap.name, 'Level:', matchedCap.level);
    
    // Include all children of this capability
    allCapabilities.forEach(cap => {
      if (cap.level1Capability === matchedCap.name ||
          cap.level2Capability === matchedCap.name ||
          cap.level3Capability === matchedCap.name) {
        matchingCapabilities.add(cap.id);
      }
    });
    
    // Include all parents of this capability
    if (matchedCap.level >= 2 && matchedCap.level1Capability) {
      const level1Parent = allCapabilities.find(cap => 
        cap.level === 1 && cap.name === matchedCap.level1Capability
      );
      if (level1Parent) {
        matchingCapabilities.add(level1Parent.id);
        console.log('Unified Search: Added L1 parent:', level1Parent.name);
      }
    }
    
    if (matchedCap.level === 3 && matchedCap.level2Capability) {
      const level2Parent = allCapabilities.find(cap => 
        cap.level === 2 && cap.name === matchedCap.level2Capability
      );
      if (level2Parent) {
        matchingCapabilities.add(level2Parent.id);
        console.log('Unified Search: Added L2 parent:', level2Parent.name);
      }
    }
  });
  
  // Return all capabilities that are part of matching trees
  const result = allCapabilities.filter(cap => matchingCapabilities.has(cap.id));
  console.log('Unified Search: Final result count:', result.length, 'IDs:', Array.from(matchingCapabilities));
  
  return result;
}

/**
 * Get hierarchy path for a capability (for display purposes)
 */
export function getCapabilityPath(capability: BusinessCapability): string {
  if (!capability) {
    return '';
  }
  
  const parts = [
    capability.level1Capability,
    capability.level2Capability, 
    capability.level3Capability
  ].filter(Boolean);
  
  return parts.join(' > ');
}