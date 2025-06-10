import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application, Initiative } from "@shared/schema";

interface MapNode {
  id: string;
  name: string;
  displayName?: string;
  level: number;
  parentId?: string;
  applications: Application[];
  initiatives: Initiative[];
  radius: number;
  color: string;
  data: BusinessCapability;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface MetisMapProps {
  selectedCapability: string | null;
  onEntitySelect: (entity: EntityReference) => void;
  searchTerm: string;
}

export default function MetisMap({
  selectedCapability,
  onEntitySelect,
  searchTerm
}: MetisMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Get flat list of all capabilities for parent-child relationship checking
  const { data: allCapabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

  const { data: hierarchicalCapabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities/hierarchy'],
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const { data: initiatives = [] } = useQuery<Initiative[]>({
    queryKey: ['/api/initiatives'],
  });

  // Build map nodes for current level
  const buildMapNodes = (): MapNode[] => {
    let filteredCapabilities = allCapabilities.filter(cap => {
      if (currentLevel === 1) {
        return cap.level === 1;
      } else if (currentLevel === 2 && selectedParent) {
        return cap.level === 2 && cap.parentId === selectedParent;
      } else if (currentLevel === 3 && selectedParent) {
        return cap.level === 3 && cap.parentId === selectedParent;
      }
      return false;
    });

    if (searchTerm) {
      filteredCapabilities = filteredCapabilities.filter(cap =>
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cap.displayName && cap.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filteredCapabilities.map(cap => {
      // Count related applications
      const relatedApps = applications.filter(app => {
        if (!app.businessCapabilities) return false;
        const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
        return appCapabilities.some(appCap => 
          cap.name === appCap || 
          cap.name.includes(appCap) || 
          appCap.includes(cap.name)
        );
      });

      // Count related initiatives
      const relatedInitiatives = initiatives.filter(init => 
        init.businessCapabilities && init.businessCapabilities.includes(cap.name)
      );

      return {
        id: cap.id,
        name: cap.name,
        displayName: cap.displayName || undefined,
        level: cap.level || 1,
        parentId: cap.parentId || undefined,
        applications: relatedApps,
        initiatives: relatedInitiatives,
        radius: Math.max(25, Math.min(60, 25 + relatedApps.length * 3)),
        color: cap.level === 1 ? '#3b82f6' : cap.level === 2 ? '#10b981' : '#f59e0b',
        data: cap
      };
    });
  };

  const nodes = buildMapNodes();

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 600;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create main container
    const container = svg.append("g");

    // Create simple grid layout for Level 1, force simulation for others
    if (currentLevel === 1) {
      // Grid layout for Level 1 capabilities
      const cols = Math.ceil(Math.sqrt(nodes.length));
      const rows = Math.ceil(nodes.length / cols);
      const cellWidth = width / cols;
      const cellHeight = height / rows;

      nodes.forEach((node, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        node.x = (col + 0.5) * cellWidth;
        node.y = (row + 0.5) * cellHeight;
      });
    } else {
      // Force simulation for sub-levels
      const simulation = d3.forceSimulation(nodes as any)
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius((d: any) => d.radius + 20));

      simulation.on("tick", () => {
        nodeElements
          .attr("cx", d => d.x!)
          .attr("cy", d => d.y!);

        labelElements
          .attr("x", d => d.x!)
          .attr("y", d => d.y!);
      });
    }

    // Create nodes
    const nodeElements = container.selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("opacity", 0.8)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        setHoveredNode(d);
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltipPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      })
      .on("mousemove", (event) => {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltipPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      })
      .on("mouseout", () => {
        setHoveredNode(null);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        
        // Debug logging
        console.log('Clicked capability:', d.name, 'Level:', d.level, 'Current Level:', currentLevel);
        
        // Left click - always drill down if children exist, regardless of applications
        const hasChildren = allCapabilities.some(cap => cap.parentId === d.id);
        console.log('Has children:', hasChildren, 'Children found:', allCapabilities.filter(cap => cap.parentId === d.id).length);
        
        if (hasChildren && currentLevel < 3) {
          // Drill down to next level
          console.log('Drilling down from level', currentLevel, 'to', currentLevel + 1, 'for parent:', d.id);
          setSelectedParent(d.id);
          setCurrentLevel(currentLevel + 1);
        } else {
          // No children - show applications if available
          console.log('No children, showing applications:', d.applications.length);
          if (d.applications.length > 0) {
            onEntitySelect({
              type: 'capability',
              id: d.id,
              data: d.data
            });
          }
        }
      })
      .on("contextmenu", (event, d) => {
        event.preventDefault();
        onEntitySelect({
          type: 'capability',
          id: d.id,
          data: d.data
        });
      });

    // Add labels
    const labelElements = container.selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => {
        const name = d.displayName || d.name;
        return name.length > 15 ? name.substring(0, 15) + "..." : name;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "#fff")
      .style("pointer-events", "none")
      .style("user-select", "none");

    // Position elements for grid layout
    if (currentLevel === 1) {
      nodeElements
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      labelElements
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    }

    // Add app count badges
    const badges = container.selectAll(".app-badge")
      .data(nodes.filter(d => d.applications.length > 0))
      .join("circle")
      .attr("class", "app-badge")
      .attr("r", 12)
      .attr("fill", "#ef4444")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cx", d => (d.x || 0) + (d.radius * 0.7))
      .attr("cy", d => (d.y || 0) - (d.radius * 0.7));

    const badgeText = container.selectAll(".app-badge-text")
      .data(nodes.filter(d => d.applications.length > 0))
      .join("text")
      .attr("class", "app-badge-text")
      .text(d => d.applications.length)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .attr("x", d => (d.x || 0) + (d.radius * 0.7))
      .attr("y", d => (d.y || 0) - (d.radius * 0.7))
      .style("pointer-events", "none");

  }, [nodes, currentLevel, allCapabilities]);

