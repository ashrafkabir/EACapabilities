import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Building, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application } from "@shared/schema";

interface CapabilityNode extends BusinessCapability {
  children?: CapabilityNode[];
  applications?: Application[];
  isExpanded?: boolean;
}

interface HierarchyViewProps {
  selectedCapability: string | null;
  onEntitySelect: (entity: EntityReference) => void;
  searchTerm: string;
}

export default function HierarchyView({
  selectedCapability,
  onEntitySelect,
  searchTerm
}: HierarchyViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  const { data: capabilities = [], isLoading: capabilitiesLoading } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities/hierarchy'],
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  // Build hierarchical tree structure
  const buildCapabilityTree = (): CapabilityNode[] => {
    const nodeMap = new Map<string, CapabilityNode>();
    
    // Initialize all nodes
    capabilities.forEach(cap => {
      nodeMap.set(cap.id, {
        ...cap,
        children: [],
        applications: [],
        isExpanded: expandedNodes.has(cap.id)
      });
    });
    
    // Link applications to capabilities
    applications.forEach(app => {
      if (!app.businessCapabilities) return;
      
      const appCapabilities = app.businessCapabilities.split(';').map(cap => cap.trim().replace(/^~/, ''));
      
      appCapabilities.forEach(appCapName => {
        capabilities.forEach(cap => {
          if (cap.name === appCapName || 
              cap.name.includes(appCapName) || 
              appCapName.includes(cap.name)) {
            const node = nodeMap.get(cap.id);
            if (node && !node.applications?.some(a => a.id === app.id)) {
              node.applications?.push(app);
            }
          }
        });
      });
    });
    
    // Build hierarchy
    const roots: CapabilityNode[] = [];
    capabilities.forEach(cap => {
      const node = nodeMap.get(cap.id)!;
      
      if (cap.parentId && nodeMap.has(cap.parentId)) {
        const parent = nodeMap.get(cap.parentId)!;
        parent.children?.push(node);
      } else {
        roots.push(node);
      }
    });
    
    return roots.sort((a, b) => (a.level || 1) - (b.level || 1));
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCapabilityClick = (capability: CapabilityNode) => {
    // If leaf node with applications, show detail modal
    if (capability.applications && capability.applications.length > 0 && 
        (!capability.children || capability.children.length === 0)) {
      onEntitySelect({
        type: 'capability',
        id: capability.id,
        data: capability
      });
    } else {
      // Otherwise expand/collapse the node
      toggleNode(capability.id);
    }
  };

  const renderCapabilityNode = (node: CapabilityNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const hasApplications = node.applications && node.applications.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const indent = level * 24;
    
    return (
      <div key={node.id} className="mb-2">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCapability === node.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleCapabilityClick(node)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between" style={{ marginLeft: `${indent}px` }}>
              <div className="flex items-center gap-3 flex-1">
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )
                ) : (
                  <div className="w-4 h-4" />
                )}
                
                <Building className={`h-5 w-5 ${
                  level === 0 ? 'text-blue-600' : 
                  level === 1 ? 'text-green-600' : 
                  'text-orange-600'
                }`} />
                
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {node.displayName || node.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Level {level + 1}
                    </Badge>
                    {hasApplications && (
                      <Badge variant="secondary" className="text-xs">
                        {node.applications!.length} apps
                      </Badge>
                    )}
                    {node.mappedLevel1Capability && (
                      <Badge variant="outline" className="text-xs">
                        {node.mappedLevel1Capability}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {hasApplications && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEntitySelect({
                      type: 'capability',
                      id: node.id,
                      data: node
                    });
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {isExpanded && hasChildren && (
          <div className="mt-2 space-y-2">
            {node.children!.map(child => renderCapabilityNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const capabilityTree = buildCapabilityTree();
  
  // Filter by search term if provided
  const filteredTree = searchTerm 
    ? capabilityTree.filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.displayName && node.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : capabilityTree;

  if (capabilitiesLoading) {
    return (
      <div className="h-full overflow-auto bg-background">
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-muted rounded mb-6 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-foreground">
              Business Capability Hierarchy
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Building className="h-3 w-3 mr-1" />
                Level 1
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Building className="h-3 w-3 mr-1" />
                Level 2
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <Building className="h-3 w-3 mr-1" />
                Level 3
              </Badge>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Navigate through business capabilities by clicking to expand levels. 
              Capabilities with applications will show an app count badge. 
              Click the external link icon to view detailed applications and dependencies.
            </p>
          </div>

          {/* Hierarchical Tree */}
          <div className="space-y-2">
            {filteredTree.length > 0 ? (
              filteredTree.map(node => renderCapabilityNode(node, 0))
            ) : (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No capabilities found matching your search.' : 'No capabilities available.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}