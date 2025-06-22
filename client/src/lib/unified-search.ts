import type { BusinessCapability } from "@shared/schema";

/**
 * Simple unified search for business capabilities only
 * Filters capabilities by name match at any level and returns all matching capabilities
 */
export function filterCapabilitiesByName(
  allCapabilities: BusinessCapability[],
  searchTerm: string
): BusinessCapability[] {
  if (!searchTerm.trim()) {
    return allCapabilities;
  }

  const searchLower = searchTerm.toLowerCase().trim();
  
  return allCapabilities.filter(cap => {
    // Match against name or display name
    const nameMatch = cap.name.toLowerCase().includes(searchLower);
    const displayNameMatch = cap.displayName && cap.displayName.toLowerCase().includes(searchLower);
    
    return nameMatch || displayNameMatch;
  });
}

/**
 * Get hierarchy path for a capability (for display purposes)
 */
export function getCapabilityPath(capability: BusinessCapability): string {
  const parts = [
    capability.level1Capability,
    capability.level2Capability, 
    capability.level3Capability
  ].filter(Boolean);
  
  return parts.join(' > ');
}