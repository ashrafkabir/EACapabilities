import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Network, List, Grid3x3, BarChart3, Download, Settings, Wand2, FileText, Activity, Plus } from "lucide-react";
import { Link } from "wouter";
import DiagramsList from "@/components/diagrams-list";
import type { ViewType } from "@/pages/dashboard";

interface TopBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onExport?: () => void;
}

const viewConfig = {
  network: { icon: Network, label: 'Business Capabilities' },
  hierarchy: { icon: List, label: 'Map' },
  model: { icon: Settings, label: 'Model' },
  decide: { icon: FileText, label: 'Decide' },
  monitor: { icon: BarChart3, label: 'Monitor' },
  dashboard: { icon: Grid3x3, label: 'Admin Dashboard' },
};

export default function TopBar({ currentView, onViewChange, onExport }: TopBarProps) {
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center">
            <nav className="flex items-center space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              {Object.entries(viewConfig).map(([viewKey, config]) => {
                const Icon = config.icon;
                const isActive = currentView === viewKey;
                
                // Special handling for "decide" to navigate to ADR page
                if (viewKey === 'decide') {
                  return (
                    <Link key={viewKey} href="/adr-generator">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`relative rounded-lg px-4 py-2.5 font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        <span>{config.label}</span>
                        {isActive && (
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 -z-10" />
                        )}
                      </Button>
                    </Link>
                  );
                }
                
                // Map each view to its proper route
                const routes = {
                  network: '/',
                  hierarchy: '/map',
                  model: '/model',
                  monitor: '/monitor',
                  dashboard: '/admin'
                };

                return (
                  <Link key={viewKey} href={routes[viewKey as keyof typeof routes] || '/'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative rounded-lg px-4 py-2.5 font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{config.label}</span>
                      {isActive && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 -z-10" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            <Link href="/diagrams">
              <Button 
                variant="outline"
                className="border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2 font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Diagrams
              </Button>
            </Link>
            {currentView === 'model' && (
              <>
                <Button 
                  onClick={() => setIsDiagramModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2 font-medium transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Diagrams
                </Button>
                <Link href="/diagram-generator">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2 font-medium transform hover:scale-105"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Diagrams
                  </Button>
                </Link>
              </>
            )}
            {onExport && (
              <Button 
                variant="outline"
                onClick={onExport}
                className="border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2 font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Diagrams Modal */}
      <Dialog open={isDiagramModalOpen} onOpenChange={setIsDiagramModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Diagrams Management</DialogTitle>
          </DialogHeader>
          <DiagramsList />
        </DialogContent>
      </Dialog>
    </div>
  );
}
