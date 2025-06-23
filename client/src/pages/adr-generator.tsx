import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, FileText, Loader2, ArrowLeft, Plus, Search, Filter, Eye } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Application } from "@shared/schema";

interface Adr {
  id: number;
  adrId: string;
  title: string;
  status: string;
  date: string;
  applicationId?: string;
  capabilityIds?: string;
  problemStatement?: string;
  selectedOption?: string;
  justification?: string;
}

export default function AdrGenerator() {
  const [activeTab, setActiveTab] = useState("generate");
  const [inputText, setInputText] = useState("");
  const [selectedApplication, setSelectedApplication] = useState("");
  const [filterApplication, setFilterApplication] = useState("");
  const [generatedAdr, setGeneratedAdr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdr, setSelectedAdr] = useState<Adr | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const { data: adrs = [] } = useQuery<Adr[]>({
    queryKey: ['/api/adrs'],
  });

  const generateAdrMutation = useMutation({
    mutationFn: async ({ inputText, applicationId }: { inputText: string; applicationId?: string }) => {
      const appId = applicationId === "none" ? undefined : applicationId;
      const response = await apiRequest('/api/generate-adr', 'POST', { inputText, applicationId: appId });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedAdr(data.adr);
      toast({
        title: "ADR Generated",
        description: "Architecture Decision Record has been generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate ADR. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveAdrMutation = useMutation({
    mutationFn: async (adrData: any) => {
      const response = await apiRequest('/api/adrs', 'POST', adrData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/adrs'] });
      toast({
        title: "ADR Saved",
        description: "Architecture Decision Record has been saved to the database.",
      });
      setGeneratedAdr("");
      setInputText("");
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save ADR. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter meeting notes, transcript, or decision context.",
        variant: "destructive",
      });
      return;
    }

    generateAdrMutation.mutate({ inputText, applicationId: selectedApplication });
  };

  const handleSaveAdr = () => {
    if (!generatedAdr) return;
    
    try {
      const adrData = JSON.parse(generatedAdr);
      saveAdrMutation.mutate(adrData);
    } catch (error) {
      toast({
        title: "Invalid ADR",
        description: "Generated ADR format is invalid. Please regenerate.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedAdr);
      toast({
        title: "Copied",
        description: "ADR copied to clipboard.",
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
    const blob = new Blob([generatedAdr], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adr-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAdrs = adrs.filter(adr => {
    const matchesSearch = searchTerm === "" || 
      adr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adr.adrId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || adr.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesApplication = filterApplication === "" || filterApplication === "all" || 
      adr.applicationId === filterApplication;
    
    return matchesSearch && matchesStatus && matchesApplication;
  });

  const selectedApp = applications.find(app => app.id === filterApplication);

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back to Home</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">ADR Generator</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Generate Architecture Decision Records from meeting notes and manage existing decisions
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate ADR</TabsTrigger>
              <TabsTrigger value="manage">Manage ADRs</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Decision Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Application (Optional)</label>
                      <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select application" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No specific application</SelectItem>
                          {applications.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Meeting Notes / Decision Context</label>
                      <Textarea
                        placeholder="Paste meeting transcripts, chat logs, or informal notes about architectural decisions. The AI will extract key decisions, stakeholders, systems, technologies, and trade-offs to generate a complete ADR following enterprise standards."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={12}
                        className="resize-none"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {inputText.length}/5000 characters
                      </div>
                    </div>

                    <Button 
                      onClick={handleGenerate}
                      disabled={generateAdrMutation.isPending}
                      className="w-full"
                    >
                      {generateAdrMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating ADR...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate ADR
                        </>
                      )}
                    </Button>

                    <Alert>
                      <AlertDescription>
                        AI will extract architectural decisions, identify stakeholders and systems, recognize decision criteria, detect options and trade-offs, and generate a complete ADR following enterprise templates.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Output Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Generated ADR
                      </span>
                      {generatedAdr && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadAsFile}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm" onClick={handleSaveAdr} disabled={saveAdrMutation.isPending}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedAdr ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border max-h-96 overflow-auto">
                          <pre className="text-sm whitespace-pre-wrap">
                            {generatedAdr}
                          </pre>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy ADR
                          </Button>
                          <Button variant="outline" onClick={downloadAsFile} className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button onClick={handleSaveAdr} disabled={saveAdrMutation.isPending} className="flex-1">
                            <Plus className="h-4 w-4 mr-2" />
                            Save to Database
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Generated ADR will appear here</p>
                          <p className="text-sm">Enter decision context to get started</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6 mt-6">
              {/* Application Selection - Prominent */}
              <Card className="border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-blue-900 dark:text-blue-100">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    Architecture Decision Records Management
                  </CardTitle>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Select an application to view and manage its architectural decisions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-base font-semibold text-blue-900 dark:text-blue-100 min-w-fit">
                        Application Context:
                      </label>
                      <Select value={filterApplication} onValueChange={setFilterApplication}>
                        <SelectTrigger className="w-full max-w-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-900">
                          <SelectValue placeholder="🎯 Select application to view ADRs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">📋 All Applications</SelectItem>
                          <SelectItem value="">❓ Unassigned ADRs</SelectItem>
                          {applications.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              🏢 {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedApp && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Currently viewing:</span>
                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">
                          🏢 {selectedApp.name}
                        </Badge>
                      </div>
                    )}
                    {filterApplication === "all" && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Currently viewing:</span>
                        <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300 px-3 py-1">
                          📋 All Applications
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search ADRs by title or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="proposed">Proposed</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="superseded">Superseded</SelectItem>
                        <SelectItem value="deprecated">Deprecated</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* ADR List */}
              <div className="grid gap-4">
                {filteredAdrs.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-500">
                          {filterApplication && filterApplication !== "all" && selectedApp 
                            ? `No ADRs found for ${selectedApp.name}` 
                            : "No ADRs found"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {filterApplication && filterApplication !== "all" 
                            ? "Generate ADRs for this application or select a different application"
                            : "Generate your first ADR to get started"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAdrs.map((adr) => (
                    <Card key={adr.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{adr.adrId}</h3>
                              <Badge variant={
                                adr.status === 'accepted' ? 'default' :
                                adr.status === 'proposed' ? 'secondary' :
                                adr.status === 'deprecated' ? 'destructive' : 'outline'
                              }>
                                {adr.status}
                              </Badge>
                            </div>
                            <h4 className="text-lg font-medium mb-2">{adr.title}</h4>
                            {adr.problemStatement && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {adr.problemStatement.slice(0, 150)}...
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Created: {new Date(adr.date).toLocaleDateString()}</span>
                              {adr.applicationId && (
                                <span>App: {applications.find(app => app.id === adr.applicationId)?.name || adr.applicationId}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAdr(adr)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}