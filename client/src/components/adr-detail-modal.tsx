import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, X, Edit, Save, Undo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Adr {
  id: number;
  adrId: string;
  title: string;
  status: string;
  date: string;
  applicationId?: string;
  capabilityIds?: string;
  problemStatement?: string;
  businessDrivers?: string;
  currentState?: string;
  constraints?: string;
  decisionCriteria?: string;
  optionsConsidered?: string;
  selectedOption?: string;
  justification?: string;
  actionItems?: string;
  impactAssessment?: string;
  verificationMethod?: string;
  positiveConsequences?: string;
  negativeConsequences?: string;
  risksAndMitigations?: string;
  notes?: string;
  references?: string;
  approvals?: string;
  revisionHistory?: string;
  decisionMakers?: string;
  relatedStandard?: string;
  impactedSystems?: string;
  classification?: string;
  auditTrail?: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  version?: number;
}

interface AdrDetailModalProps {
  adr: Adr | null;
  onClose: () => void;
  applicationName?: string;
}

interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  version: number;
}

export default function AdrDetailModal({ adr, onClose, applicationName }: AdrDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAdr, setEditedAdr] = useState<Adr | null>(null);

  // Initialize edited ADR when switching to edit mode
  const startEditing = () => {
    setEditedAdr({ ...adr });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedAdr(null);
    setIsEditing(false);
  };

  const updateAdrMutation = useMutation({
    mutationFn: async (updatedData: Partial<Adr>) => {
      const response = await apiRequest(`/api/adrs/${adr.id}`, 'PATCH', updatedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/adrs'] });
      toast({
        title: "ADR Updated",
        description: "Architecture Decision Record has been updated successfully.",
      });
      setIsEditing(false);
      setEditedAdr(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update ADR. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveChanges = () => {
    if (!editedAdr) return;
    
    // Create audit entry for the changes
    const auditEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      user: "Current User", // TODO: Get from auth context
      action: "Updated",
      version: (adr.version || 1) + 1
    };

    const updatedData = {
      ...editedAdr,
      auditTrail: JSON.stringify([
        ...(adr.auditTrail ? JSON.parse(adr.auditTrail) : []),
        auditEntry
      ]),
      lastModifiedBy: "Current User", // TODO: Get from auth context
      lastModifiedAt: new Date(),
      version: (adr.version || 1) + 1
    };

    updateAdrMutation.mutate(updatedData);
  };

  const exportToMarkdown = () => {
    const markdown = generateMarkdown(adr, applicationName);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${adr.adrId.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "ADR Exported",
      description: `${adr.adrId} has been exported as a markdown file.`,
    });
  };

  const generateMarkdown = (adr: Adr, appName?: string): string => {
    return `# ${adr.adrId}: ${adr.title}

## Metadata

| Field | Value |
|-------|-------|
| **Status** | ${adr.status} |
| **Date** | ${new Date(adr.date).toLocaleDateString()} |
| **Decision Makers** | ${adr.decisionMakers || '[TO BE DETERMINED]'} |
| **Related Standard** | ${adr.relatedStandard || '[TO BE DETERMINED]'} |
| **Impacted Systems** | ${adr.impactedSystems || '[TO BE DETERMINED]'} |
| **Classification** | ${adr.classification || '[TO BE DETERMINED]'} |
| **Application** | ${appName || 'Unassigned'} |

## Context

### Problem Statement
${adr.problemStatement || '[TO BE DETERMINED]'}

### Business Drivers
${adr.businessDrivers || '[TO BE DETERMINED]'}

### Current State
${adr.currentState || '[TO BE DETERMINED]'}

### Constraints
${adr.constraints || '[TO BE DETERMINED]'}

## Decision Criteria
${adr.decisionCriteria || '[TO BE DETERMINED]'}

## Options Considered
${adr.optionsConsidered || '[TO BE DETERMINED]'}

## Decision

### Selected Option
${adr.selectedOption || '[TO BE DETERMINED]'}

### Justification
${adr.justification || '[TO BE DETERMINED]'}

## Implementation

### Action Items
${adr.actionItems || '[TO BE DETERMINED]'}

### Impact Assessment
${adr.impactAssessment || '[TO BE DETERMINED]'}

### Verification Method
${adr.verificationMethod || '[TO BE DETERMINED]'}

## Consequences

### Positive Consequences
${adr.positiveConsequences || '[TO BE DETERMINED]'}

### Negative Consequences
${adr.negativeConsequences || '[TO BE DETERMINED]'}

### Risks and Mitigations
${adr.risksAndMitigations || '[TO BE DETERMINED]'}

## Notes
${adr.notes || '[TO BE DETERMINED]'}

## References
${adr.references || '[TO BE DETERMINED]'}

## Approvals
${adr.approvals || '[TO BE DETERMINED]'}

## Revision History
${adr.revisionHistory || '[TO BE DETERMINED]'}

---
*Generated on ${new Date().toLocaleDateString()} from Enterprise ADR Management System*
`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deprecated': return 'bg-red-100 text-red-800 border-red-200';
      case 'superseded': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const Section = ({ title, content, field }: { title: string; content?: string; field?: keyof Adr }) => {
    if (!isEditing && (!content || content.trim() === '')) return null;
    
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-base text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">
          {title}
        </h4>
        {isEditing && field && editedAdr ? (
          <Textarea
            key={`${field}-${adr.id}`} // Add key to prevent React from reusing components
            value={(editedAdr[field] as string) || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditedAdr(prev => prev ? { ...prev, [field]: newValue } : null);
            }}
            className="min-h-[120px] text-sm leading-relaxed resize-vertical border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg p-4"
            placeholder={`Enter ${title.toLowerCase()}...

You can use markdown formatting:
- **bold text**
- *italic text*  
- \`code\`
- Lists with - or 1.
- Links: [text](url)`}
          />
        ) : (
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 leading-relaxed">
            {content || (
              <span className="text-gray-400 italic">[TO BE DETERMINED]</span>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!adr) return null;

  const auditTrail: AuditEntry[] = adr.auditTrail ? JSON.parse(adr.auditTrail) : [];

  return (
    <Dialog open={!!adr} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="space-y-2 flex-1">
            <DialogTitle className="text-xl font-bold">{adr.adrId}</DialogTitle>
            <h2 className="text-lg text-gray-700 dark:text-gray-300">{adr.title}</h2>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(adr.status)} border`}>
                {adr.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDate(adr.date)}
              </span>
              {applicationName && (
                <Badge variant="outline" className="text-xs">
                  🏢 {applicationName}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="default" size="sm" onClick={saveChanges} disabled={updateAdrMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEditing}>
                  <Undo className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={startEditing}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={exportToMarkdown}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          <Section title="Problem Statement" content={adr.problemStatement} field="problemStatement" />
          <Section title="Business Drivers" content={adr.businessDrivers} field="businessDrivers" />
          <Section title="Current State" content={adr.currentState} field="currentState" />
          <Section title="Constraints" content={adr.constraints} field="constraints" />
          <Section title="Decision Criteria" content={adr.decisionCriteria} field="decisionCriteria" />
          <Section title="Options Considered" content={adr.optionsConsidered} field="optionsConsidered" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
                Decision
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Selected Option" content={adr.selectedOption} field="selectedOption" />
          <Section title="Justification" content={adr.justification} field="justification" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
                Implementation
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Action Items" content={adr.actionItems} field="actionItems" />
          <Section title="Impact Assessment" content={adr.impactAssessment} field="impactAssessment" />
          <Section title="Verification Method" content={adr.verificationMethod} field="verificationMethod" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 px-3 py-1 rounded-full">
                Consequences
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Positive Consequences" content={adr.positiveConsequences} field="positiveConsequences" />
          <Section title="Negative Consequences" content={adr.negativeConsequences} field="negativeConsequences" />
          <Section title="Risks and Mitigations" content={adr.risksAndMitigations} field="risksAndMitigations" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 px-3 py-1 rounded-full">
                Additional Information
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Notes" content={adr.notes} field="notes" />
          <Section title="References" content={adr.references} field="references" />

          {auditTrail.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Audit Trail</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border max-h-40 overflow-y-auto">
                  {auditTrail.map((entry, index) => (
                    <div key={index} className="text-xs text-gray-600 dark:text-gray-400 mb-2 last:mb-0">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">v{entry.version} - {entry.action}</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      <div>by {entry.user}</div>
                      {entry.field && (
                        <div className="mt-1 pl-2 border-l-2 border-gray-300">
                          <span className="font-medium">{entry.field}:</span> {entry.oldValue} → {entry.newValue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="text-xs text-gray-400 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Decision Makers:</span> {adr.decisionMakers || '[TO BE DETERMINED]'}
              </div>
              <div>
                <span className="font-medium">Classification:</span> {adr.classification || '[TO BE DETERMINED]'}
              </div>
              <div>
                <span className="font-medium">Related Standard:</span> {adr.relatedStandard || '[TO BE DETERMINED]'}
              </div>
              <div>
                <span className="font-medium">Impacted Systems:</span> {adr.impactedSystems || '[TO BE DETERMINED]'}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}