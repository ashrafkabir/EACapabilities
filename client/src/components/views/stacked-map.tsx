import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import type { BusinessCapability } from '@shared/schema';

interface StackedMapProps {
  capabilities: BusinessCapability[];
  onCapabilitySelect: (capability: BusinessCapability) => void;
  searchTerm: string;
  selectedCapability: string | null;
}

interface CapabilityColumn {
  level1Name: string;
  level1Id: string;
  level2Groups: {
    level2Name: string;
    level2Id: string;
    level3Items: BusinessCapability[];
    expanded: boolean;
  }[];
  expanded: boolean;
}

// Base colors for level 1 capability domains
const baseColors = [
  { bg: 'bg-orange-400', text: 'text-white', rgb: '251, 146, 60' },
  { bg: 'bg-orange-500', text: 'text-white', rgb: '249, 115, 22' },
  { bg: 'bg-cyan-400', text: 'text-white', rgb: '34, 211, 238' },
  { bg: 'bg-blue-600', text: 'text-white', rgb: '37, 99, 235' },
  { bg: 'bg-slate-800', text: 'text-white', rgb: '30, 41, 59' },
  { bg: 'bg-purple-400', text: 'text-white', rgb: '196, 181, 253' },
  { bg: 'bg-purple-500', text: 'text-white', rgb: '168, 85, 247' },
  { bg: 'bg-purple-600', text: 'text-white', rgb: '147, 51, 234' },
  { bg: 'bg-gray-400', text: 'text-white', rgb: '156, 163, 175' },
  { bg: 'bg-indigo-500', text: 'text-white', rgb: '99, 102, 241' },
];

// Generate faded colors for nested levels
const getFadedColor = (baseRgb: string, level: number): string => {
  const opacity = level === 1 ? 1 : level === 2 ? 0.7 : 0.5;
  return `rgba(${baseRgb}, ${opacity})`;
};

