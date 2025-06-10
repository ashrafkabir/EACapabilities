import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import type { EntityReference } from "@/pages/dashboard";

interface NetworkNode {
  id: string;
  name: string;
  type: 'capability' | 'application' | 'component';
  level: number;
  data?: any;
}

interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: 'supports' | 'feeds' | 'uses';
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

interface NetworkViewProps {
  selectedCapability: string | null;
  onEntitySelect: (entity: EntityReference) => void;
  searchTerm: string;
  filters: {
    capabilities: boolean;
    applications: boolean;
    components: boolean;
    interfaces: boolean;
  };
}

export default function NetworkView({
  selectedCapability,
  onEntitySelect,
  searchTerm,
  filters
}: NetworkViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const { data: networkData, isLoading } = useQuery<NetworkData>({
    queryKey: ['/api/network-data', selectedCapability, searchTerm, filters],
    enabled: true,
  });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!networkData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    
    const simulation = d3.forceSimulation<NetworkNode>(networkData.nodes)
      .force("link", d3.forceLink<NetworkNode, NetworkLink>(networkData.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create arrow markers
    svg.append("defs").selectAll("marker")
      .data(["supports", "feeds", "uses"])
      .enter().append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(networkData.links)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", d => `url(#arrow-${d.type})`);

    // Create nodes
    const nodeGroup = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node-group")
      .data(networkData.nodes)
      .enter().append("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    nodeGroup.append("circle")
      .attr("r", d => d.type === 'capability' ? 25 : d.type === 'application' ? 20 : 15)
      .attr("fill", d => {
        switch (d.type) {
          case 'capability': return "hsl(207, 90%, 54%)";
          case 'application': return "hsl(25, 95%, 53%)";
          case 'component': return "hsl(142, 76%, 36%)";
          default: return "hsl(210, 40%, 26%)";
        }
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add labels to nodes
    nodeGroup.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 35)
      .style("font-size", "12px")
      .style("fill", "hsl(var(--foreground))")
      .style("pointer-events", "none");

    // Add event handlers
    nodeGroup
      .on("click", (event, d) => {
        onEntitySelect({
          type: d.type,
          id: d.id,
          data: d.data
        });
      })
      .on("mouseover", (event, d) => {
        if (tooltipRef.current) {
          tooltipRef.current.innerHTML = `
            <strong>${d.name}</strong><br>
            Type: ${d.type}<br>
            Level: ${d.level}
          `;
          tooltipRef.current.style.left = event.pageX + 10 + 'px';
          tooltipRef.current.style.top = event.pageY - 10 + 'px';
          tooltipRef.current.style.display = 'block';
        }
      })
      .on("mouseout", () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as NetworkNode).x!)
        .attr("y1", d => (d.source as NetworkNode).y!)
        .attr("x2", d => (d.target as NetworkNode).x!)
        .attr("y2", d => (d.target as NetworkNode).y!);

      nodeGroup
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: NetworkNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [networkData, dimensions, onEntitySelect]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading network data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-muted/20 relative">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
      <div
        ref={tooltipRef}
        className="tooltip absolute hidden bg-black/80 text-white p-2 rounded text-xs pointer-events-none z-50"
      />
    </div>
  );
}
