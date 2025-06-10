import fs from 'fs';
import path from 'path';
import { db } from './db';
import { businessCapabilities, applications, dataObjects, interfaces, initiatives, itComponents } from '@shared/schema';

export async function importCSVData() {
  try {
    console.log('Starting CSV import process...');
    
    // Import Business Capabilities
    await importBusinessCapabilities();
    
    // Import Applications
    await importApplications();
    
    // Import Data Objects
    await importDataObjects();
    
    // Import Interfaces
    await importInterfaces();
    
    // Import Initiatives
    await importInitiatives();
    
    // Import IT Components
    await importITComponents();
    
    console.log('CSV import completed successfully');
  } catch (error) {
    console.error('Error during CSV import:', error);
    throw error;
  }
}

async function parseCSV(filePath: string): Promise<any[]> {
  const fullPath = path.join(process.cwd(), 'attached_assets', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`CSV file not found: ${fullPath}`);
    return [];
  }

  const csvContent = fs.readFileSync(fullPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    console.warn(`CSV file has insufficient data: ${filePath}`);
    return [];
  }

  // Clean BOM from first line if present
  if (lines[0].charCodeAt(0) === 0xFEFF) {
    lines[0] = lines[0].substring(1);
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"/, '').replace(/"$/, '').replace(/﻿/, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length > 0 && values[0]) { // Only process non-empty rows
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim().replace(/^"/, '').replace(/"$/, '') || '';
      });
      data.push(row);
    }
  }

  return data;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

async function importBusinessCapabilities() {
  try {
    const mappingData = await parseCSV('BusinessCapabilities_mapping_1749518164788.csv');
    console.log(`Processing ${mappingData.length} business capability mappings...`);

    // Clear existing capabilities to rebuild hierarchy
    await db.delete(businessCapabilities);

    // Create a mapping from hierarchy paths to L1-L3 structure
    const hierarchyToLevelMap = new Map<string, {
      level1: string,
      level2?: string,
      level3?: string,
      mappedL1: string
    }>();

    // Process mapping data to build hierarchy map
    for (const row of mappingData) {
      const hierarchy = row['Hierarchy'] || '';
      const mappedL1 = row['Mapped  Level 1 Capability'] || '';
      if (!hierarchy || !mappedL1) continue;

      const levels = hierarchy.split(' / ').map((level: any) => level.trim());
      hierarchyToLevelMap.set(hierarchy, {
        level1: mappedL1,
        level2: levels.length > 0 ? levels[0] : undefined,
        level3: levels.length > 1 ? levels[1] : undefined,
        mappedL1: mappedL1
      });
    }

    // Get all unique capability hierarchies from Applications data
    const applicationsData = await parseCSV('Applications_1749518164788.csv');
    const allCapabilityPaths = new Set<string>();
    
    for (const app of applicationsData) {
      const businessCaps = app['relApplicationToBusinessCapability'] || app['Business Capabilities'] || '';
      if (businessCaps) {
        // Split by semicolon and process each capability path
        const capPaths = businessCaps.split(';').map((path: any) => path.trim().replace(/^~/, ''));
        capPaths.forEach((path: any) => {
          if (path) allCapabilityPaths.add(path);
        });
      }
    }

    console.log(`Found ${allCapabilityPaths.size} unique capability paths from applications`);
    console.log('Sample paths:', Array.from(allCapabilityPaths).slice(0, 5));

    // Create L1 capabilities based on mapped values
    const l1Capabilities = new Set<string>();
    hierarchyToLevelMap.forEach(mapping => l1Capabilities.add(mapping.level1));
    
    const capabilityIdMap = new Map<string, string>();
    
    // Create Level 1 capabilities
    for (const l1Name of Array.from(l1Capabilities)) {
      const l1Cap = {
        name: l1Name,
        displayName: l1Name,
        hierarchy: l1Name,
        parentId: null,
        level: 1,
        level1Capability: l1Name,
        level2Capability: null,
        level3Capability: null,
        mappedLevel1Capability: l1Name,
        mappedToLifesciencesCapabilities: '',
      };
      const [inserted] = await db.insert(businessCapabilities).values(l1Cap).returning({ id: businessCapabilities.id });
      capabilityIdMap.set(l1Name, inserted.id);
    }

    // Process all capability paths found in applications
    for (const capPath of Array.from(allCapabilityPaths)) {
      // Find matching mapping or create based on structure
      let mapping = hierarchyToLevelMap.get(capPath);
      
      if (!mapping) {
        // Try to find partial matches or create mapping based on path structure
        const pathLevels = capPath.split(' / ').map((level: any) => level.trim());
        
        // Look for existing mappings that start with the same path
        for (const [mappedPath, mappedData] of Array.from(hierarchyToLevelMap.entries())) {
          if (mappedPath.startsWith(pathLevels[0]) || capPath.includes(mappedPath)) {
            mapping = {
              level1: mappedData.level1,
              level2: pathLevels[0],
              level3: pathLevels.length > 1 ? pathLevels[1] : undefined,
              mappedL1: mappedData.level1
            };
            break;
          }
        }
        
        // If no mapping found, use first level as L1 (fallback)
        if (!mapping) {
          mapping = {
            level1: pathLevels[0],
            level2: pathLevels.length > 1 ? pathLevels[1] : undefined,
            level3: pathLevels.length > 2 ? pathLevels[2] : undefined,
            mappedL1: pathLevels[0]
          };
        }
      }

      // Create L2 capability if needed
      if (mapping.level2) {
        const l2Key = `${mapping.level1}::${mapping.level2}`;
        if (!capabilityIdMap.has(l2Key)) {
          const l1ParentId = capabilityIdMap.get(mapping.level1);
          if (l1ParentId) {
            const l2Cap = {
              name: mapping.level2,
              displayName: mapping.level2,
              hierarchy: mapping.level2,
              parentId: l1ParentId,
              level: 2,
              level1Capability: mapping.level1,
              level2Capability: mapping.level2,
              level3Capability: null,
              mappedLevel1Capability: mapping.level1,
              mappedToLifesciencesCapabilities: '',
            };
            const [inserted] = await db.insert(businessCapabilities).values(l2Cap).returning({ id: businessCapabilities.id });
            capabilityIdMap.set(l2Key, inserted.id);
          }
        }

        // Create L3 capability if needed
        if (mapping.level3) {
          const l3Key = `${mapping.level1}::${mapping.level2}::${mapping.level3}`;
          if (!capabilityIdMap.has(l3Key)) {
            const l2ParentId = capabilityIdMap.get(l2Key);
            if (l2ParentId) {
              const l3Cap = {
                name: mapping.level3,
                displayName: mapping.level3,
                hierarchy: `${mapping.level2} / ${mapping.level3}`,
                parentId: l2ParentId,
                level: 3,
                level1Capability: mapping.level1,
                level2Capability: mapping.level2,
                level3Capability: mapping.level3,
                mappedLevel1Capability: mapping.level1,
                mappedToLifesciencesCapabilities: '',
              };
              const [inserted] = await db.insert(businessCapabilities).values(l3Cap).returning({ id: businessCapabilities.id });
              capabilityIdMap.set(l3Key, inserted.id);
            }
          }
        }
      }
    }

    console.log(`Business capabilities imported successfully - created ${capabilityIdMap.size} capabilities`);
    console.log(`Level 1 capabilities: ${l1Capabilities.size}`);
  } catch (error) {
    console.error('Error importing business capabilities:', error);
  }
}

