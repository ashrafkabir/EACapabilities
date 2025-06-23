import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ExternalLink, Eye, Edit } from "lucide-react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(false);
  };

  const handleViewDiagram = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setIsCreateMode(false);
    setIsDialogOpen(false);
  };

  const handleEditDiagram = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setIsCreateMode(true);
    setIsDialogOpen(false);
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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
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
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="p-1 h-6 w-6"
      >
        <Plus className="w-3 h-3" />
      </Button>

      {/* Diagrams List Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Diagrams for {application.displayName || application.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateDiagram}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Diagram
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {diagrams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagrams.map((diagram: Diagram) => (
                  <div
                    key={diagram.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getDiagramTypeIcon(diagram.diagramType)}
                        </span>
                        <div>
                          <h4 className="font-medium">{diagram.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
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
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDiagram(diagram)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {diagram.resourceUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(diagram.resourceUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {diagram.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {diagram.description}
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      Updated: {diagram.updatedAt ? new Date(diagram.updatedAt).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No diagrams found
                </h3>
                <p className="text-gray-500 mt-1">
                  Create your first diagram for this application
                </p>
                <Button className="mt-4" onClick={handleCreateDiagram}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Diagram
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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