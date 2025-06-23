import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, ExternalLink, Wand2, FileText, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DIAGRAM_TYPES = [
  { value: "process", label: "Process Diagram", description: "Business process flows and workflows" },
  { value: "integration", label: "Integration Flow", description: "System integration and data flows" },
  { value: "dataflow", label: "Data Flow Diagram", description: "Data movement and transformation" },
  { value: "sequence", label: "Sequence Diagram", description: "Interaction sequences over time" },
  { value: "class", label: "Class Diagram", description: "Object-oriented class relationships" },
  { value: "architecture", label: "Architecture Diagram", description: "System architecture and components" },
  { value: "erd", label: "ERD Diagram", description: "Entity relationship diagrams" },
  { value: "journey", label: "User Journey", description: "User experience and touchpoints" }
];

export default function DiagramGenerator() {
  const [description, setDescription] = useState("");
  const [diagramType, setDiagramType] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { toast } = useToast();

  const generateDiagramMutation = useMutation({
    mutationFn: async ({ description, type }: { description: string; type: string }) => {
      const response = await apiRequest('/api/generate-diagram', 'POST', { description, type });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedCode(data.mermaidCode);
      toast({
        title: "Diagram Generated",
        description: "Your mermaid diagram has been generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate diagram. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a description for your diagram.",
        variant: "destructive",
      });
      return;
    }

    if (!diagramType) {
      toast({
        title: "Diagram Type Required",
        description: "Please select a diagram type.",
        variant: "destructive",
      });
      return;
    }

    generateDiagramMutation.mutate({ description, type: diagramType });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Copied",
        description: "Mermaid code copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagram-${diagramType}-${Date.now()}.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInLucidChart = () => {
    // Generate a URL for Lucidchart with the mermaid code
    const encodedCode = encodeURIComponent(generatedCode);
    const lucidUrl = `https://lucid.app/lucidchart/create?templateCategory=mermaid&mermaidCode=${encodedCode}`;
    window.open(lucidUrl, '_blank');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">AI Diagram Generator</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Convert natural language descriptions into professional diagrams using AI and ArchiMate templates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Diagram Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Diagram Type</label>
              <Select value={diagramType} onValueChange={setDiagramType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diagram type" />
                </SelectTrigger>
                <SelectContent>
                  {DIAGRAM_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe your diagram in natural language. For example: 'Create a process diagram showing how a customer order flows from order placement through payment processing to fulfillment and delivery. Include decision points for payment validation and inventory checks.'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/2000 characters
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={generateDiagramMutation.isPending}
              className="w-full"
            >
              {generateDiagramMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Diagram
                </>
              )}
            </Button>

            {diagramType && (
              <Alert>
                <AlertDescription>
                  <strong>{DIAGRAM_TYPES.find(t => t.value === diagramType)?.label}:</strong>{" "}
                  {DIAGRAM_TYPES.find(t => t.value === diagramType)?.description}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Mermaid Code
              </span>
              {generatedCode && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAsFile}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={openInLucidChart}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                  <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Type: {DIAGRAM_TYPES.find(t => t.value === diagramType)?.label}
                  </Badge>
                  <Badge variant="outline">
                    Lines: {generatedCode.split('\n').length}
                  </Badge>
                  <Badge variant="outline">
                    Characters: {generatedCode.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Export Options:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="justify-start">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadAsFile} className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download as .mmd File
                    </Button>
                    <Button variant="outline" size="sm" onClick={openInLucidChart} className="justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Lucidchart
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated diagram code will appear here</p>
                  <p className="text-sm">Select a diagram type and enter a description to get started</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Examples Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Example Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Process Diagram</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "Create a hiring process starting with job posting, then application review, phone screening, technical interview, final interview, background check, and offer letter."
              </p>
              
              <h4 className="font-medium">Integration Flow</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "Show data flow from CRM system to data warehouse via API, including transformation steps and error handling."
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Sequence Diagram</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "User login sequence: user enters credentials, system validates, checks database, returns JWT token, user accesses protected resource."
              </p>
              
              <h4 className="font-medium">Architecture Diagram</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "Microservices architecture with API gateway, user service, order service, payment service, and shared database."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}