async function importApplications() {
  try {
    const data = await parseCSV('Applications_1749518164788.csv');
    console.log(`Processing ${data.length} applications...`);

    for (const row of data) {
      // Skip header rows
      if (!row['name'] || row['name'] === 'Name' || row['type'] === 'Type') continue;

      const application = {
        name: row['name'] || '',
        displayName: row['displayName'] || row['name'] || '',
        businessCapabilities: row['relApplicationToBusinessCapability'] || '',
        itComponentDisplayName: row['relApplicationToITComponent:displayName'] || '',
        activeFrom: row['relApplicationToITComponent:activeFrom'] || '',
        activeUntil: row['relApplicationToITComponent:activeUntil'] || '',
        costTotalAnnual: row['relApplicationToITComponent:costTotalAnnual'] || '',
        description: row['relApplicationToITComponent:description'] || '',
        obsolescenceRiskComment: row['relApplicationToITComponent:obsolescenceRiskComment'] || '',
        obsolescenceRiskStatus: row['relApplicationToITComponent:obsolescenceRiskStatus'] || '',
        serviceLevel: row['relApplicationToITComponent:serviceLevel'] || '',
        technicalSuitability: row['relApplicationToITComponent:technicalSuitability'] || row['technicalSuitability'] || '',
        gdItTeams: row['tags:GD IT Teams'] || '',
        ownedBy: row['tags:Owned By'] || '',
        owningFunction: row['tags:Owning Function'] || '',
        businessDomain: row['tags:Business Domain'] || '',
        maturityStatus: row['tags:Maturity Status'] || row['maturityStatus'] || '',
        mainArea: row['tags:Main Area'] || '',
        pace: row['tags:PACE'] || '',
        businessUnit: row['tags:Business Unit'] || '',
        vendor: row['tags:Vendor'] || '',
        lxPsWip: row['tags:LX PS WiP'] || '',
        region: row['tags:Region'] || '',
        otherTags: row['tags:Other tags'] || '',
        organizations: row['relApplicationToUserGroup'] || '',
        cmdbApplicationServiceUrl: row['CMDB_SYS_ID'] || '',
        cmdbBusinessApplicationUrl: row['cmdbBizAppUrl'] || '',
        functionalFit: row['functionalSuitability'] || '',
        technicalFit: row['technicalSuitability'] || '',
      };

      await db.insert(applications).values(application).onConflictDoNothing();
    }

    console.log('Applications imported successfully');
  } catch (error) {
    console.error('Error importing applications:', error);
  }
}

