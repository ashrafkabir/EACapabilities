import type { BusinessCapability, Application, DataObject } from "@shared/schema";

export interface NetworkNode {
  id: string;
  name: string;
  type: 'capability' | 'application' | 'component' | 'dataObject';
  level: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  data?: any;
}

export interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: 'supports' | 'feeds' | 'uses' | 'contains';
}

export function buildHierarchy(capabilities: BusinessCapability[]): BusinessCapability[] {
  const capabilityMap = new Map<string, BusinessCapability & { children: BusinessCapability[] }>();
  
  // Initialize all capabilities
  capabilities.forEach(cap => {
    capabilityMap.set(cap.id, { ...cap, children: [] });
  });
  
  const roots: (BusinessCapability & { children: BusinessCapability[] })[] = [];
  
  // Build hierarchy
  capabilities.forEach(cap => {
    const capWithChildren = capabilityMap.get(cap.id)!;
    
    if (cap.parentId && capabilityMap.has(cap.parentId)) {
      const parent = capabilityMap.get(cap.parentId)!;
      parent.children.push(capWithChildren);
    } else {
      roots.push(capWithChildren);
    }
  });
  
  return roots;
}

export function generateNetworkData(
  capabilities: BusinessCapability[],
  applications: Application[],
  dataObjects: DataObject[],
  selectedCapability?: string
): { nodes: NetworkNode[]; links: NetworkLink[] } {
  const nodes: NetworkNode[] = [];
  const links: NetworkLink[] = [];
  
  // Add capability nodes
  const relevantCapabilities = selectedCapability 
    ? capabilities.filter(cap => cap.id === selectedCapability || cap.parentId === selectedCapability)
    : capabilities.slice(0, 10); // Limit for performance
  
  relevantCapabilities.forEach(cap => {
    nodes.push({
      id: cap.id,
      name: cap.displayName || cap.name,
      type: 'capability',
      level: cap.level || 1,
      data: cap
    });
  });
  
  // Add application nodes related to capabilities
  const capabilityNames = new Set(relevantCapabilities.map(c => c.name));
  const relevantApps = applications.filter(app => {
    if (!app.businessCapabilities) return false;
    
    // Check if any of the app's capabilities match our relevant capabilities
    const appCapabilities = app.businessCapabilities.split(';').map(cap => cap.trim().replace(/^~/, ''));
    return appCapabilities.some(appCap => 
      capabilityNames.has(appCap) || 
      Array.from(capabilityNames).some(capName => 
        appCap.includes(capName) || capName.includes(appCap)
      )
    );
  }).slice(0, 20);
  
  relevantApps.forEach(app => {
    nodes.push({
      id: app.id,
      name: app.displayName || app.name,
      type: 'application',
      level: 2,
      data: app
    });
    
    // Create links from capabilities to applications
    if (selectedCapability) {
      links.push({
        source: selectedCapability,
        target: app.id,
        type: 'supports'
      });
    }
  });
  
  // Add some data object nodes
  const relevantDataObjects = dataObjects.slice(0, 15);
  relevantDataObjects.forEach(obj => {
    nodes.push({
      id: obj.id,
      name: obj.displayName || obj.name,
      type: 'dataObject',
      level: 3,
      data: obj
    });
    
    // Create some sample links to applications
    const randomApp = relevantApps[Math.floor(Math.random() * relevantApps.length)];
    if (randomApp) {
      links.push({
        source: randomApp.id,
        target: obj.id,
        type: 'uses'
      });
    }
  });
  
  return { nodes, links };
}

export function generateHeatmapData(
  capabilities: BusinessCapability[],
  applications: Application[],
  metric: string = 'applicationCount'
): any {
  const metrics = ['Application Count', 'Risk Score', 'Business Value', 'Tech Debt', 'Usage'];
  const capabilityNames = capabilities.slice(0, 10).map(c => c.displayName || c.name);
  
  const data: any[] = [];
  
  capabilityNames.forEach((capName, x) => {
    metrics.forEach((metricName, y) => {
      let value: number;
      
      switch (metric) {
        case 'applicationCount':
          value = Math.floor(Math.random() * 50) + 5;
          break;
        case 'riskScore':
          value = Math.random() * 100;
          break;
        case 'businessValue':
          value = Math.random() * 100;
          break;
        default:
          value = Math.random() * 100;
      }
      
      data.push({
        capability: capName,
        metric: metricName,
        value,
        x,
        y
      });
    });
  });
  
  return {
    data,
    capabilities: capabilityNames,
    metrics
  };
}

export function generateDashboardMetrics(
  capabilities: BusinessCapability[],
  applications: Application[],
  dataObjects: DataObject[]
): any {
  const domainCounts = new Map<string, number>();
  applications.forEach(app => {
    const domain = app.businessDomain || 'Unknown';
    domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
  });
  
  const applicationsByDomain = Array.from(domainCounts.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  
  const riskDistribution = [
    { risk: 'low', count: Math.floor(applications.length * 0.6) },
    { risk: 'medium', count: Math.floor(applications.length * 0.3) },
    { risk: 'high', count: Math.floor(applications.length * 0.1) },
  ];
  
  const recentActivity = applications.slice(0, 5).map(app => ({
    id: app.id,
    name: app.displayName || app.name,
    type: 'Application',
    domain: app.businessDomain || 'Unknown',
    status: 'active',
    lastUpdated: '2 hours ago'
  }));
  
  return {
    totalApplications: applications.length,
    totalInterfaces: Math.floor(applications.length * 1.5), // Estimated
    totalCapabilities: capabilities.length,
    totalInitiatives: Math.floor(applications.length * 0.3), // Estimated
    applicationsByDomain,
    riskDistribution,
    recentActivity
  };
}
