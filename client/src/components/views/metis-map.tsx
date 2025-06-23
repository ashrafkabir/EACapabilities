import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Info, Expand, ExternalLink } from "lucide-react";
import type { EntityReference } from "@/pages/dashboard";
import type { BusinessCapability, Application, Initiative, DataObject, Interface, ITComponent } from "@shared/schema";
import ExportSummaryModal from "@/components/modals/export-summary-modal";
import ApplicationDiagramButton from "@/components/application-diagram-button";
import { filterCapabilitiesByName } from "@/lib/unified-search";

interface MetisMapProps {
  selectedCapability: string | null;
  selectedITComponent?: string | null;
  searchTerm: string;
  onEntitySelect: (entity: EntityReference) => void;
  filteredCapabilities: BusinessCapability[];
}

interface HeatmapFilters {
  metric: 'technicalSuitability' | 'functionalFit' | 'none';
  showColors: boolean;
}

export default function MetisMap({ selectedCapability, selectedITComponent: parentSelectedITComponent, searchTerm, onEntitySelect, filteredCapabilities: centralFilteredCapabilities }: MetisMapProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [heatmapFilters, setHeatmapFilters] = useState<HeatmapFilters>({
    metric: 'none',
    showColors: false
  });
  const [showExportSummary, setShowExportSummary] = useState(false);
  const [exportSummaryData, setExportSummaryData] = useState<any>(null);
  const [expandedCapability, setExpandedCapability] = useState<BusinessCapability | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<Application | null>(null);
  const [selectedITComponent, setSelectedITComponent] = useState<string | null>(parentSelectedITComponent ?? null);
  const [selectedInterface, setSelectedInterface] = useState<string | null>(null);
  const [selectedDataObject, setSelectedDataObject] = useState<string | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);

  const { data: allCapabilities = [] } = useQuery<BusinessCapability[]>({
    queryKey: ['/api/business-capabilities'],
  });

  // Sync parent selectedITComponent with internal state
  useEffect(() => {
    if (parentSelectedITComponent !== selectedITComponent) {
      setSelectedITComponent(parentSelectedITComponent ?? null);
    }
  }, [parentSelectedITComponent, selectedITComponent]);

  const handleITComponentClick = (componentName: string) => {
    setSelectedITComponent(componentName);
    // Clear other selections when filtering by IT component
    setExpandedCapability(null);
    setExpandedApplication(null);
    setSelectedInterface(null);
    setSelectedDataObject(null);
  };

  const handleInterfaceClick = (interfaceName: string) => {
    setSelectedInterface(interfaceName);
    // Clear other selections when filtering by interface
    setExpandedCapability(null);
    setExpandedApplication(null);
    setSelectedITComponent(null);
    setSelectedDataObject(null);
  };

  const handleDataObjectClick = (dataObjectName: string) => {
    setSelectedDataObject(dataObjectName);
    // Clear other selections when filtering by data object
    setExpandedCapability(null);
    setExpandedApplication(null);
    setSelectedITComponent(null);
    setSelectedInterface(null);
    setSelectedInitiative(null);
  };

  const handleInitiativeClick = (initiativeName: string) => {
    setSelectedInitiative(initiativeName);
    // Clear other selections when filtering by initiative
    setExpandedCapability(null);
    setExpandedApplication(null);
    setSelectedITComponent(null);
    setSelectedInterface(null);
    setSelectedDataObject(null);
  };

  // Sync with sidebar selection - navigate to the selected capability's context
  useEffect(() => {
    if (selectedCapability && allCapabilities.length > 0) {
      const capability = allCapabilities.find(cap => cap.id === selectedCapability);
      if (capability) {
        console.log('Sidebar selection changed to:', capability.name, 'Level:', capability.level);
        
        // Navigate to show this capability in context
        if (capability.level === 1) {
          setCurrentLevel(1);
          setSelectedParent(null);
        } else if (capability.level === 2) {
          setCurrentLevel(2);
          setSelectedParent(capability.level1Capability);
        } else if (capability.level === 3) {
          setCurrentLevel(3);
          setSelectedParent(capability.level2Capability);
        }
      }
    }
  }, [selectedCapability, allCapabilities]);

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const { data: dataObjects = [] } = useQuery<DataObject[]>({
    queryKey: ['/api/data-objects'],
  });

  const { data: interfaces = [] } = useQuery<Interface[]>({
    queryKey: ['/api/interfaces'],
  });

  const { data: itComponents = [] } = useQuery<ITComponent[]>({
    queryKey: ['/api/it-components'],
  });

  const { data: initiatives = [] } = useQuery<Initiative[]>({
    queryKey: ['/api/initiatives'],
  });

  // CSV Export Functions
  const convertToCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV values
          const escapedValue = String(value).replace(/"/g, '""');
          return `"${escapedValue}"`;
        }).join(',')
      )
    ].join('\n');
    return csvContent;
  };

  const fallbackDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // Use a user-initiated click event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    setTimeout(() => {
      console.log('Triggering download for:', filename);
      link.dispatchEvent(clickEvent);
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        console.log('Download completed for:', filename);
      }, 1000);
    }, 100);
  };

  const downloadCSV = (content: string, filename: string) => {
    console.log('Downloading CSV:', filename, 'Content length:', content.length);
    try {
      // Add BOM for proper Excel compatibility
      const BOM = '\uFEFF';
      const csvContent = BOM + content;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Try modern File System Access API first (Chrome/Edge)
      if ('showSaveFilePicker' in window) {
        (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'CSV files',
            accept: { 'text/csv': ['.csv'] }
          }]
        }).then(async (fileHandle: any) => {
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          console.log('File saved successfully:', filename);
        }).catch((error: any) => {
          console.log('File picker cancelled or failed, falling back to download:', error);
          fallbackDownload(blob, filename);
        });
      } else {
        fallbackDownload(blob, filename);
      }
      
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const handleGoBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      if (currentLevel === 2) {
        // Going back from L2 to L1
        setSelectedParent(null);
      } else if (currentLevel === 3) {
        // Going back from L3 to L2 - find the L1 parent of the current L2
        const currentL2Cap = allCapabilities.find(cap => cap.name === selectedParent && cap.level === 2);
        setSelectedParent(currentL2Cap?.level1Capability || null);
      }
    }
  };

  const handleCapabilityClick = (capability: BusinessCapability) => {
    console.log('Capability clicked:', capability.name, 'Current level:', currentLevel);
    
    // Check for children based on explicit level columns
    let children: BusinessCapability[] = [];
    if (currentLevel === 1) {
      children = allCapabilities.filter(cap => 
        cap.level === 2 && cap.level1Capability === capability.name
      );
    } else if (currentLevel === 2) {
      children = allCapabilities.filter(cap => 
        cap.level === 3 && cap.level1Capability === capability.level1Capability && cap.level2Capability === capability.name
      );
    }
    
    console.log('Found children:', children.length, 'for capability:', capability.name);
    const hasChildren = children.length > 0;
    
    if (hasChildren && currentLevel < 3) {
      // Use capability name for navigation since that's what the filtering expects
      console.log('Navigating to:', capability.name, 'New level will be:', currentLevel + 1);
      setSelectedParent(capability.name);
      setCurrentLevel(currentLevel + 1);
      
      // Add a timeout to verify state was set
      setTimeout(() => {
        console.log('State after navigation - Level:', currentLevel + 1, 'Parent:', capability.name);
      }, 100);
    } else {
      console.log('Showing details for capability:', capability.name);
      // Show details for capabilities without children or Level 3 capabilities
      onEntitySelect({
        type: 'capability',
        id: capability.id,
        data: capability
      });
    }
  };

  const getCapabilitiesToShow = () => {
    if (currentLevel === 1) {
      return allCapabilities.filter(cap => cap.level === 1);
    } else if (currentLevel === 2) {
      // selectedParent now contains the name of the L1 capability
      return allCapabilities.filter(cap => 
        cap.level === 2 && cap.level1Capability === selectedParent
      );
    } else if (currentLevel === 3) {
      // selectedParent now contains the name of the L2 capability
      // We need to find the L1 capability that contains this L2 capability
      const parentL2Cap = allCapabilities.find(c => c.name === selectedParent && c.level === 2);
      return allCapabilities.filter(cap => 
        cap.level === 3 && 
        cap.level1Capability === parentL2Cap?.level1Capability && 
        cap.level2Capability === selectedParent
      );
    }
    return [];
  };

  const capabilitiesToShow = getCapabilitiesToShow();
  
  // Find capabilities that match the search criteria using unified search
  const allMatchingCapabilities = searchTerm ? filterCapabilitiesByName(allCapabilities, searchTerm) : [];
  
  console.log('MetisMap allMatchingCapabilities:', allMatchingCapabilities?.length || 0);
  console.log('MetisMap current level:', currentLevel);
  console.log('MetisMap capabilitiesToShow before filter:', capabilitiesToShow.map(c => `${c.name} (L${c.level})`));





  // Use centralized filtered capabilities and filter by current level
  const filteredCapabilities = useMemo(() => {
    console.log('MetisMap: Using centralized filtered capabilities:', centralFilteredCapabilities.length);
    
    // Filter by current level from the centrally filtered capabilities
    const levelFiltered = centralFilteredCapabilities.filter(cap => cap.level === currentLevel);
    
    // If we have a selected parent, further filter by that
    if (selectedParent && currentLevel > 1) {
      const parentFiltered = levelFiltered.filter(cap => {
        if (currentLevel === 2) {
          return cap.level1Capability === selectedParent;
        } else if (currentLevel === 3) {
          return cap.level2Capability === selectedParent;
        }
        return true;
      });
      console.log('MetisMap: Filtered by parent', selectedParent, ':', parentFiltered.length);
      return parentFiltered;
    }
    
    console.log('MetisMap: Level', currentLevel, 'capabilities:', levelFiltered.length);
    return levelFiltered;
  }, [centralFilteredCapabilities, currentLevel, selectedParent]);
  
  // Force re-render when search changes by using a key
  const renderKey = `${searchTerm}-${filteredCapabilities.length}-${currentLevel}`;
    
  console.log('MetisMap capabilitiesToShow:', capabilitiesToShow.length);
  console.log('MetisMap filteredCapabilities:', filteredCapabilities.length);
  console.log('MetisMap filteredCapabilities names:', filteredCapabilities.map(c => `${c.name} (L${c.level})`));
  console.log('MetisMap about to render capabilities count:', filteredCapabilities.length);

  // Generate legend data for the current metric
  const legendData = useMemo(() => {
    if (!heatmapFilters.showColors || heatmapFilters.metric === 'none' || !applications.length) {
      return [];
    }

    const allValues = new Set<string>();
    applications.forEach(app => {
      let value: string | null = null;
      switch (heatmapFilters.metric) {
        case 'technicalSuitability':
          value = app.technicalSuitability;
          break;
        case 'functionalFit':
          value = app.functionalFit;
          break;
      }
      if (value && value.trim()) {
        allValues.add(value.trim());
      }
    });

    const uniqueValues = Array.from(allValues).sort();

    if (heatmapFilters.metric === 'technicalSuitability' || heatmapFilters.metric === 'functionalFit') {
      // Score-based coloring
      return uniqueValues.map(value => {
        const score = (() => {
          switch (value.toLowerCase()) {
            case 'perfect': case 'fullyappropriate': return 5;
            case 'appropriate': case 'adequate': return 3;
            case 'partiallyappropriate': case 'poor': return 1;
            default: return 2;
          }
        })();

        let color;
        if (score >= 4) color = 'bg-green-500';
        else if (score >= 2.5) color = 'bg-yellow-500';
        else color = 'bg-red-500';

        return { value, color, score };
      }).sort((a, b) => b.score - a.score);
    } else {
      // Categorical coloring
      const colors = [
        'bg-purple-500', 'bg-indigo-500', 'bg-pink-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-lime-500'
      ];
      
      return uniqueValues.map((value, index) => ({
        value,
        color: colors[index % colors.length],
        score: 0
      }));
    }
  }, [heatmapFilters.metric, heatmapFilters.showColors, applications]);

  const getHeatmapColor = (capability: BusinessCapability, relatedApps: Application[]) => {
    if (!heatmapFilters.showColors || heatmapFilters.metric === 'none') {
      return getDefaultLevelColor(capability.level);
    }

    // Calculate metric based on related applications
    const metricValues = relatedApps.map(app => {
      switch (heatmapFilters.metric) {
        case 'technicalSuitability':
          return app.technicalSuitability;
        case 'functionalFit':
          return app.functionalFit;
        default:
          return null;
      }
    }).filter(Boolean);

    if (metricValues.length === 0) {
      return { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-300 dark:border-gray-600', color: 'text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' };
    }

    // Color coding based on metric scores (only for technical suitability and functional fit)
    const scores = metricValues.map(val => {
      switch (val?.toLowerCase()) {
        case 'perfect': case 'fullyappropriate': return 5;
        case 'appropriate': case 'adequate': return 3;
        case 'partiallyappropriate': case 'poor': return 1;
        default: return 2;
      }
    });
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    if (avgScore >= 4) return { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-400 dark:border-green-600', color: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' };
    if (avgScore >= 2.5) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-400 dark:border-yellow-600', color: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' };
    return { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-400 dark:border-red-600', color: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' };
  };

  const getDefaultLevelColor = (level: number | null) => {
    if (!level) return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-700', color: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' };
    switch (level) {
      case 1: return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' };
      case 2: return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', color: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' };
      case 3: return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' };
      default: return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-700', color: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' };
    }
  };

  // Export functionality
  const exportCurrentData = () => {
    console.log('Starting export process...');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    console.log('Export timestamp:', timestamp);
    
    // Export currently displayed capabilities
    const capabilityHeaders = [
      'name', 'displayName', 'hierarchy', 'level', 'level1Capability', 
      'level2Capability', 'level3Capability', 'parentId', 'relatedApplicationsCount',
      'relatedApplications', 'childCapabilities', 'hasSubCapabilities'
    ];
    const displayedCapabilities = filteredCapabilities || capabilitiesToShow;
    console.log('Capabilities to export:', displayedCapabilities.length);
    const capabilityData = displayedCapabilities.map(cap => {
      // Get related applications for this capability
      const capabilityApplications = applications.filter(app => {
        if (!app.businessCapabilities) return false;
        const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
        return appCapabilities.some(appCap => 
          cap.name === appCap || 
          cap.name.includes(appCap) || 
          appCap.includes(cap.name) ||
          appCap.includes(cap.hierarchy || '')
        );
      });

      // Get child capabilities
      const childCapabilities = allCapabilities.filter(child => child.parentId === cap.id);
      
      return {
        name: cap.name,
        displayName: cap.displayName || '',
        hierarchy: cap.hierarchy || '',
        level: cap.level || '',
        level1Capability: cap.level1Capability || '',
        level2Capability: cap.level2Capability || '',
        level3Capability: cap.level3Capability || '',
        parentId: cap.parentId || '',
        relatedApplicationsCount: capabilityApplications.length,
        relatedApplications: capabilityApplications.map(app => app.name).join('; '),
        childCapabilities: childCapabilities.map(child => child.name).join('; '),
        hasSubCapabilities: childCapabilities.length > 0 ? 'Yes' : 'No'
      };
    });
    
    console.log('Capability data processed, generating CSV...');
    const capabilityCSV = convertToCSV(capabilityData, capabilityHeaders);
    console.log('CSV generated, attempting download...');
    downloadCSV(capabilityCSV, `capabilities_level_${currentLevel}_${timestamp}.csv`);

    // Export related applications for displayed capabilities
    const relatedApplications = applications.filter(app => {
      if (!app.businessCapabilities) return false;
      const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
      return displayedCapabilities.some(cap => 
        appCapabilities.some(appCap => 
          cap.name === appCap || 
          cap.name.includes(appCap) || 
          appCap.includes(cap.name) ||
          appCap.includes(cap.hierarchy || '')
        )
      );
    });

    if (relatedApplications.length > 0) {
      const applicationHeaders = [
        'name', 'displayName', 'businessCapabilities', 'description', 'vendor',
        'technicalSuitability', 'functionalFit', 'businessDomain', 'maturityStatus',
        'relatedITComponents', 'relatedInterfaces', 'relatedDataObjects', 'usedByInitiatives'
      ];
      const applicationData = relatedApplications.map(app => {
        // Get related IT components
        const relatedComponents = itComponents.filter(comp => 
          comp.applications && comp.applications.includes(app.name)
        ).map(comp => comp.name).join('; ');

        // Get related interfaces (where app is source or target)
        const relatedInterfacesList = interfaces.filter(intf => 
          intf.sourceApplication === app.name || intf.targetApplication === app.name
        ).map(intf => `${intf.name} (${intf.sourceApplication} -> ${intf.targetApplication})`).join('; ');

        // Get related data objects from interfaces
        const relatedDataObjectsList = interfaces
          .filter(intf => intf.sourceApplication === app.name || intf.targetApplication === app.name)
          .map(intf => intf.dataObjects)
          .filter(Boolean)
          .join('; ');

        // Get initiatives that use this application
        const usedByInitiativesList = initiatives.filter(init => 
          init.applications && init.applications.includes(app.name)
        ).map(init => init.name).join('; ');

        return {
          name: app.name,
          displayName: app.displayName || '',
          businessCapabilities: app.businessCapabilities || '',
          description: app.description || '',
          vendor: app.vendor || '',
          technicalSuitability: app.technicalSuitability || '',
          functionalFit: app.functionalFit || '',
          businessDomain: app.businessDomain || '',
          maturityStatus: app.maturityStatus || '',
          relatedITComponents: relatedComponents,
          relatedInterfaces: relatedInterfacesList,
          relatedDataObjects: relatedDataObjectsList,
          usedByInitiatives: usedByInitiativesList
        };
      });
      
      const applicationCSV = convertToCSV(applicationData, applicationHeaders);
      downloadCSV(applicationCSV, `applications_${timestamp}.csv`);
    }

    // Export specific filtered data if any filter is active
    if (selectedITComponent) {
      const relatedComponents = itComponents.filter(comp => comp.name === selectedITComponent);
      if (relatedComponents.length > 0) {
        const componentHeaders = [
          'name', 'displayName', 'category', 'vendor', 'version', 'status', 'applications',
          'relatedApplicationsList', 'relatedCapabilities', 'usedByInitiatives'
        ];
        const componentData = relatedComponents.map(comp => {
          // Get related applications
          const componentApplications = comp.applications ? comp.applications.split(';').map(app => app.trim()) : [];
          const relatedApps = applications.filter(app => componentApplications.includes(app.name));
          
          // Get related capabilities through applications
          const relatedCapabilities = new Set();
          relatedApps.forEach(app => {
            if (app.businessCapabilities) {
              app.businessCapabilities.split(';').forEach(cap => {
                relatedCapabilities.add(cap.trim().replace(/^~/, ''));
              });
            }
          });

          // Get initiatives that use this component
          const usedByInitiativesList = initiatives.filter(init => {
            if (!init.applications) return false;
            return componentApplications.some(appName => 
              init.applications && init.applications.includes(appName)
            );
          }).map(init => init.name).join('; ');

          return {
            name: comp.name,
            displayName: comp.displayName || '',
            category: comp.category || '',
            vendor: comp.vendor || '',
            version: comp.version || '',
            status: comp.status || '',
            applications: comp.applications || '',
            relatedApplicationsList: relatedApps.map(app => `${app.name} (${app.vendor || 'Unknown'})`).join('; '),
            relatedCapabilities: Array.from(relatedCapabilities).join('; '),
            usedByInitiatives: usedByInitiativesList
          };
        });
        
        const componentCSV = convertToCSV(componentData, componentHeaders);
        downloadCSV(componentCSV, `filtered_it_component_${timestamp}.csv`);
      }
    }

    if (selectedInterface) {
      const relatedInterfaces = interfaces.filter(intf => intf.name === selectedInterface);
      if (relatedInterfaces.length > 0) {
        const interfaceHeaders = [
          'name', 'sourceApplication', 'targetApplication', 'dataFlow', 
          'frequency', 'dataObjects', 'status', 'sourceApplicationDetails',
          'targetApplicationDetails', 'relatedCapabilities', 'relatedDataObjectDetails'
        ];
        const interfaceData = relatedInterfaces.map(intf => {
          // Get source and target application details
          const sourceApp = applications.find(app => app.name === intf.sourceApplication);
          const targetApp = applications.find(app => app.name === intf.targetApplication);
          
          // Get related capabilities from both applications
          const relatedCapabilities = new Set();
          [sourceApp, targetApp].forEach(app => {
            if (app && app.businessCapabilities) {
              app.businessCapabilities.split(';').forEach(cap => {
                relatedCapabilities.add(cap.trim().replace(/^~/, ''));
              });
            }
          });

          // Get data object details
          const dataObjectNames = intf.dataObjects ? intf.dataObjects.split(';').map(obj => obj.trim()) : [];
          const relatedDataObjectDetails = dataObjects
            .filter(obj => dataObjectNames.includes(obj.name))
            .map(obj => `${obj.name} (${obj.displayName || 'No display name'})`)
            .join('; ');

          return {
            name: intf.name,
            sourceApplication: intf.sourceApplication || '',
            targetApplication: intf.targetApplication || '',
            dataFlow: intf.dataFlow || '',
            frequency: intf.frequency || '',
            dataObjects: intf.dataObjects || '',
            status: intf.status || '',
            sourceApplicationDetails: sourceApp ? `${sourceApp.name} - ${sourceApp.vendor || 'Unknown vendor'} (${sourceApp.businessDomain || 'Unknown domain'})` : '',
            targetApplicationDetails: targetApp ? `${targetApp.name} - ${targetApp.vendor || 'Unknown vendor'} (${targetApp.businessDomain || 'Unknown domain'})` : '',
            relatedCapabilities: Array.from(relatedCapabilities).join('; '),
            relatedDataObjectDetails: relatedDataObjectDetails
          };
        });
        
        const interfaceCSV = convertToCSV(interfaceData, interfaceHeaders);
        downloadCSV(interfaceCSV, `filtered_interface_${timestamp}.csv`);
      }
    }

    if (selectedDataObject) {
      const relatedDataObjects = dataObjects.filter(obj => obj.name === selectedDataObject);
      if (relatedDataObjects.length > 0) {
        const dataObjectHeaders = [
          'name', 'displayName', 'relatedInterfaces', 'relatedApplications', 
          'sourceApplications', 'targetApplications', 'relatedCapabilities', 'usageFrequency'
        ];
        const dataObjectData = relatedDataObjects.map(obj => {
          // Get interfaces that use this data object
          const relatedInterfacesList = interfaces.filter(intf => 
            intf.dataObjects && intf.dataObjects.includes(obj.name)
          );

          // Get source and target applications from interfaces
          const sourceApps = new Set();
          const targetApps = new Set();
          const relatedApps = new Set();
          
          relatedInterfacesList.forEach(intf => {
            if (intf.sourceApplication) {
              sourceApps.add(intf.sourceApplication);
              relatedApps.add(intf.sourceApplication);
            }
            if (intf.targetApplication) {
              targetApps.add(intf.targetApplication);
              relatedApps.add(intf.targetApplication);
            }
          });

          // Get related capabilities through applications
          const relatedCapabilities = new Set();
          Array.from(relatedApps).forEach(appName => {
            const app = applications.find(a => a.name === appName);
            if (app && app.businessCapabilities) {
              app.businessCapabilities.split(';').forEach(cap => {
                relatedCapabilities.add(cap.trim().replace(/^~/, ''));
              });
            }
          });

          // Calculate usage frequency based on interface frequency
          const frequencies = relatedInterfacesList
            .map(intf => intf.frequency)
            .filter(Boolean);

          return {
            name: obj.name,
            displayName: obj.displayName || '',
            relatedInterfaces: relatedInterfacesList.map(intf => `${intf.name} (${intf.sourceApplication} -> ${intf.targetApplication})`).join('; '),
            relatedApplications: Array.from(relatedApps).join('; '),
            sourceApplications: Array.from(sourceApps).join('; '),
            targetApplications: Array.from(targetApps).join('; '),
            relatedCapabilities: Array.from(relatedCapabilities).join('; '),
            usageFrequency: frequencies.join('; ')
          };
        });
        
        const dataObjectCSV = convertToCSV(dataObjectData, dataObjectHeaders);
        downloadCSV(dataObjectCSV, `filtered_data_object_${timestamp}.csv`);
      }
    }

    if (selectedInitiative) {
      const relatedInitiatives = initiatives.filter(init => init.name === selectedInitiative);
      if (relatedInitiatives.length > 0) {
        const initiativeHeaders = [
          'name', 'description', 'status', 'startDate', 'endDate', 
          'businessCapabilities', 'applications', 'relatedApplicationDetails',
          'relatedCapabilityDetails', 'impactedITComponents', 'relatedInterfaces',
          'duration', 'businessDomains'
        ];
        const initiativeData = relatedInitiatives.map(init => {
          // Get application details
          const initiativeApplications = init.applications ? init.applications.split(';').map(app => app.trim()) : [];
          const relatedApps = applications.filter(app => initiativeApplications.includes(app.name));
          
          // Get capability details
          const initiativeCapabilities = init.businessCapabilities ? init.businessCapabilities.split(';').map(cap => cap.trim()) : [];
          const relatedCaps = allCapabilities.filter(cap => 
            initiativeCapabilities.some(initCap => 
              cap.name === initCap || cap.name.includes(initCap) || initCap.includes(cap.name)
            )
          );

          // Get impacted IT components through applications
          const impactedComponents = itComponents.filter(comp => {
            if (!comp.applications) return false;
            return initiativeApplications.some(appName => 
              comp.applications && comp.applications.includes(appName)
            );
          });

          // Get related interfaces through applications
          const relatedInterfacesList = interfaces.filter(intf => 
            initiativeApplications.includes(intf.sourceApplication || '') || 
            initiativeApplications.includes(intf.targetApplication || '')
          );

          // Calculate duration
          let duration = '';
          if (init.startDate && init.endDate) {
            const start = new Date(init.startDate);
            const end = new Date(init.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            duration = `${diffDays} days`;
          }

          // Get business domains
          const businessDomains = new Set();
          relatedApps.forEach(app => {
            if (app.businessDomain) {
              businessDomains.add(app.businessDomain);
            }
          });

          return {
            name: init.name,
            description: init.description || '',
            status: init.status || '',
            startDate: init.startDate || '',
            endDate: init.endDate || '',
            businessCapabilities: init.businessCapabilities || '',
            applications: init.applications || '',
            relatedApplicationDetails: relatedApps.map(app => `${app.name} (${app.vendor || 'Unknown'}) - ${app.maturityStatus || 'Unknown status'}`).join('; '),
            relatedCapabilityDetails: relatedCaps.map(cap => `${cap.name} (Level ${cap.level || 'Unknown'})`).join('; '),
            impactedITComponents: impactedComponents.map(comp => `${comp.name} (${comp.category || 'Unknown category'})`).join('; '),
            relatedInterfaces: relatedInterfacesList.map(intf => `${intf.name} (${intf.sourceApplication} -> ${intf.targetApplication})`).join('; '),
            duration: duration,
            businessDomains: Array.from(businessDomains).join('; ')
          };
        });
        
        const initiativeCSV = convertToCSV(initiativeData, initiativeHeaders);
        downloadCSV(initiativeCSV, `filtered_initiative_${timestamp}.csv`);
      }
    }
  };

  // Export functionality that will be called directly
  const performDirectExport = async () => {
    console.log('Starting contextual export...');
    console.log('Export state - Level:', currentLevel, 'Parent:', selectedParent);
    
    // Get the exact capabilities visible in the current map view
    let currentCapabilities: any[] = [];
    
    if (selectedITComponent) {
      // When IT component is selected, find its related applications and their capabilities
      const component = itComponents.find(comp => comp.name === selectedITComponent);
      if (component) {
        const relatedApps = applications.filter(app => 
          component.applications && component.applications.toLowerCase().includes(app.name.toLowerCase())
        );
        const capabilityNames = new Set();
        relatedApps.forEach(app => {
          if (app.businessCapabilities) {
            app.businessCapabilities.split(';').forEach(cap => {
              capabilityNames.add(cap.trim().replace(/^~/, ''));
            });
          }
        });
        currentCapabilities = allCapabilities.filter((cap: any) => capabilityNames.has(cap.name));
      }
    } else if (selectedInterface) {
      // When interface is selected, find its related applications and their capabilities
      const intf = interfaces.find(i => i.name === selectedInterface);
      if (intf) {
        const relatedApps = applications.filter(app => 
          (intf.sourceApplication && app.name === intf.sourceApplication) ||
          (intf.targetApplication && app.name === intf.targetApplication)
        );
        const capabilityNames = new Set();
        relatedApps.forEach(app => {
          if (app.businessCapabilities) {
            app.businessCapabilities.split(';').forEach((cap: string) => {
              capabilityNames.add(cap.trim().replace(/^~/, ''));
            });
          }
        });
        currentCapabilities = allCapabilities.filter((cap: any) => capabilityNames.has(cap.name));
      }
    } else if (selectedDataObject) {
      // When data object is selected, find its related applications and their capabilities
      const dataObj = dataObjects.find(obj => obj.name === selectedDataObject);
      if (dataObj) {
        const relatedInterfaces = interfaces.filter(intf => 
          intf.dataObjects && intf.dataObjects.includes(dataObj.name)
        );
        const relatedApps = applications.filter(app =>
          relatedInterfaces.some(intf => 
            app.name === intf.sourceApplication || app.name === intf.targetApplication
          )
        );
        const capabilityNames = new Set();
        relatedApps.forEach(app => {
          if (app.businessCapabilities) {
            app.businessCapabilities.split(';').forEach((cap: string) => {
              capabilityNames.add(cap.trim().replace(/^~/, ''));
            });
          }
        });
        currentCapabilities = allCapabilities.filter((cap: any) => capabilityNames.has(cap.name));
      }
    } else if (selectedInitiative) {
      // When initiative is selected, find its related applications and their capabilities
      const initiative = initiatives.find(init => init.name === selectedInitiative);
      if (initiative && initiative.applications) {
        const relatedApps = applications.filter(app =>
          initiative.applications && initiative.applications.includes(app.name)
        );
        const capabilityNames = new Set();
        relatedApps.forEach(app => {
          if (app.businessCapabilities) {
            app.businessCapabilities.split(';').forEach((cap: string) => {
              capabilityNames.add(cap.trim().replace(/^~/, ''));
            });
          }
        });
        currentCapabilities = allCapabilities.filter((cap: any) => capabilityNames.has(cap.name));
      }
    } else {
      // Normal capability map view - recalculate capabilities based on current navigation state
      if (currentLevel === 1) {
        currentCapabilities = allCapabilities.filter(cap => cap.level === 1);
      } else if (currentLevel === 2) {
        currentCapabilities = allCapabilities.filter(cap => 
          cap.level === 2 && cap.level1Capability === selectedParent
        );
      } else if (currentLevel === 3) {
        const parentL2Cap = allCapabilities.find(c => c.name === selectedParent && c.level === 2);
        currentCapabilities = allCapabilities.filter(cap => 
          cap.level === 3 && 
          cap.level1Capability === parentL2Cap?.level1Capability && 
          cap.level2Capability === selectedParent
        );
      }
    }
    
    console.log('Currently displayed capabilities:', currentCapabilities?.length || 0);
    console.log('Capability names:', currentCapabilities?.map(c => c.name).slice(0, 5));
    console.log('Current level:', currentLevel);
    console.log('Selected parent:', selectedParent);
    console.log('Search term:', searchTerm);
    console.log('Filtered capabilities length:', filteredCapabilities?.length || 0);
    
    if (!currentCapabilities || currentCapabilities.length === 0) {
      console.warn('No capabilities currently displayed to export');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const downloads: Array<{ data: any[], headers: string[], filename: string, type: string }> = [];
    
    // Export only currently displayed capabilities
    const capabilityHeaders = [
      'name', 'displayName', 'hierarchy', 'level', 'level1Capability', 
      'level2Capability', 'level3Capability', 'parentId', 'relatedApplicationsCount',
      'relatedApplications', 'childCapabilities', 'hasSubCapabilities'
    ];
    
    const capabilityData = currentCapabilities.map((cap: any) => {
      // Get related applications for this specific capability
      const capabilityApplications = applications.filter(app => {
        if (!app.businessCapabilities) return false;
        const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
        return appCapabilities.some(appCap => 
          cap.name === appCap || 
          cap.name.includes(appCap) || 
          appCap.includes(cap.name) ||
          appCap.includes(cap.hierarchy || '')
        );
      });

      // Get child capabilities
      const childCapabilities = allCapabilities.filter(child => child.parentId === cap.id);
      
      return {
        name: cap.name,
        displayName: cap.displayName || '',
        hierarchy: cap.hierarchy || '',
        level: cap.level || '',
        level1Capability: cap.level1Capability || '',
        level2Capability: cap.level2Capability || '',
        level3Capability: cap.level3Capability || '',
        parentId: cap.parentId || '',
        relatedApplicationsCount: capabilityApplications.length,
        relatedApplications: capabilityApplications.map(app => app.name).join('; '),
        childCapabilities: childCapabilities.map(child => child.name).join('; '),
        hasSubCapabilities: childCapabilities.length > 0 ? 'Yes' : 'No'
      };
    });
    
    downloads.push({
      data: capabilityData,
      headers: capabilityHeaders,
      filename: `displayed_capabilities_level_${currentLevel}_${timestamp}.csv`,
      type: 'displayed capabilities'
    });

    // Get applications related to displayed capabilities
    const relatedApplications = applications.filter(app => {
      if (!app.businessCapabilities) return false;
      const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
      return currentCapabilities.some(cap => 
        appCapabilities.some(appCap => 
          cap.name === appCap || 
          cap.name.includes(appCap) || 
          appCap.includes(cap.name) ||
          appCap.includes(cap.hierarchy || '')
        )
      );
    });

    if (relatedApplications.length > 0) {
      const applicationHeaders = [
        'name', 'displayName', 'businessCapabilities', 'description', 'vendor',
        'technicalSuitability', 'functionalFit', 'businessDomain', 'maturityStatus',
        'relatedITComponents', 'relatedInterfaces', 'relatedDataObjects', 'usedByInitiatives'
      ];
      
      const applicationData = relatedApplications.map((app: any) => {
        // Get related IT components
        const relatedComponents = itComponents.filter(comp => 
          comp.applications && comp.applications.includes(app.name)
        ).map(comp => comp.name).join('; ');

        // Get related interfaces (where app is source or target)
        const relatedInterfacesList = interfaces.filter(intf => 
          intf.sourceApplication === app.name || intf.targetApplication === app.name
        ).map(intf => `${intf.name} (${intf.sourceApplication} -> ${intf.targetApplication})`).join('; ');

        // Get related data objects from interfaces
        const relatedDataObjectsList = interfaces
          .filter(intf => intf.sourceApplication === app.name || intf.targetApplication === app.name)
          .map(intf => intf.dataObjects)
          .filter(Boolean)
          .join('; ');

        // Get initiatives that use this application
        const usedByInitiativesList = initiatives.filter(init => 
          init.applications && init.applications.includes(app.name)
        ).map(init => init.name).join('; ');

        return {
          name: app.name,
          displayName: app.displayName || '',
          businessCapabilities: app.businessCapabilities || '',
          description: app.description || '',
          vendor: app.vendor || '',
          technicalSuitability: app.technicalSuitability || '',
          functionalFit: app.functionalFit || '',
          businessDomain: app.businessDomain || '',
          maturityStatus: app.maturityStatus || '',
          relatedITComponents: relatedComponents,
          relatedInterfaces: relatedInterfacesList,
          relatedDataObjects: relatedDataObjectsList,
          usedByInitiatives: usedByInitiativesList
        };
      });
      
      downloads.push({
        data: applicationData,
        headers: applicationHeaders,
        filename: `related_applications_level_${currentLevel}_${timestamp}.csv`,
        type: 'related applications'
      });
    }

    // Get IT components used by related applications
    const relatedITComponents = itComponents.filter(comp => {
      if (!comp.applications) return false;
      const compApplications = comp.applications.split(';').map(app => app.trim());
      return relatedApplications.some(app => compApplications.includes(app.name));
    });

    if (relatedITComponents.length > 0) {
      const componentHeaders = [
        'name', 'displayName', 'category', 'vendor', 'version', 'status', 'applications',
        'relatedApplicationsList', 'relatedCapabilities', 'usedByInitiatives'
      ];
      
      const componentData = relatedITComponents.map((comp: any) => {
        // Get related applications
        const componentApplications = comp.applications ? comp.applications.split(';').map((app: string) => app.trim()) : [];
        const relatedApps = applications.filter((app: any) => componentApplications.includes(app.name));
        
        // Get related capabilities through applications
        const relatedCapabilities = new Set();
        relatedApps.forEach((app: any) => {
          if (app.businessCapabilities) {
            app.businessCapabilities.split(';').forEach((cap: string) => {
              relatedCapabilities.add(cap.trim().replace(/^~/, ''));
            });
          }
        });

        // Get initiatives that use this component
        const usedByInitiativesList = initiatives.filter(init => {
          if (!init.applications) return false;
          return componentApplications.some((appName: any) => 
            init.applications && init.applications.includes(appName)
          );
        }).map(init => init.name).join('; ');

        return {
          name: comp.name,
          displayName: comp.displayName || '',
          category: comp.category || '',
          vendor: comp.vendor || '',
          version: comp.version || '',
          status: comp.status || '',
          applications: comp.applications || '',
          relatedApplicationsList: relatedApps.map(app => `${app.name} (${app.vendor || 'Unknown'})`).join('; '),
          relatedCapabilities: Array.from(relatedCapabilities).join('; '),
          usedByInitiatives: usedByInitiativesList
        };
      });
      
      downloads.push({
        data: componentData,
        headers: componentHeaders,
        filename: `related_it_components_level_${currentLevel}_${timestamp}.csv`,
        type: 'related IT components'
      });
    }

    // Get interfaces involving the related applications
    const relatedInterfaces = interfaces.filter(intf => 
      relatedApplications.some(app => 
        intf.sourceApplication === app.name || intf.targetApplication === app.name
      )
    );

    if (relatedInterfaces.length > 0) {
      const interfaceHeaders = [
        'name', 'sourceApplication', 'targetApplication', 'dataFlow', 
        'frequency', 'dataObjects', 'status', 'relatedCapabilities'
      ];
      
      const interfaceData = relatedInterfaces.map((intf: any) => {
        // Get capabilities related through source and target applications
        const sourceApp = applications.find(app => app.name === intf.sourceApplication);
        const targetApp = applications.find(app => app.name === intf.targetApplication);
        const relatedCaps = new Set();
        
        if (sourceApp?.businessCapabilities) {
          sourceApp.businessCapabilities.split(';').forEach((cap: string) => {
            relatedCaps.add(cap.trim().replace(/^~/, ''));
          });
        }
        if (targetApp?.businessCapabilities) {
          targetApp.businessCapabilities.split(';').forEach((cap: string) => {
            relatedCaps.add(cap.trim().replace(/^~/, ''));
          });
        }

        return {
          name: intf.name,
          sourceApplication: intf.sourceApplication || '',
          targetApplication: intf.targetApplication || '',
          dataFlow: intf.dataFlow || '',
          frequency: intf.frequency || '',
          dataObjects: intf.dataObjects || '',
          status: intf.status || '',
          relatedCapabilities: Array.from(relatedCaps).join('; ')
        };
      });
      
      downloads.push({
        data: interfaceData,
        headers: interfaceHeaders,
        filename: `related_interfaces_level_${currentLevel}_${timestamp}.csv`,
        type: 'related interfaces'
      });
    }

    // Get data objects that are used by the related interfaces
    const relatedDataObjects = dataObjects.filter(dataObj => {
      return relatedInterfaces.some(intf => 
        intf.dataObjects && intf.dataObjects.includes(dataObj.name)
      );
    });

    if (relatedDataObjects.length > 0) {
      const dataObjectHeaders = [
        'name', 'displayName', 'usedByInterfaces', 'relatedApplications', 'relatedCapabilities'
      ];
      
      const dataObjectData = relatedDataObjects.map((dataObj: any) => {
        // Get interfaces that use this data object
        const usingInterfaces = relatedInterfaces.filter(intf => 
          intf.dataObjects && intf.dataObjects.includes(dataObj.name)
        );

        // Get applications involved in these interfaces
        const involvedApps = new Set();
        const relatedCaps = new Set();
        
        usingInterfaces.forEach(intf => {
          if (intf.sourceApplication) involvedApps.add(intf.sourceApplication);
          if (intf.targetApplication) involvedApps.add(intf.targetApplication);
        });

        // Get capabilities from involved applications
        Array.from(involvedApps).forEach((appName: any) => {
          const app = applications.find(a => a.name === appName);
          if (app?.businessCapabilities) {
            app.businessCapabilities.split(';').forEach((cap: string) => {
              relatedCaps.add(cap.trim().replace(/^~/, ''));
            });
          }
        });

        return {
          name: dataObj.name,
          displayName: dataObj.displayName || '',
          usedByInterfaces: usingInterfaces.map(intf => intf.name).join('; '),
          relatedApplications: Array.from(involvedApps).join('; '),
          relatedCapabilities: Array.from(relatedCaps).join('; ')
        };
      });
      
      downloads.push({
        data: dataObjectData,
        headers: dataObjectHeaders,
        filename: `related_data_objects_level_${currentLevel}_${timestamp}.csv`,
        type: 'related data objects'
      });
    }

    // Get initiatives that involve the related applications
    const relatedInitiatives = initiatives.filter(init => {
      if (!init.applications) return false;
      return relatedApplications.some(app => 
        init.applications && init.applications.includes(app.name)
      );
    });

    if (relatedInitiatives.length > 0) {
      const initiativeHeaders = [
        'name', 'description', 'status', 'startDate', 'endDate', 
        'businessCapabilities', 'applications', 'relatedCapabilitiesFromApps'
      ];
      
      const initiativeData = relatedInitiatives.map((init: any) => {
        // Get capabilities from the initiative's applications
        const initApps = init.applications ? init.applications.split(';').map((app: string) => app.trim()) : [];
        const relatedCaps = new Set();
        
        initApps.forEach((appName: string) => {
          const app = applications.find(a => a.name === appName);
          if (app?.businessCapabilities) {
            app.businessCapabilities.split(';').forEach((cap: string) => {
              relatedCaps.add(cap.trim().replace(/^~/, ''));
            });
          }
        });

        return {
          name: init.name,
          description: init.description || '',
          status: init.status || '',
          startDate: init.startDate || '',
          endDate: init.endDate || '',
          businessCapabilities: init.businessCapabilities || '',
          applications: init.applications || '',
          relatedCapabilitiesFromApps: Array.from(relatedCaps).join('; ')
        };
      });
      
      downloads.push({
        data: initiativeData,
        headers: initiativeHeaders,
        filename: `related_initiatives_level_${currentLevel}_${timestamp}.csv`,
        type: 'related initiatives'
      });
    }

    if (downloads.length === 0) {
      console.warn('No data available for export - all datasets are empty');
      return;
    }

    // Download files one at a time with delays to avoid browser blocking
    for (let i = 0; i < downloads.length; i++) {
      const download = downloads[i];
      console.log(`Exporting ${download.data.length} ${download.type}`);
      
      const csv = convertToCSV(download.data, download.headers);
      downloadCSV(csv, download.filename);
      
      // Wait 500ms between downloads to avoid browser blocking
      if (i < downloads.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`Export completed: ${downloads.length} files generated`);
    console.log('Summary of exported data:');
    console.log(`- ${currentCapabilities.length} capabilities (Level ${currentLevel})`);
    console.log(`- ${relatedApplications.length} related applications`);
    console.log(`- ${relatedITComponents.length} related IT components`);
    console.log(`- ${relatedInterfaces.length} related interfaces`);
    console.log(`- ${relatedDataObjects.length} related data objects`);
    console.log(`- ${relatedInitiatives.length} related initiatives`);

    // Prepare export summary data for modal
    const summaryData = {
      capabilities: currentCapabilities.length,
      applications: relatedApplications.length,
      itComponents: relatedITComponents.length,
      interfaces: relatedInterfaces.length,
      dataObjects: relatedDataObjects.length,
      initiatives: relatedInitiatives.length,
      level: currentLevel,
      filenames: downloads.map(d => d.filename),
      totalFiles: downloads.length
    };

    // Show export summary modal
    setExportSummaryData(summaryData);
    setShowExportSummary(true);
  };

  // Create a ref to store the latest export function that has access to current state
  const performExportRef = useRef<() => void>();
  
  // Update the ref whenever state changes
  useEffect(() => {
    performExportRef.current = () => {
      console.log('Export called with current state - Level:', currentLevel, 'Parent:', selectedParent);
      performDirectExport();
    };
  }, [currentLevel, selectedParent, selectedITComponent, selectedInterface, selectedDataObject, selectedInitiative, searchTerm]);

  // Listen for export event - use ref to call latest version
  useEffect(() => {
    const handleExport = () => {
      console.log('Export event received in MetisMap');
      try {
        if (performExportRef.current) {
          performExportRef.current();
        }
      } catch (error) {
        console.error('Error in export function:', error);
      }
    };

    console.log('Setting up export event listener in MetisMap');
    window.addEventListener('exportData', handleExport);
    return () => {
      console.log('Removing export event listener in MetisMap');
      window.removeEventListener('exportData', handleExport);
    };
  }, []);

  return (
    <div className="w-full h-full overflow-auto bg-slate-50 dark:bg-slate-900 p-6">
      {/* Navigation breadcrumb */}
      {currentLevel > 1 && (
        <div className="mb-6 flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md w-fit">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Level {currentLevel}</span>
            {selectedParent && (
              <>
                <span>•</span>
                <span className="font-medium">{selectedParent}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Level indicator and filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Level {currentLevel} Capabilities ({searchTerm ? `${filteredCapabilities.length} of ${capabilitiesToShow.length}` : filteredCapabilities.length})
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLevel === 1 && "Enterprise capability overview - Click any capability to explore sub-capabilities"}
            {currentLevel === 2 && "Sub-capabilities - Click any capability to see detailed capabilities"}
            {currentLevel === 3 && "Detailed capabilities - Click any capability to view applications and details"}
          </p>
        </div>

        {/* Heatmap filters */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showHeatmap"
              checked={heatmapFilters.showColors}
              onChange={(e) => setHeatmapFilters(prev => ({ ...prev, showColors: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showHeatmap" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Heatmap
            </label>
          </div>

          <select
            value={heatmapFilters.metric}
            onChange={(e) => setHeatmapFilters(prev => ({ 
              ...prev, 
              metric: e.target.value as HeatmapFilters['metric']
            }))}
            disabled={!heatmapFilters.showColors}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            <option value="none">Select Metric</option>
            <option value="technicalSuitability">Technical Suitability</option>
            <option value="functionalFit">Functional Fit</option>
          </select>

          {heatmapFilters.showColors && heatmapFilters.metric !== 'none' && (
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Colors: {heatmapFilters.metric === 'technicalSuitability' ? 'Technical Suitability' :
                         heatmapFilters.metric === 'functionalFit' ? 'Functional Fit' :
                         heatmapFilters.metric === 'region' ? 'Region' :
                         heatmapFilters.metric === 'organization' ? 'Organization' : 'Ownership'}
              </div>
              
              {/* Legend tooltip */}
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                
                {/* Tooltip content */}
                <div className="absolute top-6 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-64">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Color Legend - {heatmapFilters.metric === 'technicalSuitability' ? 'Technical Suitability' :
                                   heatmapFilters.metric === 'functionalFit' ? 'Functional Fit' :
                                   heatmapFilters.metric === 'region' ? 'Region' :
                                   heatmapFilters.metric === 'organization' ? 'Organization' : 'Ownership'}
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {legendData.map(({ value, color }, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${color}`}></div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>
                      </div>
                    ))}
                    
                    {/* No data indicator */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="w-3 h-3 rounded bg-gray-400"></div>
                      <span className="text-xs text-gray-700 dark:text-gray-300">No Data</span>
                    </div>
                  </div>
                  
                  {legendData.length > 8 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      Showing {legendData.length} unique values
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Columnar grid layout */}
      {!selectedITComponent && !selectedInterface && !selectedDataObject && (
        <div key={renderKey} className="grid grid-cols-3 gap-6 auto-rows-min">
          {filteredCapabilities.length === 0 && searchTerm ? (
            <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
              No capabilities found matching "{searchTerm}"
            </div>
          ) : (
            filteredCapabilities.map((capability) => {
          console.log('MetisMap: Rendering capability:', capability.name);
          // Get related applications for heatmap calculation
          const relatedApps = applications.filter(app => {
            if (!app.businessCapabilities) return false;
            const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
            return appCapabilities.some(appCap => 
              capability.name === appCap || 
              capability.name.includes(appCap) || 
              appCap.includes(capability.name) ||
              appCap.includes(capability.hierarchy || '')
            );
          });

          const colors = getHeatmapColor(capability, relatedApps);
          
          // Get children count or applications count based on level
          let itemCount = 0;
          let itemLabel = '';
          let previewItems: string[] = [];
          let hasChildren = false;
          
          if (currentLevel === 1) {
            const l2Children = allCapabilities.filter(cap => 
              cap.level === 2 && cap.level1Capability === capability.name
            );
            itemCount = l2Children.length;
            itemLabel = 'Sub-capabilities';
            previewItems = l2Children.slice(0, 3).map(cap => cap.name);
            hasChildren = l2Children.length > 0;
          } else if (currentLevel === 2) {
            const l3Children = allCapabilities.filter(cap => 
              cap.level === 3 && cap.level1Capability === capability.level1Capability && cap.level2Capability === capability.name
            );
            itemCount = l3Children.length;
            itemLabel = 'Detailed capabilities';
            previewItems = l3Children.slice(0, 3).map(cap => cap.name);
            hasChildren = l3Children.length > 0;
          } else if (currentLevel === 3) {
            itemCount = relatedApps.length;
            itemLabel = 'Applications';
            previewItems = relatedApps.slice(0, 3).map(app => app.name);
            hasChildren = false;
          }
          
          return (
            <div
              key={capability.id}
              className={`relative ${colors.bg} rounded-xl border-2 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group`}
              onClick={(e) => {
                console.log('Card clicked for capability:', capability.name);
                e.preventDefault();
                handleCapabilityClick(capability);
              }}
            >
              {/* Hover tooltip for heatmap information */}
              {heatmapFilters.showColors && heatmapFilters.metric !== 'none' && relatedApps.length > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-64">
                  <div className="font-medium mb-2">
                    {heatmapFilters.metric === 'technicalSuitability' ? 'Technical Suitability' :
                     heatmapFilters.metric === 'functionalFit' ? 'Functional Fit' : 'Metric'}
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {(() => {
                      const metricValues = relatedApps.map(app => {
                        switch (heatmapFilters.metric) {
                          case 'technicalSuitability': return app.technicalSuitability;
                          case 'functionalFit': return app.functionalFit;
                          default: return null;
                        }
                      }).filter((value): value is string => Boolean(value));
                      
                      // Count occurrences
                      const valueCounts = metricValues.reduce((acc, value) => {
                        if (value) {
                          acc[value] = (acc[value] || 0) + 1;
                        }
                        return acc;
                      }, {} as Record<string, number>);
                      
                      const sortedValues = Object.entries(valueCounts)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 6);
                      
                      return sortedValues.map(([value, count], idx) => (
                        <div key={idx} className="text-xs flex justify-between">
                          <span>• {value}</span>
                          <span className="opacity-75">({count})</span>
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="text-xs opacity-75 mt-2 pt-2 border-t border-gray-600">
                    From {relatedApps.length} application{relatedApps.length !== 1 ? 's' : ''}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white group-hover:${colors.color} transition-colors`}>
                    {capability.displayName || capability.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${colors.dot}`}></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCapability(capability);
                      }}
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="View detailed information"
                    >
                      <Expand className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    {hasChildren && (
                      <div className="text-blue-600 dark:text-blue-400 text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                        {/* Visual indicator for expandable capability */}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {itemLabel}: {itemCount}
                  </div>
                  
                  {searchTerm && allMatchingCapabilities && (() => {
                    // Check if this capability is shown because of direct matches
                    const directMatch = Array.isArray(allMatchingCapabilities) && allMatchingCapabilities.some(match => match.id === capability.id);
                    
                    if (directMatch) {
                      // Show search result indicator for direct capability match
                      return (
                        <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          Matches: "{searchTerm}"
                        </div>
                      );
                    } else {
                      // Check if shown because of descendant matches
                      const descendantMatches = Array.isArray(allMatchingCapabilities) ? allMatchingCapabilities.filter(match => {
                        if (currentLevel === 1) {
                          return match.level1Capability === capability.name;
                        } else if (currentLevel === 2) {
                          return match.level2Capability === capability.name;
                        }
                        return false;
                      }) : [];
                      
                      if (descendantMatches.length > 0) {
                        const levelName = currentLevel === 1 ? 'sub-capabilities' : 'detailed capabilities';
                        // Show descendant matches
                        return (
                          <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            Contains {descendantMatches.length} {levelName} with matching capabilities
                          </div>
                        );
                      }
                    }
                    return null;
                  })()}
                  
                  {previewItems.map((item, index) => (
                    <div key={index} className="text-sm text-gray-500 dark:text-gray-500 truncate">
                      • {item}
                    </div>
                  ))}
                  
                  {itemCount > 3 && (
                    <div className="text-sm text-gray-400 dark:text-gray-600">
                      +{itemCount - 3} more...
                    </div>
                  )}

                  {capability.hierarchy && (
                    <div className="text-xs text-gray-400 dark:text-gray-600 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      Path: {capability.hierarchy}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
          )}
        </div>
      )}

      {/* Interface Filtered Applications View */}
      {selectedInterface && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedInterface(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Capabilities
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Applications using interface: {selectedInterface}
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {(() => {
              // Find the interface
              const interfaceObj = interfaces.find(intf => intf.name === selectedInterface);
              if (!interfaceObj) return <div className="text-gray-500 dark:text-gray-400">Interface not found.</div>;

              // Find applications that use this interface
              const applicationsUsingInterface = applications.filter(app => {
                return (interfaceObj.sourceApplication && interfaceObj.sourceApplication.toLowerCase().includes(app.name.toLowerCase())) ||
                       (interfaceObj.targetApplication && interfaceObj.targetApplication.toLowerCase().includes(app.name.toLowerCase()));
              });

              if (applicationsUsingInterface.length === 0) {
                return <div className="text-gray-500 dark:text-gray-400">No applications found using this interface.</div>;
              }

              return applicationsUsingInterface.map((app) => {
                const colors = getDefaultLevelColor(null);
                
                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${colors.bg} ${colors.border}`}
                    onClick={() => setExpandedApplication(app)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${colors.color}`}>
                          {app.displayName || app.name}
                        </h3>
                        {app.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {app.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Show interface relationship */}
                    <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Interface role:</span> 
                      {interfaceObj.sourceApplication?.toLowerCase().includes(app.name.toLowerCase()) && ' Source'}
                      {interfaceObj.targetApplication?.toLowerCase().includes(app.name.toLowerCase()) && ' Target'}
                    </div>

                    {/* Show business capabilities this app supports */}
                    {app.businessCapabilities && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Supports capabilities:</span> {app.businessCapabilities.split(';').slice(0, 3).map(cap => cap.trim().replace(/^~/, '')).join(', ')}
                        {app.businessCapabilities.split(';').length > 3 && ` +${app.businessCapabilities.split(';').length - 3} more`}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Data Object Filtered Applications View */}
      {selectedDataObject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDataObject(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Capabilities
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Applications using data object: {selectedDataObject}
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {(() => {
              // Find the data object
              const dataObj = dataObjects.find(obj => obj.name === selectedDataObject);
              if (!dataObj) return <div className="text-gray-500 dark:text-gray-400">Data object not found.</div>;

              // Find applications that use this data object (check interfaces that reference this data object)
              const relatedInterfaces = interfaces.filter(intf => 
                intf.dataObjects && intf.dataObjects.toLowerCase().includes(dataObj.name.toLowerCase())
              );

              const applicationsUsingDataObject = applications.filter(app => {
                return relatedInterfaces.some(intf =>
                  (intf.sourceApplication && intf.sourceApplication.toLowerCase().includes(app.name.toLowerCase())) ||
                  (intf.targetApplication && intf.targetApplication.toLowerCase().includes(app.name.toLowerCase()))
                );
              });

              if (applicationsUsingDataObject.length === 0) {
                return <div className="text-gray-500 dark:text-gray-400">No applications found using this data object.</div>;
              }

              return applicationsUsingDataObject.map((app) => {
                const colors = getDefaultLevelColor(null);
                
                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${colors.bg} ${colors.border}`}
                    onClick={() => setExpandedApplication(app)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${colors.color}`}>
                          {app.displayName || app.name}
                        </h3>
                        {app.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {app.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Show related interfaces */}
                    {(() => {
                      const appInterfaces = relatedInterfaces.filter(intf =>
                        (intf.sourceApplication && intf.sourceApplication.toLowerCase().includes(app.name.toLowerCase())) ||
                        (intf.targetApplication && intf.targetApplication.toLowerCase().includes(app.name.toLowerCase()))
                      );
                      
                      if (appInterfaces.length > 0) {
                        return (
                          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Related interfaces:</span> {appInterfaces.slice(0, 2).map(intf => intf.name).join(', ')}
                            {appInterfaces.length > 2 && ` +${appInterfaces.length - 2} more`}
                          </div>
                        );
                      }
                    })()}

                    {/* Show business capabilities this app supports */}
                    {app.businessCapabilities && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Supports capabilities:</span> {app.businessCapabilities.split(';').slice(0, 3).map(cap => cap.trim().replace(/^~/, '')).join(', ')}
                        {app.businessCapabilities.split(';').length > 3 && ` +${app.businessCapabilities.split(';').length - 3} more`}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Initiative Filtered Applications View */}
      {selectedInitiative && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedInitiative(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Capabilities
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Applications related to initiative: {selectedInitiative}
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {(() => {
              // Find the initiative
              const initiative = initiatives.find(init => init.name === selectedInitiative);
              if (!initiative) return <div className="text-gray-500 dark:text-gray-400">Initiative not found.</div>;

              // Find applications related to this initiative through business capabilities
              const relatedCapabilities = allCapabilities.filter(cap => 
                cap.name.toLowerCase().includes(initiative.name.toLowerCase()) ||
                initiative.name.toLowerCase().includes(cap.name.toLowerCase()) ||
                (cap.hierarchy && initiative.name.toLowerCase().includes(cap.hierarchy.toLowerCase())) ||
                (initiative.description && cap.name.toLowerCase().includes(initiative.description.toLowerCase()))
              );

              const applicationsRelatedToInitiative = applications.filter(app => {
                if (!app.businessCapabilities) return false;
                const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
                return relatedCapabilities.some(cap => 
                  appCapabilities.some(appCap => 
                    cap.name === appCap || 
                    cap.name.includes(appCap) || 
                    appCap.includes(cap.name) ||
                    appCap.includes(cap.hierarchy || '')
                  )
                );
              });

              if (applicationsRelatedToInitiative.length === 0) {
                return <div className="text-gray-500 dark:text-gray-400">No applications found related to this initiative.</div>;
              }

              return applicationsRelatedToInitiative.map((app) => {
                const colors = getDefaultLevelColor(null);
                
                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${colors.bg} ${colors.border}`}
                    onClick={() => setExpandedApplication(app)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${colors.color}`}>
                          {app.displayName || app.name}
                        </h3>
                        {app.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {app.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Show business capabilities this app supports */}
                    {app.businessCapabilities && (
                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Supports capabilities:</span> {app.businessCapabilities.split(';').slice(0, 3).map(cap => cap.trim().replace(/^~/, '')).join(', ')}
                        {app.businessCapabilities.split(';').length > 3 && ` +${app.businessCapabilities.split(';').length - 3} more`}
                      </div>
                    )}

                    {/* Show related capabilities */}
                    {(() => {
                      const appCapabilities = app.businessCapabilities ? app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, '')) : [];
                      const matchingCaps = relatedCapabilities.filter(cap => 
                        appCapabilities.some(appCap => 
                          cap.name === appCap || 
                          cap.name.includes(appCap) || 
                          appCap.includes(cap.name)
                        )
                      );
                      
                      if (matchingCaps.length > 0) {
                        return (
                          <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                            <span className="font-medium">Related to initiative via:</span> {matchingCaps.slice(0, 2).map(cap => cap.name).join(', ')}
                            {matchingCaps.length > 2 && ` +${matchingCaps.length - 2} more capabilities`}
                          </div>
                        );
                      }
                    })()}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {filteredCapabilities.length === 0 && !selectedITComponent && !selectedInterface && !selectedDataObject && !selectedInitiative && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600">
            {searchTerm ? `No capabilities found matching "${searchTerm}"` : 'No capabilities available at this level'}
          </div>
        </div>
      )}

      {/* IT Component Filtered Applications View */}
      {selectedITComponent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedITComponent(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Capabilities
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Applications using: {selectedITComponent}
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {(() => {
              // Find the IT component
              const component = itComponents.find(comp => comp.name === selectedITComponent);
              if (!component) return <div className="text-gray-500 dark:text-gray-400">IT component not found.</div>;

              // Find applications that use this component
              const applicationsUsingComponent = applications.filter(app => {
                return component.applications && component.applications.toLowerCase().includes(app.name.toLowerCase());
              });

              if (applicationsUsingComponent.length === 0) {
                return <div className="text-gray-500 dark:text-gray-400">No applications found using this IT component.</div>;
              }

              return applicationsUsingComponent.map((app) => {
                // Use default application styling for IT component filtered view
                const colors = getDefaultLevelColor(null);
                
                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${colors.bg} ${colors.border}`}
                    onClick={() => setExpandedApplication(app)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${colors.color}`}>
                          {app.displayName || app.name}
                        </h3>
                        {app.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {app.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Show business capabilities this app supports */}
                    {app.businessCapabilities && (
                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Supports capabilities:</span> {app.businessCapabilities.split(';').slice(0, 3).map(cap => cap.trim().replace(/^~/, '')).join(', ')}
                        {app.businessCapabilities.split(';').length > 3 && ` +${app.businessCapabilities.split(';').length - 3} more`}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Capability Detail Modal */}
      {expandedCapability && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {expandedCapability.displayName || expandedCapability.name}
              </h2>
              <button
                onClick={() => setExpandedCapability(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                    <p className="text-gray-900 dark:text-white">{expandedCapability.name}</p>
                  </div>
                  {expandedCapability.displayName && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Display Name:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.displayName}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Level:</span>
                    <p className="text-gray-900 dark:text-white">{expandedCapability.level}</p>
                  </div>
                  {expandedCapability.hierarchy && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Hierarchy:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.hierarchy}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Level Mappings */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Level Mappings</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {expandedCapability.level1Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Level 1 Capability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.level1Capability}</p>
                    </div>
                  )}
                  {expandedCapability.level2Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Level 2 Capability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.level2Capability}</p>
                    </div>
                  )}
                  {expandedCapability.level3Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Level 3 Capability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.level3Capability}</p>
                    </div>
                  )}
                  {expandedCapability.mappedLevel1Capability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Mapped Level 1:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.mappedLevel1Capability}</p>
                    </div>
                  )}
                  {expandedCapability.mappedToLifesciencesCapabilities && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Mapped to Life Sciences:</span>
                      <p className="text-gray-900 dark:text-white">{expandedCapability.mappedToLifesciencesCapabilities}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Applications */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Applications</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const relatedApps = applications.filter(app => {
                      if (!app.businessCapabilities) return false;
                      const appCapabilities = app.businessCapabilities.split(';').map(c => c.trim().replace(/^~/, ''));
                      return appCapabilities.some(appCap => 
                        expandedCapability.name === appCap || 
                        expandedCapability.name.includes(appCap) || 
                        appCap.includes(expandedCapability.name) ||
                        appCap.includes(expandedCapability.hierarchy || '')
                      );
                    });

                    if (relatedApps.length === 0) {
                      return <p className="text-gray-500 dark:text-gray-400">No applications found for this capability.</p>;
                    }

                    return relatedApps.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => setExpandedApplication(app)}
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{app.displayName || app.name}</p>
                          {app.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{app.description}</p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {expandedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {expandedApplication.displayName || expandedApplication.name}
              </h2>
              <button
                onClick={() => setExpandedApplication(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                    <p className="text-gray-900 dark:text-white">{expandedApplication.name}</p>
                  </div>
                  {expandedApplication.displayName && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Display Name:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.displayName}</p>
                    </div>
                  )}
                  {expandedApplication.description && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Description:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.description}</p>
                    </div>
                  )}
                  {expandedApplication.vendor && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Vendor:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.vendor}</p>
                    </div>
                  )}
                  {expandedApplication.businessDomain && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Business Domain:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.businessDomain}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical & Operational Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Technical & Operational</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {expandedApplication.technicalSuitability && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Technical Suitability:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.technicalSuitability}</p>
                    </div>
                  )}
                  {expandedApplication.functionalFit && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Functional Fit:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.functionalFit}</p>
                    </div>
                  )}
                  {expandedApplication.technicalFit && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Technical Fit:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.technicalFit}</p>
                    </div>
                  )}
                  {expandedApplication.serviceLevel && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Service Level:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.serviceLevel}</p>
                    </div>
                  )}
                  {expandedApplication.maturityStatus && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Maturity Status:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.maturityStatus}</p>
                    </div>
                  )}
                  {expandedApplication.obsolescenceRiskStatus && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Obsolescence Risk:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.obsolescenceRiskStatus}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Business Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {expandedApplication.ownedBy && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Owned By:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.ownedBy}</p>
                    </div>
                  )}
                  {expandedApplication.owningFunction && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Owning Function:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.owningFunction}</p>
                    </div>
                  )}
                  {expandedApplication.businessUnit && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Business Unit:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.businessUnit}</p>
                    </div>
                  )}
                  {expandedApplication.organizations && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Organizations:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.organizations}</p>
                    </div>
                  )}
                  {expandedApplication.region && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Region:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.region}</p>
                    </div>
                  )}
                  {expandedApplication.mainArea && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Main Area:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.mainArea}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lifecycle & Cost Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Lifecycle & Cost</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {expandedApplication.activeFrom && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Active From:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.activeFrom}</p>
                    </div>
                  )}
                  {expandedApplication.activeUntil && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Active Until:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.activeUntil}</p>
                    </div>
                  )}
                  {expandedApplication.costTotalAnnual && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Annual Cost:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.costTotalAnnual}</p>
                    </div>
                  )}
                  {expandedApplication.pace && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Pace:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.pace}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Components */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Components</h3>
                <div className="grid grid-cols-1 gap-3">
                  {expandedApplication.itComponentDisplayName && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">IT Component:</span>
                      <p className="text-gray-900 dark:text-white">{expandedApplication.itComponentDisplayName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Data Objects */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Data Objects</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const relatedDataObjects = dataObjects.filter(dataObj => 
                      dataObj.relDataObjectToApplication?.includes(expandedApplication.name)
                    );

                    if (relatedDataObjects.length === 0) {
                      return <p className="text-gray-500 dark:text-gray-400">No data objects found for this application.</p>;
                    }

                    return relatedDataObjects.map((dataObj) => (
                      <div key={dataObj.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{dataObj.displayName || dataObj.name}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Related Interfaces */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Related Interfaces</h3>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const relatedInterfaces = interfaces.filter(intf => 
                      intf.sourceApplication === expandedApplication.name || 
                      intf.targetApplication === expandedApplication.name
                    );

                    if (relatedInterfaces.length === 0) {
                      return <p className="text-gray-500 dark:text-gray-400">No interfaces found for this application.</p>;
                    }

                    return relatedInterfaces.map((intf) => (
                      <div key={intf.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">{intf.name}</p>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {intf.sourceApplication === expandedApplication.name ? 'Source' : 'Target'}
                          </span>
                        </div>
                        {intf.dataFlow && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{intf.dataFlow}</p>
                        )}
                        {intf.frequency && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">Frequency: {intf.frequency}</p>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Business Capabilities */}
              {expandedApplication.businessCapabilities && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Business Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {expandedApplication.businessCapabilities.split(';').map((cap, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {cap.trim().replace(/^~/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {expandedApplication.obsolescenceRiskComment && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Risk Comments</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    {expandedApplication.obsolescenceRiskComment}
                  </p>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {expandedApplication.cmdbApplicationServiceUrl && (
                  <a
                    href={expandedApplication.cmdbApplicationServiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    CMDB Application Service
                  </a>
                )}
                {expandedApplication.cmdbBusinessApplicationUrl && (
                  <a
                    href={expandedApplication.cmdbBusinessApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    CMDB Business Application
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Summary Modal */}
      <ExportSummaryModal
        isOpen={showExportSummary}
        onClose={() => setShowExportSummary(false)}
        exportData={exportSummaryData}
      />
    </div>
  );
}