async function importDataObjects() {
  try {
    const data = await parseCSV('DataObjects_1749518164787.csv');
    console.log(`Processing ${data.length} data objects...`);

    for (const row of data) {
      if (!row['Name'] || row['Name'] === 'Name') continue;

      const dataObject = {
        name: row['Name'] || '',
        displayName: row['Display Name'] || row['Name'] || '',
        relDataObjectToInterface: row['Interfaces'] || '',
        relDataObjectToProject: row['Initiatives'] || '',
        tagsGdItTeams: row['GD IT Teams'] || '',
        tagsOwnedBy: row['Owned By'] || '',
        tagsOwningFunction: row['Owning Function'] || '',
        tagsBusinessDomain: row['Business Domain'] || '',
        tagsMainArea: row['Main Area'] || '',
        tagsBusinessUnit: row['Business Unit'] || '',
        tagsLxPsWip: row['LX PS WiP'] || '',
        tagsRegion: row['Region'] || '',
        tagsOtherTags: row['Other tags'] || '',
        relDataObjectToApplication: row['Applications'] || '',
        relToChild: row['Children'] || '',
      };

      await db.insert(dataObjects).values(dataObject).onConflictDoNothing();
    }

    console.log('Data objects imported successfully');
  } catch (error) {
    console.error('Error importing data objects:', error);
  }
}

async function importInterfaces() {
  try {
    const data = await parseCSV('Interfaces_1749518164787.csv');
    console.log(`Processing ${data.length} interfaces...`);

    for (const row of data) {
      if (!row['Name'] || row['Name'] === 'Name') continue;

      const interfaceObj = {
        name: row['Name'] || '',
        sourceApplication: row['Name']?.split(' to ')[0] || '',
        targetApplication: row['Name']?.split(' to ')[1] || '',
        dataFlow: row['Data Flow Direction'] || '',
        frequency: row['Frequency'] || '',
        dataObjects: row['Data Objects'] || '',
        status: 'active',
      };

      await db.insert(interfaces).values(interfaceObj).onConflictDoNothing();
    }

    console.log('Interfaces imported successfully');
  } catch (error) {
    console.error('Error importing interfaces:', error);
  }
}

async function importInitiatives() {
  try {
    const data = await parseCSV('Initiatives_1749518164787.csv');
    console.log(`Processing ${data.length} initiatives...`);

    for (const row of data) {
      if (!row['Name'] || row['Name'] === 'Name') continue;

      const initiative = {
        name: row['Name'] || '',
        description: row['Display Name'] || '',
        status: row['Project Phase'] || 'active',
        startDate: '',
        endDate: '',
        businessCapabilities: row['Business Capabilities'] || '',
        applications: row['Applications'] || '',
      };

      await db.insert(initiatives).values(initiative).onConflictDoNothing();
    }

    console.log('Initiatives imported successfully');
  } catch (error) {
    console.error('Error importing initiatives:', error);
  }
}

async function importITComponents() {
  try {
    const data = await parseCSV('ITComponents_1749518164787.csv');
    console.log(`Processing ${data.length} IT components...`);

    for (const row of data) {
      if (!row['Name'] || row['Name'] === 'Name') continue;

      const component = {
        name: row['Name'] || '',
        displayName: row['Display Name'] || row['Name'] || '',
        category: row['Tech Categories'] || '',
        vendor: row['Providers'] || '',
        version: '',
        status: 'active',
        applications: row['Applications'] || '',
      };

      await db.insert(itComponents).values(component).onConflictDoNothing();
    }

    console.log('IT components imported successfully');
  } catch (error) {
    console.error('Error importing IT components:', error);
  }
}