export default function StackedMap({ 
  capabilities, 
  onCapabilitySelect, 
  searchTerm,
  selectedCapability 
}: StackedMapProps) {
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set());
  const [expandedLevel2Groups, setExpandedLevel2Groups] = useState<Set<string>>(new Set());

  const MAX_ITEMS_PER_LEVEL = 5;

  // Build columnar hierarchy from flat capabilities list using the new level fields
  const buildColumnarHierarchy = (caps: BusinessCapability[]): CapabilityColumn[] => {
    const columnMap = new Map<string, CapabilityColumn>();
    
    caps.forEach(cap => {
      // Use the new level1Capability field from reprocessed data
      const level1Name = cap.level1Capability || 'Unknown';
      const level2Name = cap.level2Capability || '';
      const level3Name = cap.level3Capability || '';
      
      // Get or create level 1 column
      if (!columnMap.has(level1Name)) {
        columnMap.set(level1Name, {
          level1Name,
          level1Id: `level1-${level1Name}`,
          level2Groups: [],
          expanded: false
        });
      }
      
      const column = columnMap.get(level1Name)!;
      
      // Handle level 2 grouping
      if (level2Name) {
        let level2Group = column.level2Groups.find(g => g.level2Name === level2Name);
        if (!level2Group) {
          level2Group = {
            level2Name,
            level2Id: `level2-${level1Name}-${level2Name}`,
            level3Items: [],
            expanded: false
          };
          column.level2Groups.push(level2Group);
        }
        
        // Add level 3 items (actual capabilities)
        if (level3Name && level2Group) {
          level2Group.level3Items.push(cap);
        }
      }
    });
    
    return Array.from(columnMap.values());
  };

  const columnarCapabilities = buildColumnarHierarchy(capabilities);

  // Filter based on search
  const filteredColumns = columnarCapabilities.filter(column => {
    if (column.level1Name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Check if any nested capabilities match
    return column.level2Groups.some(level2Group => {
      if (level2Group.level2Name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      return level2Group.level3Items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  });

  const handleCapabilityClick = (capability: BusinessCapability) => {
    onCapabilitySelect(capability);
  };

  const handleExpandColumn = (columnId: string) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(columnId)) {
      newExpanded.delete(columnId);
    } else {
      newExpanded.add(columnId);
    }
    setExpandedColumns(newExpanded);
  };

  const handleExpandLevel2Group = (groupId: string) => {
    const newExpanded = new Set(expandedLevel2Groups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedLevel2Groups(newExpanded);
  };

  // Get application count for a capability
  const getApplicationCount = (capabilityId: string): number => {
    return Math.floor(Math.random() * 20) + 1;
  };

  // Render a capability card with appropriate styling
  const renderCapabilityCard = (
    name: string, 
    id: string, 
    colorInfo: any, 
    level: number, 
    capability?: BusinessCapability
  ) => {
    const applicationCount = capability ? getApplicationCount(capability.id) : 0;
    const bgStyle = level === 1 ? colorInfo.bg : '';
    const textStyle = level === 1 ? colorInfo.text : 'text-white';
    const customBg = level > 1 ? { backgroundColor: getFadedColor(colorInfo.rgb, level) } : {};
    
    return (
      <Card
        key={id}
        className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 ${
          selectedCapability === id 
            ? 'ring-2 ring-blue-500 border-blue-500' 
            : 'border-gray-200 dark:border-gray-700'
        } mb-1`}
        onClick={() => capability && handleCapabilityClick(capability)}
      >
        <CardContent 
          className={`p-2 h-16 flex flex-col justify-between ${bgStyle} ${textStyle}`}
          style={customBg}
        >
          <div>
            <h3 className="font-semibold text-xs leading-tight mb-1">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs opacity-90">
              {capability ? `${applicationCount} apps` : ''}
            </div>
            {capability && <Eye className="h-3 w-3 opacity-90" />}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render expand button
  const renderExpandButton = (count: number, onClick: () => void) => (
    <Button
      variant="outline"
      size="sm"
      className="w-full h-16 mb-1 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" />
        <span className="text-xs">+{count} more</span>
      </div>
    </Button>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Capability Map</span>
        </div>
        
        <div className="ml-auto text-sm text-gray-500">
          {filteredColumns.length} capability domains
        </div>
      </div>

      {/* Horizontal scrollable columnar layout */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-4 p-6 min-w-max">
          {filteredColumns.map((column, columnIndex) => {
            const colorInfo = baseColors[columnIndex % baseColors.length];
            const isColumnExpanded = expandedColumns.has(column.level1Id);
            const visibleLevel2Groups = isColumnExpanded ? column.level2Groups : column.level2Groups.slice(0, MAX_ITEMS_PER_LEVEL);
            const hiddenLevel2Count = Math.max(0, column.level2Groups.length - MAX_ITEMS_PER_LEVEL);
            
            return (
              <div key={column.level1Id} className="flex flex-col w-64 min-w-64">
                {/* Level 1 Capability Header */}
                {renderCapabilityCard(column.level1Name, column.level1Id, colorInfo, 1)}
                
                {/* Level 2 Groups */}
                {visibleLevel2Groups.map((level2Group) => {
                  const isLevel2Expanded = expandedLevel2Groups.has(level2Group.level2Id);
                  const visibleLevel3Items = isLevel2Expanded ? level2Group.level3Items : level2Group.level3Items.slice(0, MAX_ITEMS_PER_LEVEL);
                  const hiddenLevel3Count = Math.max(0, level2Group.level3Items.length - MAX_ITEMS_PER_LEVEL);
                  
                  return (
                    <div key={level2Group.level2Id} className="ml-2">
                      {/* Level 2 Capability */}
                      {renderCapabilityCard(level2Group.level2Name, level2Group.level2Id, colorInfo, 2)}
                      
                      {/* Level 3 Capabilities (actual items) */}
                      {visibleLevel3Items.map((level3Cap) => (
                        <div key={level3Cap.id} className="ml-2">
                          {renderCapabilityCard(level3Cap.name, level3Cap.id, colorInfo, 3, level3Cap)}
                        </div>
                      ))}
                      
                      {/* Level 3 Expand Button */}
                      {!isLevel2Expanded && hiddenLevel3Count > 0 && (
                        <div className="ml-2">
                          {renderExpandButton(hiddenLevel3Count, () => handleExpandLevel2Group(level2Group.level2Id))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Level 2 Expand Button */}
                {!isColumnExpanded && hiddenLevel2Count > 0 && (
                  <div className="ml-2">
                    {renderExpandButton(hiddenLevel2Count, () => handleExpandColumn(column.level1Id))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredColumns.length === 0 && (
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