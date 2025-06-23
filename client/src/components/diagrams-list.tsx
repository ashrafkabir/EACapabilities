import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  FileText, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Link as LinkIcon,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import DiagramModal from "./diagram-modal";
import type { Diagram, Application } from "@shared/schema";

interface DiagramsListProps {
  applications?: Application[];
}

export default function DiagramsList({ applications = [] }: DiagramsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: diagrams = [], isLoading } = useQuery({
    queryKey: ["/api/diagrams"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (diagramId: string) => {
      await apiRequest({
        url: `/api/diagrams/${diagramId}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diagrams"] });
      toast({
        title: "Success",
        description: "Diagram deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete diagram",
        variant: "destructive",
      });
    },
  });

  const filteredDiagrams = diagrams.filter((diagram: Diagram) =>
    diagram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedDiagram({} as Diagram);
    setIsCreateMode(true);
    setIsEditMode(true);
  };

  const handleEditDiagram = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setIsEditMode(true);
  };

  const handleViewDiagram = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setIsEditMode(false);
  };

  const handleDeleteDiagram = (diagram: Diagram) => {
    if (confirm(`Are you sure you want to delete "${diagram.name}"?`)) {
      deleteMutation.mutate(diagram.id);
    }
  };

  const handleModalClose = () => {
    setSelectedDiagram(null);
    setIsCreateMode(false);
    setIsEditMode(false);
  };

  const handleModalSave = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/diagrams"] });
    setSelectedDiagram(null);
    setIsCreateMode(false);
    setIsEditMode(false);
  };

  const getLinkedApplications = (diagram: Diagram) => {
    if (!diagram.applicationIds) return [];
    try {
      const appIds = JSON.parse(diagram.applicationIds);
      return applications.filter(app => appIds.includes(app.id));
    } catch {
      return [];
    }
  };

  const getDiagramTypeIcon = (type: string) => {
    switch (type) {
      case "architecture":
        return "🏗️";
      case "sequence":
        return "⏳";
      case "flowchart":
        return "📊";
      case "network":
        return "🌐";
      case "erd":
        return "🗄️";
      case "class":
        return "📋";
      case "state":
        return "🔄";
      case "gantt":
        return "📅";
      default:
        return "📄";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading diagrams...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Diagrams</h2>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Diagram
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search diagrams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Diagrams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiagrams.map((diagram: Diagram) => {
          const linkedApps = getLinkedApplications(diagram);
          
          return (
            <Card key={diagram.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getDiagramTypeIcon(diagram.diagramType)}
                    </span>
                    <div>
                      <CardTitle className="text-lg line-clamp-1">
                        {diagram.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {diagram.diagramType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          v{diagram.version}
                        </Badge>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDiagram(diagram)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {diagram.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {diagram.description}
                  </p>
                )}

                {/* Resource Type & URL */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {diagram.resourceType === "mermaid" ? "Mermaid Code" : diagram.resourceType}
                  </span>
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

                {/* Linked Applications */}
                {linkedApps.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <LinkIcon className="w-3 h-3" />
                      <span>Linked Apps:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {linkedApps.slice(0, 2).map((app) => (
                        <Badge key={app.id} variant="outline" className="text-xs">
                          {app.displayName || app.name}
                        </Badge>
                      ))}
                      {linkedApps.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{linkedApps.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {diagram.tags && (
                  <div className="flex flex-wrap gap-1">
                    {diagram.tags.split(',').slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>
                    {diagram.createdBy || "Unknown"}
                  </span>
                  <span>
                    {diagram.updatedAt ? new Date(diagram.updatedAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDiagrams.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No diagrams found
          </h3>
          <p className="text-gray-500 mt-1">
            {searchTerm ? "Try adjusting your search terms" : "Create your first diagram to get started"}
          </p>
          {!searchTerm && (
            <Button className="mt-4" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Diagram
            </Button>
          )}
        </div>
      )}

      {/* Diagram Modal */}
      {selectedDiagram && (
        <DiagramModal
          diagram={selectedDiagram}
          onClose={handleModalClose}
          onSave={handleModalSave}
          applications={applications}
          isEditing={isEditMode}
        />
      )}
    </div>
  );
}