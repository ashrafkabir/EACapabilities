import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application, Initiative } from "@shared/schema";

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  displayName?: string;
  type: 'capability' | 'application';
  level: number;
  parentId?: string;
  applications?: Application[];
  initiatives?: Initiative[];
  children?: NetworkNode[];
  radius: number;
  color: string;
  data: any;
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: 'hierarchy' | 'supports';
}

interface NetworkViewProps {
  selectedCapability: string | null;
  onEntitySelect: (entity: EntityReference) => void;
  searchTerm: string;
}

export default function NetworkView({
  selectedCapability,
  onEntitySelect,
  searchTerm
}: NetworkViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { data: capabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities/hierarchy'],
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const { data: initiatives = [] } = useQuery<Initiative[]>({
    queryKey: ['/api/initiatives'],
  });

  // Build network data based on current level and selected parent
  const buildNetworkData = () => {
    const nodes: NetworkNode[] = [];
    const links: NetworkLink[] = [];

    // Filter capabilities based on current level and parent
    let filteredCapabilities = capabilities.filter(cap => {
      if (currentLevel === 1) {
        return cap.level === 1;
      } else if (currentLevel === 2 && selectedParent) {
        return cap.level === 2 && cap.parentId === selectedParent;
      } else if (currentLevel === 3 && selectedParent) {
        return cap.level === 3 && cap.parentId === selectedParent;
      }
      return false;
    });

    // Apply search filter
    if (searchTerm) {
      filteredCapabilities = filteredCapabilities.filter(cap =>
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cap.displayName && cap.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Create nodes for capabilities
    filteredCapabilities.forEach(cap => {
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

      const node: NetworkNode = {
        id: cap.id,
        name: cap.name,
        displayName: cap.displayName ?? undefined,
        type: 'capability',
        level: cap.level || 1,
        parentId: cap.parentId ?? undefined,
        applications: relatedApps,
        initiatives: relatedInitiatives,
        radius: Math.max(20, Math.min(50, 20 + relatedApps.length * 2)),
        color: cap.level === 1 ? '#3b82f6' : cap.level === 2 ? '#10b981' : '#f59e0b',
        data: cap
      };

      nodes.push(node);
    });

    return { nodes, links };
  };

  const { nodes, links } = buildNetworkData();

  // D3 force simulation
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 800;

    // Clear existing content
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create container for zoomable content
    const container = svg.append("g");

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 10));

    // Create links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create nodes
    const node = container.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        setHoveredNode(d as NetworkNode);
        setMousePosition({ x: event.pageX, y: event.pageY });
      })
      .on("mousemove", (event) => {
        setMousePosition({ x: event.pageX, y: event.pageY });
      })
      .on("mouseout", () => {
        setHoveredNode(null);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        const nodeData = d as NetworkNode;
        
        // Left click - drill down
        if (nodeData.type === 'capability') {
          const hasChildren = capabilities.some(cap => cap.parentId === nodeData.id);
          
          if (hasChildren && currentLevel < 3) {
            setSelectedParent(nodeData.id);
            setCurrentLevel(currentLevel + 1);
          } else if (nodeData.applications && nodeData.applications.length > 0) {
            // Show applications if no children
            onEntitySelect({
              type: 'capability',
              id: nodeData.id,
              data: nodeData.data
            });
          }
        }
      })
      .on("contextmenu", (event, d) => {
        event.preventDefault();
        const nodeData = d as NetworkNode;
        
        // Right click - show details
        onEntitySelect({
          type: 'capability',
          id: nodeData.id,
          data: nodeData.data
        });
      })
      .call(d3.drag<any, NetworkNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add labels
    const labels = container.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.displayName || d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("fill", "#fff")
      .style("pointer-events", "none")
      .style("user-select", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links, capabilities, applications, initiatives]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node()!);
    svg.transition().duration(300).call(
      (svg as any).call(d3.zoom().transform, currentTransform.scale(1.5))
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node()!);
    svg.transition().duration(300).call(
      (svg as any).call(d3.zoom().transform, currentTransform.scale(0.75))
    );
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      (svg as any).call(d3.zoom().transform, d3.zoomIdentity)
    );
  };

  const handleGoBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      if (currentLevel === 2) {
        setSelectedParent(null);
      } else {
        // Find parent of current selected parent
        const currentParent = capabilities.find(cap => cap.id === selectedParent);
        setSelectedParent(currentParent?.parentId || null);
      }
    }
  };

  const getCurrentLevelName = () => {
    if (currentLevel === 1) return "Level 1 - Core Capabilities";
    if (currentLevel === 2) {
      const parent = capabilities.find(cap => cap.id === selectedParent);
      return `Level 2 - ${parent?.displayName || parent?.name || 'Sub-capabilities'}`;
    }
    if (currentLevel === 3) {
      const parent = capabilities.find(cap => cap.id === selectedParent);
      return `Level 3 - ${parent?.displayName || parent?.name || 'Detail Capabilities'}`;
    }
    return "Capability Map";
  };

  return (
    <div className="h-full bg-background relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-medium text-foreground">{getCurrentLevelName()}</h3>
                <p className="text-sm text-muted-foreground">
                  {nodes.length} capabilities • Level {currentLevel}/3
                </p>
              </div>
              {currentLevel > 1 && (
                <Button onClick={handleGoBack} variant="outline" size="sm">
                  Back to Level {currentLevel - 1}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-2">
            <div className="flex gap-1">
              <Button onClick={handleZoomIn} variant="ghost" size="sm">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button onClick={handleZoomOut} variant="ghost" size="sm">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button onClick={handleReset} variant="ghost" size="sm">
                <RotateCcw className="h-4 w-4" />
              </Button>
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
              <p><strong>Drag:</strong> Reposition nodes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Visualization */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: 'translate(0, -100%)'
          }}
        >
          <Card className="shadow-xl border-2">
            <CardContent className="p-3 min-w-64">
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-foreground">
                    {hoveredNode.displayName || hoveredNode.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    Level {hoveredNode.level}
                  </Badge>
                </div>
                
                {hoveredNode.applications && hoveredNode.applications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground">
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

                {hoveredNode.initiatives && hoveredNode.initiatives.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground">
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