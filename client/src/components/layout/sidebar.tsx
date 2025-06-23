import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, Search, Building, Users, Factory, Layers, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { BusinessCapability } from "@shared/schema";

interface SidebarProps {
  onCapabilitySelect: (capability: BusinessCapability) => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
  selectedCapability: string | null;
  searchScope?: string | null;
  filteredCapabilities: BusinessCapability[];
}

interface CapabilityNode extends BusinessCapability {
  children?: CapabilityNode[];
  applicationCount?: number;
  expanded?: boolean;
}

const getCapabilityIcon = (name: string) => {
  if (name.toLowerCase().includes('finance') || name.toLowerCase().includes('accounting')) {
    return <Building className="w-4 h-4 text-primary" />;
  }
  if (name.toLowerCase().includes('human') || name.toLowerCase().includes('hr')) {
    return <Users className="w-4 h-4 text-primary" />;
  }
  if (name.toLowerCase().includes('manufacturing') || name.toLowerCase().includes('iops')) {
    return <Factory className="w-4 h-4 text-primary" />;
  }
  return <Layers className="w-4 h-4 text-primary" />;
};

export default function Sidebar({
  onCapabilitySelect,
  onSearchChange,
  searchTerm,
  selectedCapability,
  searchScope,
  filteredCapabilities: centralFilteredCapabilities
}: SidebarProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const { data: hierarchy = [], isLoading } = useQuery<CapabilityNode[]>({
    queryKey: ['/api/business-capabilities/hierarchy'],
  });

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Filter capabilities based on search term
  const filteredHierarchy = searchTerm.trim() 
    ? hierarchy.filter(cap => 
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cap.displayName && cap.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : hierarchy;

  const renderCapabilityNode = (node: CapabilityNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedCapability === node.id;

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted/50'
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (!hasChildren || level === 0) {
              onCapabilitySelect(node);
            }
            if (hasChildren) {
              toggleNode(node.id);
            }
          }}
        >
          {hasChildren && (
            <button
              className="mr-2 p-0.5 hover:bg-muted rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-4 mr-2" />}
          
          {getCapabilityIcon(node.name)}
          
          <span className="ml-2 text-sm font-medium flex-1 truncate">
            {node.displayName || node.name}
          </span>
          
          {node.applicationCount !== undefined && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {node.applicationCount}
            </Badge>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map(child => renderCapabilityNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-card shadow-lg border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="h-6 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 bg-muted rounded animate-pulse" />
        </div>
        <div className="p-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card shadow-lg border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-medium text-foreground">
          REA Landscape Navigator
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore business capabilities and their relationships
        </p>
        {searchScope && (
          <div className="mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-primary font-medium">
              {searchScope}
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search business capabilities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Capability Tree */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredHierarchy.length > 0 ? (
            filteredHierarchy.map(node => renderCapabilityNode(node))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No capabilities found matching your search.' : 'No capabilities available.'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}