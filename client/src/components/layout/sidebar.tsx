import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, Search, Building, Users, Factory, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BusinessCapability } from "@shared/schema";

interface SidebarProps {
  onCapabilitySelect: (capabilityId: string) => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
  filters: {
    capabilities: boolean;
    applications: boolean;
    components: boolean;
    interfaces: boolean;
    capabilityLevel: string;
  };
  onFiltersChange: (filters: any) => void;
  selectedCapability: string | null;
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
  filters,
  onFiltersChange,
  selectedCapability
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

  const handleFilterChange = (filterKey: string, value: boolean | string) => {
    onFiltersChange({
      ...filters,
      [filterKey]: value,
    });
  };

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
              onCapabilitySelect(node.id);
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
          Enterprise Architecture Navigator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Navigate capabilities, applications & components
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search capabilities and applications..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Capability Level Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Capability Level</label>
          <Select
            value={filters.capabilityLevel}
            onValueChange={(value) => handleFilterChange('capabilityLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
            </SelectContent>
          </Select>
        </div>


        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="capabilities"
              checked={filters.capabilities}
              onCheckedChange={(checked) => handleFilterChange('capabilities', !!checked)}
            />
            <label htmlFor="capabilities" className="text-sm">Business Capabilities</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="applications"
              checked={filters.applications}
              onCheckedChange={(checked) => handleFilterChange('applications', !!checked)}
            />
            <label htmlFor="applications" className="text-sm">Applications</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="components"
              checked={filters.components}
              onCheckedChange={(checked) => handleFilterChange('components', !!checked)}
            />
            <label htmlFor="components" className="text-sm">IT Components</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="interfaces"
              checked={filters.interfaces}
              onCheckedChange={(checked) => handleFilterChange('interfaces', !!checked)}
            />
            <label htmlFor="interfaces" className="text-sm">Interfaces</label>
          </div>
        </div>
      </div>

      {/* Capability Tree */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h3 className="font-medium text-foreground mb-3">Business Capabilities</h3>
        </div>
        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-1">
            {hierarchy.map(node => renderCapabilityNode(node))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