  const handleGoBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      if (currentLevel === 2) {
        setSelectedParent(null);
      } else {
        const currentParent = allCapabilities.find(cap => cap.id === selectedParent);
        setSelectedParent(currentParent?.parentId || null);
      }
    }
  };

  const getCurrentLevelName = () => {
    if (currentLevel === 1) return "Enterprise Capability Map";
    if (currentLevel === 2) {
      const parent = allCapabilities.find(cap => cap.id === selectedParent);
      return `${parent?.displayName || parent?.name || 'Capability'} - Level 2`;
    }
    if (currentLevel === 3) {
      const parent = allCapabilities.find(cap => cap.id === selectedParent);
      return `${parent?.displayName || parent?.name || 'Capability'} - Level 3`;
    }
    return "Capability Map";
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="shadow-lg border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {currentLevel > 1 && (
                <Button onClick={handleGoBack} variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h3 className="font-bold text-lg text-foreground">{getCurrentLevelName()}</h3>
                <p className="text-sm text-muted-foreground">
                  {nodes.length} capabilities • Level {currentLevel}/3
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="text-xs font-medium text-foreground">Legend</div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Level 1</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Level 2</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Level 3</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>App Count</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Left click:</strong> Drill down to next level</p>
              <p><strong>Right click:</strong> Show capability details</p>
              <p><strong>Hover:</strong> View applications and initiatives</p>
              <p><strong>Red badges:</strong> Application count</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SVG Map */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: tooltipPosition.x + 15,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <Card className="shadow-xl border-2 max-w-xs">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-foreground text-sm">
                    {hoveredNode.displayName || hoveredNode.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    Level {hoveredNode.level}
                  </Badge>
                </div>
                
                {hoveredNode.applications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Applications ({hoveredNode.applications.length})
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {hoveredNode.applications.slice(0, 3).map(app => (
                        <div key={app.id}>• {app.displayName || app.name}</div>
                      ))}
                      {hoveredNode.applications.length > 3 && (
                        <div>• and {hoveredNode.applications.length - 3} more...</div>
                      )}
                    </div>
                  </div>
                )}

                {hoveredNode.initiatives.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Initiatives ({hoveredNode.initiatives.length})
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {hoveredNode.initiatives.slice(0, 2).map(init => (
                        <div key={init.id}>• {init.name}</div>
                      ))}
                      {hoveredNode.initiatives.length > 2 && (
                        <div>• and {hoveredNode.initiatives.length - 2} more...</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}