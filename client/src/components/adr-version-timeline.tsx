import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User, ChevronLeft, ChevronRight, Eye, GitBranch } from "lucide-react";

interface VersionEntry {
  version: number;
  timestamp: string;
  user: string;
  action: string;
  changes?: string[];
  isLatest?: boolean;
}

interface AdrVersionTimelineProps {
  adr: any;
  onVersionSelect: (version: number) => void;
  selectedVersion?: number;
}

export default function AdrVersionTimeline({ adr, onVersionSelect, selectedVersion }: AdrVersionTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse version history from audit trail
  const versionHistory: VersionEntry[] = [];
  
  // Add initial version
  versionHistory.push({
    version: 1,
    timestamp: adr.createdAt,
    user: "System",
    action: "Created",
    isLatest: false
  });

  // Parse audit trail for version history
  if (adr.auditTrail) {
    try {
      const auditEntries = JSON.parse(adr.auditTrail);
      auditEntries.forEach((entry: any) => {
        if (entry.version > 1) {
          versionHistory.push({
            version: entry.version,
            timestamp: entry.timestamp,
            user: entry.user,
            action: entry.action,
            changes: entry.changes || [],
            isLatest: entry.version === adr.version
          });
        }
      });
    } catch (e) {
      console.error("Failed to parse audit trail:", e);
    }
  }

  // Mark the latest version
  if (versionHistory.length > 0) {
    versionHistory[versionHistory.length - 1].isLatest = true;
  }

  const currentVersionIndex = versionHistory.findIndex(v => v.version === (selectedVersion || adr.version));
  
  const navigateVersion = (direction: 'prev' | 'next') => {
    const currentIndex = currentVersionIndex;
    if (direction === 'prev' && currentIndex > 0) {
      onVersionSelect(versionHistory[currentIndex - 1].version);
    } else if (direction === 'next' && currentIndex < versionHistory.length - 1) {
      onVersionSelect(versionHistory[currentIndex + 1].version);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-2 border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/20">
      <CardContent className="p-4">
        {/* Timeline Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <GitBranch className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">
                Version History
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                {versionHistory.length} version{versionHistory.length !== 1 ? 's' : ''} • Currently viewing v{selectedVersion || adr.version}
              </p>
            </div>
          </div>
          
          {/* Version Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateVersion('prev')}
              disabled={currentVersionIndex <= 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Badge variant="default" className="bg-indigo-600 text-white px-3">
              v{selectedVersion || adr.version}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateVersion('next')}
              disabled={currentVersionIndex >= versionHistory.length - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2"
            >
              <Eye className="h-4 w-4 mr-1" />
              {isExpanded ? 'Hide' : 'Show'} Timeline
            </Button>
          </div>
        </div>

        {/* Compact Timeline View */}
        {!isExpanded && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-6 left-4 w-0.5 bg-indigo-200 dark:bg-indigo-700 h-6"></div>
            
            {/* Current Version Indicator */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-indigo-50 dark:border-indigo-950">
                  <span className="text-xs font-bold text-white">{selectedVersion || adr.version}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                    Version {selectedVersion || adr.version}
                  </span>
                  {(selectedVersion || adr.version) === adr.version && (
                    <Badge variant="secondary" className="text-xs">Latest</Badge>
                  )}
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400">
                  {versionHistory[currentVersionIndex]?.user} • {formatDate(versionHistory[currentVersionIndex]?.timestamp || adr.date)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Timeline View */}
        {isExpanded && (
          <ScrollArea className="h-64">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-0 left-4 w-0.5 bg-indigo-200 dark:bg-indigo-700 h-full"></div>
              
              {/* Version Entries */}
              <div className="space-y-4">
                {versionHistory.map((entry, index) => (
                  <div
                    key={entry.version}
                    className={`relative flex items-start gap-4 cursor-pointer p-2 rounded-lg transition-colors ${
                      entry.version === (selectedVersion || adr.version)
                        ? 'bg-indigo-100 dark:bg-indigo-900/50'
                        : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/25'
                    }`}
                    onClick={() => onVersionSelect(entry.version)}
                  >
                    {/* Version Circle */}
                    <div className="relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                        entry.version === (selectedVersion || adr.version)
                          ? 'bg-indigo-600 border-indigo-50 dark:border-indigo-950'
                          : entry.isLatest
                          ? 'bg-green-500 border-green-50 dark:border-green-950'
                          : 'bg-gray-400 border-gray-50 dark:border-gray-950'
                      }`}>
                        <span className="text-xs font-bold text-white">{entry.version}</span>
                      </div>
                    </div>
                    
                    {/* Version Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                          Version {entry.version}
                        </span>
                        {entry.isLatest && (
                          <Badge variant="secondary" className="text-xs">Latest</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {entry.action}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-indigo-600 dark:text-indigo-400">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.user}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>
                      
                      {entry.changes && entry.changes.length > 0 && (
                        <div className="mt-1">
                          <div className="text-xs text-indigo-700 dark:text-indigo-300">
                            Changed: {entry.changes.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}