import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ExternalLink, Eye, Edit, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import mermaid from "mermaid";
import type { Diagram, Application } from "@shared/schema";

interface DiagramModalProps {
  diagram: Diagram | null;
  onClose: () => void;
  onSave?: () => void;
  applications?: Application[];
  isEditing?: boolean;
}

const DIAGRAM_TYPES = [
  { value: "architecture", label: "Architecture Diagram" },
  { value: "sequence", label: "Sequence Diagram" },
  { value: "flowchart", label: "Flowchart" },
  { value: "network", label: "Network Diagram" },
  { value: "erd", label: "Entity Relationship Diagram" },
  { value: "class", label: "Class Diagram" },
  { value: "state", label: "State Diagram" },
  { value: "gantt", label: "Gantt Chart" },
];

const RESOURCE_TYPES = [
  { value: "mermaid", label: "Mermaid Code" },
  { value: "lucidchart", label: "LucidChart Link" },
  { value: "leanix", label: "LeanIX Link" },
  { value: "image", label: "Image Link" },
  { value: "other", label: "Other" },
];

export default function DiagramModal({ diagram, onClose, onSave, applications = [], isEditing = false }: DiagramModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    diagramType: "",
    mermaidCode: "",
    resourceType: "mermaid",
    resourceUrl: "",
    tags: "",
    isPublic: true,
    createdBy: "Current User",
  });
  
  const [linkedApplications, setLinkedApplications] = useState<string[]>([]);
  const [availableApplications, setAvailableApplications] = useState<Application[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");
  const [mermaidHtml, setMermaidHtml] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(isEditing);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest({
        url: "/api/diagrams",
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diagrams"] });
      toast({
        title: "Success",
        description: "Diagram created successfully",
      });
      onSave?.();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating diagram:", error);
      toast({
        title: "Error",
        description: "Failed to create diagram",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest({
        url: `/api/diagrams/${diagram?.id}`,
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diagrams"] });
      toast({
        title: "Success",
        description: "Diagram updated successfully",
      });
      onSave?.();
      onClose();
    },
    onError: (error) => {
      console.error("Error updating diagram:", error);
      toast({
        title: "Error",
        description: "Failed to update diagram",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (diagram) {
      setFormData({
        name: diagram.name || "",
        description: diagram.description || "",
        diagramType: diagram.diagramType || "",
        mermaidCode: diagram.mermaidCode || "",
        resourceType: diagram.resourceType || "mermaid",
        resourceUrl: diagram.resourceUrl || "",
        tags: diagram.tags || "",
        isPublic: diagram.isPublic ?? true,
        createdBy: diagram.createdBy || "Current User",
      });

      // Parse linked applications
      if (diagram.applicationIds) {
        try {
          const appIds = JSON.parse(diagram.applicationIds);
          setLinkedApplications(appIds);
        } catch {
          setLinkedApplications([]);
        }
      }
    }
    setAvailableApplications(applications);
  }, [diagram, applications]);

  useEffect(() => {
    if (formData.mermaidCode && formData.resourceType === "mermaid") {
      renderMermaidDiagram();
    }
  }, [formData.mermaidCode, formData.resourceType]);

  const renderMermaidDiagram = async () => {
    try {
      mermaid.initialize({ startOnLoad: false, theme: 'default' });
      const { svg } = await mermaid.render('mermaid-preview', formData.mermaidCode);
      setMermaidHtml(svg);
    } catch (error) {
      console.error("Mermaid rendering error:", error);
      setMermaidHtml("<p class='text-red-500'>Invalid Mermaid syntax</p>");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Diagram name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const diagramData = {
        ...formData,
        applicationIds: JSON.stringify(linkedApplications),
      };

      let savedDiagram;
      if (diagram?.id) {
        savedDiagram = await apiRequest({
          url: `/api/diagrams/${diagram.id}`,
          method: "PATCH",
          body: diagramData,
        });
      } else {
        savedDiagram = await apiRequest({
          url: "/api/diagrams",
          method: "POST",
          body: diagramData,
        });
      }

      toast({
        title: "Success",
        description: `Diagram ${diagram?.id ? 'updated' : 'created'} successfully`,
      });

      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error saving diagram:", error);
      toast({
        title: "Error",
        description: "Failed to save diagram",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkApplication = () => {
    if (selectedApplicationId && !linkedApplications.includes(selectedApplicationId)) {
      setLinkedApplications([...linkedApplications, selectedApplicationId]);
      setSelectedApplicationId("");
    }
  };

  const handleUnlinkApplication = (applicationId: string) => {
    setLinkedApplications(linkedApplications.filter(id => id !== applicationId));
  };

  const getApplicationName = (applicationId: string) => {
    const app = availableApplications.find(a => a.id === applicationId);
    return app?.displayName || app?.name || applicationId;
  };

  const getDefaultMermaidCode = (type: string) => {
    switch (type) {
      case "flowchart":
        return `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D`;
      case "sequence":
        return `sequenceDiagram
    participant A as User
    participant B as System
    A->>B: Request
    B-->>A: Response`;
      case "architecture":
        return `graph TD
    A[Frontend] --> B[API Gateway]
    B --> C[Microservice 1]
    B --> D[Microservice 2]
    C --> E[Database]
    D --> E`;
      default:
        return `graph TD
    A[Node A] --> B[Node B]
    B --> C[Node C]`;
    }
  };

  const handleDiagramTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      diagramType: type,
      mermaidCode: prev.mermaidCode || getDefaultMermaidCode(type)
    }));
  };

  return (
    <Dialog open={!!diagram} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {diagram?.id 
                ? (isEditMode ? "Edit Diagram" : "View Diagram") 
                : "Create New Diagram"
              }
            </span>
            <div className="flex gap-2">
              {diagram?.id && !isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
              {formData.resourceUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(formData.resourceUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open Resource
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditMode && !!diagram?.id}
                  placeholder="Enter diagram name"
                />
              </div>
              <div>
                <Label htmlFor="diagramType">Type *</Label>
                <Select
                  value={formData.diagramType}
                  onValueChange={handleDiagramTypeChange}
                  disabled={!isEditMode && !!diagram?.id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select diagram type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAGRAM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditMode && !!diagram?.id}
                placeholder="Describe the diagram's purpose"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resourceType">Resource Type</Label>
                <Select
                  value={formData.resourceType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resourceType: value }))}
                  disabled={!isEditMode && !!diagram?.id}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  disabled={!isEditMode && !!diagram?.id}
                  placeholder="Comma-separated tags"
                />
              </div>
            </div>

            {formData.resourceType !== "mermaid" && (
              <div>
                <Label htmlFor="resourceUrl">Resource URL</Label>
                <Input
                  id="resourceUrl"
                  value={formData.resourceUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, resourceUrl: e.target.value }))}
                  disabled={!isEditMode && !!diagram?.id}
                  placeholder="Enter external resource URL"
                />
              </div>
            )}

            {formData.resourceType === "mermaid" && (
              <div>
                <Label htmlFor="mermaidCode">Mermaid Code</Label>
                <Textarea
                  id="mermaidCode"
                  value={formData.mermaidCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, mermaidCode: e.target.value }))}
                  disabled={!isEditMode && !!diagram?.id}
                  placeholder="Enter Mermaid diagram code"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            )}

            {/* Linked Applications */}
            <div>
              <Label>Linked Applications</Label>
              <div className="space-y-2">
                {(isEditMode || !diagram?.id) && (
                  <div className="flex gap-2">
                    <Select value={selectedApplicationId} onValueChange={setSelectedApplicationId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select application to link" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableApplications
                          .filter(app => !linkedApplications.includes(app.id))
                          .map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.displayName || app.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLinkApplication}
                      disabled={!selectedApplicationId}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {linkedApplications.map((appId) => (
                    <Badge key={appId} variant="secondary" className="flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      {getApplicationName(appId)}
                      {(isEditMode || !diagram?.id) && (
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleUnlinkApplication(appId)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50 dark:bg-gray-900">
              {formData.resourceType === "mermaid" && mermaidHtml ? (
                <div 
                  className="mermaid-preview"
                  dangerouslySetInnerHTML={{ __html: mermaidHtml }}
                />
              ) : formData.resourceUrl ? (
                <div className="text-center text-gray-500">
                  <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                  <p>External Resource</p>
                  <a 
                    href={formData.resourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {formData.resourceUrl}
                  </a>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p>Preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {(isEditMode || !diagram?.id) && (
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : diagram?.id ? "Update" : "Create"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}