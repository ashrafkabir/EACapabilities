import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { FileText, Plus, ExternalLink, Eye } from "lucide-react";
import DiagramModal from "./diagram-modal";
import type { Diagram, Application } from "@shared/schema";

interface ApplicationDiagramButtonProps {
  application: Application;
  onDiagramCreate?: () => void;
}

export default function ApplicationDiagramButton({ 
  application, 
  onDiagramCreate 
}: ApplicationDiagramButtonProps) {
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: diagrams = [] } = useQuery({
    queryKey: ["/api/applications", application.id, "diagrams"],
  });

  const { data: allApplications = [] } = useQuery({
    queryKey: ["/api/applications"],
  });

  const handleCreateDiagram = () => {
    const newDiagram = {
      name: `${application.displayName || application.name} Diagram`,
      description: `Architecture diagram for ${application.displayName || application.name}`,
      diagramType: "architecture",
      resourceType: "mermaid",
      applicationIds: JSON.stringify([application.id]),
      mermaidCode: `graph TD
    A[${application.displayName || application.name}] --> B[Database]
    A --> C[External API]
    D[Users] --> A
    A --> E[File Storage]`,
    } as Diagram;

    setSelectedDiagram(newDiagram);
    setIsCreateMode(true);
    setIsPopoverOpen(false);
  };

  const handleViewDiagram = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setIsCreateMode(false);
    setIsPopoverOpen(false);
  };

  const handleModalClose = () => {
    setSelectedDiagram(null);
    setIsCreateMode(false);
  };

  const handleModalSave = () => {
    onDiagramCreate?.();
    setSelectedDiagram(null);
    setIsCreateMode(false);
  };

  const getDiagramTypeIcon = (type: string) => {
    switch (type) {
      case "architecture": return "🏗️";
      case "sequence": return "⏳";
      case "flowchart": return "📊";
      case "network": return "🌐";
      default: return "📄";
    }
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            Diagrams
            {diagrams.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {diagrams.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Application Diagrams</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateDiagram}
              >
                <Plus className="w-3 h-3 mr-1" />
                New
              </Button>
            </div>

            {diagrams.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {diagrams.map((diagram: Diagram) => (
                  <div
                    key={diagram.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm">
                        {getDiagramTypeIcon(diagram.diagramType)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {diagram.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {diagram.diagramType}
                          </Badge>
                          {diagram.resourceType !== "mermaid" && (
                            <Badge variant="secondary" className="text-xs">
                              {diagram.resourceType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDiagram(diagram)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      {diagram.resourceUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(diagram.resourceUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <FileText className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No diagrams found</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleCreateDiagram}
                  className="mt-1"
                >
                  Create the first diagram
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedDiagram && (
        <DiagramModal
          diagram={selectedDiagram}
          onClose={handleModalClose}
          onSave={handleModalSave}
          applications={allApplications}
          isEditing={isCreateMode}
        />
      )}
    </>
  );
}