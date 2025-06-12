import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Eye } from 'lucide-react';
import type { BusinessCapability } from '@shared/schema';

interface StackedMapProps {
  capabilities: BusinessCapability[];
  onCapabilitySelect: (capability: BusinessCapability) => void;
  searchTerm: string;
  selectedCapability: string | null;
}

interface CapabilityNode extends BusinessCapability {
  children?: CapabilityNode[];
  color?: string;
}

// Color scheme for different capability domains
const colorSchemes = [
  'bg-orange-400 text-white',
  'bg-orange-500 text-white', 
  'bg-cyan-400 text-white',
  'bg-blue-600 text-white',
  'bg-slate-800 text-white',
  'bg-purple-400 text-white',
  'bg-purple-500 text-white',
  'bg-purple-300 text-white',
  'bg-purple-600 text-white',
  'bg-gray-400 text-white',
];

export default function StackedMap({ 
  capabilities, 
  onCapabilitySelect, 
  searchTerm,
  selectedCapability 
}: StackedMapProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [parentCapability, setParentCapability] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  // Build hierarchy from flat capabilities list
  const buildHierarchy = (caps: BusinessCapability[]): CapabilityNode[] => {
    const nodes: CapabilityNode[] = caps.map(cap => ({ ...cap, children: [] }));
    const nodeMap = new Map<string, CapabilityNode>();
    
    nodes.forEach(node => {
      nodeMap.set(node.id, node);
    });

    const roots: CapabilityNode[] = [];
    
    nodes.forEach(node => {
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // Get capabilities for current view
  const getCurrentCapabilities = (): CapabilityNode[] => {
    const hierarchy = buildHierarchy(capabilities);
    
    if (currentLevel === 1) {
      return hierarchy.filter(cap => cap.level === 1);
    }
    
    if (parentCapability) {
      const parent = capabilities.find(cap => cap.id === parentCapability);
      if (parent) {
        return capabilities
          .filter(cap => cap.parentId === parentCapability)
          .map(cap => ({ ...cap, children: [] }));
      }
    }
    
    return [];
  };

  const currentCapabilities = getCurrentCapabilities();

  // Filter capabilities based on search
  const filteredCapabilities = currentCapabilities.filter(cap =>
    cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cap.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Assign colors to capabilities - ensure we spread all properties
  const capabilitiesWithColors = filteredCapabilities.map((cap, index) => ({
    id: cap.id,
    name: cap.name,
    displayName: cap.displayName,
    hierarchy: cap.hierarchy,
    parentId: cap.parentId,
    level: cap.level,
    level1: cap.level1,
    level2: cap.level2,
    level3: cap.level3,
    level1Capability: cap.level1Capability,
    level2Capability: cap.level2Capability,
    level3Capability: cap.level3Capability,
    mappedLevel1Capability: cap.mappedLevel1Capability,
    mappedToLifesciencesCapabilities: cap.mappedToLifesciencesCapabilities,
    createdAt: cap.createdAt,
    children: cap.children,
    color: colorSchemes[index % colorSchemes.length]
  }));

  const handleCapabilityClick = (capability: CapabilityNode) => {
    const hasChildren = capabilities.some(cap => cap.parentId === capability.id);
    
    if (hasChildren && currentLevel < 3) {
      // Navigate deeper
      setParentCapability(capability.id);
      setCurrentLevel(currentLevel + 1);
      setBreadcrumb([...breadcrumb, capability.name]);
    } else {
      // Show details
      onCapabilitySelect(capability);
    }
  };

  const handleBackClick = () => {
    if (currentLevel > 1) {
      const newBreadcrumb = [...breadcrumb];
      newBreadcrumb.pop();
      setBreadcrumb(newBreadcrumb);
      
      if (currentLevel === 2) {
        setParentCapability(null);
        setCurrentLevel(1);
      } else {
        // Find parent of current parent
        const currentParent = capabilities.find(cap => cap.id === parentCapability);
        if (currentParent) {
          setParentCapability(currentParent.parentId || null);
          setCurrentLevel(currentLevel - 1);
        }
      }
    }
  };

  // Get application count for a capability
  const getApplicationCount = (capabilityId: string): number => {
    // This would typically come from an API call
    // For now, return a placeholder count
    return Math.floor(Math.random() * 20) + 1;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with breadcrumb */}
      <div className="flex items-center gap-4 p-4 border-b bg-gray-50 dark:bg-gray-800">
        {currentLevel > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Level {currentLevel}</span>
          {breadcrumb.length > 0 && (
            <>
              <span>/</span>
              <span className="font-medium">{breadcrumb.join(' / ')}</span>
            </>
          )}
        </div>
        
        <div className="ml-auto text-sm text-gray-500">
          {filteredCapabilities.length} capabilities
        </div>
      </div>

      {/* Stacked capability grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {capabilitiesWithColors.map((capability) => {
            const hasChildren = capabilities.some(cap => cap.parentId === capability.id);
            const applicationCount = getApplicationCount(capability.id);
            
            return (
              <Card
                key={capability.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 ${
                  selectedCapability === capability.id 
                    ? 'ring-2 ring-blue-500 border-blue-500' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleCapabilityClick(capability)}
              >
                <CardContent className={`p-4 h-32 flex flex-col justify-between ${capability.color}`}>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight mb-1">
                      {capability.name}
                    </h3>
                    {capability.displayName && (
                      <p className="text-xs opacity-90 line-clamp-2">
                        {capability.displayName}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs opacity-90">
                      {applicationCount} apps
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {hasChildren ? (
                        <div className="text-xs opacity-90">
                          {capabilities.filter(cap => cap.parentId === capability.id).length} sub-caps
                        </div>
                      ) : (
                        <Eye className="h-3 w-3 opacity-90" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCapabilities.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">No capabilities found</p>
              {searchTerm && (
                <p className="text-sm">Try adjusting your search terms</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}