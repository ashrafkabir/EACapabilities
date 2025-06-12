import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EntityReference } from "@/pages/dashboard";

interface HeatmapCell {
  capability: string;
  metric: string;
  value: number;
  x: number;
  y: number;
}

interface HeatmapData {
  data: HeatmapCell[];
  capabilities: string[];
  metrics: string[];
}

interface HeatmapViewProps {
  onEntitySelect: (entity: EntityReference) => void;
  searchTerm: string;
  selectedCapability: string | null;
  filters: {
    capabilities: boolean;
    applications: boolean;
    components: boolean;
    interfaces: boolean;
    dataObjects: boolean;
    initiatives: boolean;
  };
  searchScope: string | null;
}

export default function HeatmapView({ onEntitySelect, searchTerm, selectedCapability, filters, searchScope }: HeatmapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedMetric, setSelectedMetric] = useState('applicationCount');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const { data: heatmapData, isLoading } = useQuery<HeatmapData>({
    queryKey: ['/api/heatmap-data', selectedMetric],
  });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width - 48, height: 600 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!heatmapData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 80, right: 40, bottom: 80, left: 120 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const { data, capabilities, metrics } = heatmapData;

    if (!capabilities.length || !metrics.length) return;

    const cellWidth = chartWidth / capabilities.length;
    const cellHeight = chartHeight / metrics.length;

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([0, d3.max(data, d => d.value) || 100]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create cells
    const cells = g.selectAll(".heatmap-cell")
      .data(data)
      .enter().append("rect")
      .attr("class", "heatmap-cell")
      .attr("x", d => d.x * cellWidth)
      .attr("y", d => d.y * cellHeight)
      .attr("width", cellWidth - 2)
      .attr("height", cellHeight - 2)
      .attr("fill", d => colorScale(d.value))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        onEntitySelect({
          type: 'capability',
          id: d.capability,
          data: d
        });
      })
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", "hsl(var(--foreground))")
          .attr("stroke-width", 2);
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <strong>${d.capability}</strong><br>
          ${d.metric}: ${d.value.toFixed(1)}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);
        
        d3.selectAll(".tooltip").remove();
      });

    // Add capability labels
    g.selectAll(".capability-label")
      .data(capabilities)
      .enter().append("text")
      .attr("class", "capability-label")
      .attr("x", (d, i) => i * cellWidth + cellWidth / 2)
      .attr("y", chartHeight + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "hsl(var(--foreground))")
      .text(d => d.length > 15 ? d.substring(0, 15) + "..." : d)
      .attr("transform", (d, i) => `rotate(-45, ${i * cellWidth + cellWidth / 2}, ${chartHeight + 20})`);

    // Add metric labels
    g.selectAll(".metric-label")
      .data(metrics)
      .enter().append("text")
      .attr("class", "metric-label")
      .attr("x", -10)
      .attr("y", (d, i) => i * cellHeight + cellHeight / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .style("font-size", "12px")
      .style("fill", "hsl(var(--foreground))")
      .text(d => d);

    // Add color legend
    const legendWidth = 200;
    const legendHeight = 10;
    const legend = svg.append("g")
      .attr("transform", `translate(${width - legendWidth - 40}, 20)`);

    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 100])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickSize(3);

    const gradient = legend.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient");

    gradient.selectAll("stop")
      .data([0, 0.25, 0.5, 0.75, 1])
      .enter().append("stop")
      .attr("offset", d => d * 100 + "%")
      .attr("stop-color", d => colorScale(d * (d3.max(data, d => d.value) || 100)));

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    legend.append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis);

    legend.append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "hsl(var(--foreground))")
      .text("Value Scale");

  }, [heatmapData, dimensions, onEntitySelect]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading heatmap data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-foreground">
              Capability Coverage Heatmap
            </h2>
            <div className="flex items-center space-x-4">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applicationCount">Application Count</SelectItem>
                  <SelectItem value="interfaceCount">Interface Count</SelectItem>
                  <SelectItem value="riskScore">Risk Score</SelectItem>
                  <SelectItem value="businessValue">Business Value</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Low</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-green-200"></div>
                  <div className="w-4 h-4 bg-yellow-300"></div>
                  <div className="w-4 h-4 bg-orange-400"></div>
                  <div className="w-4 h-4 bg-red-500"></div>
                </div>
                <span className="text-muted-foreground">High</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
