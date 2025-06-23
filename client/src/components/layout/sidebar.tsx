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
    <div className="w-80 h-full bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/80 border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-8 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-slate-50/80 to-blue-50/50 dark:from-slate-800/80 dark:to-slate-900">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
              REA Toolkit
            </h1>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold -mt-1">
              From Standards to Solutions
            </p>
          </div>
        </div>
        {searchScope && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {searchScope}
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search business capabilities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
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