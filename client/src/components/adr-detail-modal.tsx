import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

interface AdrDetailModalProps {
  adr: Adr | null;
  onClose: () => void;
  applicationName?: string;
}

export default function AdrDetailModal({ adr, onClose, applicationName }: AdrDetailModalProps) {
  const { toast } = useToast();

  if (!adr) return null;

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

  const Section = ({ title, content }: { title: string; content?: string }) => {
    if (!content || content.trim() === '') return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{title}</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded border">
          {content}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!adr} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <Button variant="outline" size="sm" onClick={exportToMarkdown}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <Section title="Problem Statement" content={adr.problemStatement} />
          <Section title="Business Drivers" content={adr.businessDrivers} />
          <Section title="Current State" content={adr.currentState} />
          <Section title="Constraints" content={adr.constraints} />
          <Section title="Decision Criteria" content={adr.decisionCriteria} />
          <Section title="Options Considered" content={adr.optionsConsidered} />
          
          <Separator />
          
          <Section title="Selected Option" content={adr.selectedOption} />
          <Section title="Justification" content={adr.justification} />
          
          <Separator />
          
          <Section title="Action Items" content={adr.actionItems} />
          <Section title="Impact Assessment" content={adr.impactAssessment} />
          <Section title="Verification Method" content={adr.verificationMethod} />
          
          <Separator />
          
          <Section title="Positive Consequences" content={adr.positiveConsequences} />
          <Section title="Negative Consequences" content={adr.negativeConsequences} />
          <Section title="Risks and Mitigations" content={adr.risksAndMitigations} />
          
          {(adr.notes || adr.references) && (
            <>
              <Separator />
              <Section title="Notes" content={adr.notes} />
              <Section title="References" content={adr.references} />
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