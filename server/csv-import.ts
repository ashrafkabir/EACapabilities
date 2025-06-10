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
    const data = await parseCSV('BusinessCapabilities_mapping_1749518164788.csv');
    console.log(`Processing ${data.length} business capabilities...`);

    // Clear existing capabilities to rebuild hierarchy
    await db.delete(businessCapabilities);

    // Map to track created capabilities by their full path
    const capabilityMap = new Map<string, string>(); // path -> id
    
    for (const row of data) {
      if (!row['Business Capability in LeanIX']) continue;

      const hierarchy = row['Hierarchy'] || '';
      if (!hierarchy) continue;

      const mappedL1 = row['Mapped  Level 1 Capability'] || '';
      if (!mappedL1) continue;

      // First ensure Level 1 capability exists
      if (!capabilityMap.has(mappedL1)) {
        const level1Capability = {
          name: mappedL1,
          displayName: mappedL1,
          hierarchy: mappedL1,
          parentId: null,
          level: 1,
          mappedLevel1Capability: mappedL1,
          mappedToLifesciencesCapabilities: '',
        };
        const [inserted] = await db.insert(businessCapabilities).values(level1Capability).returning({ id: businessCapabilities.id });
        capabilityMap.set(mappedL1, inserted.id);
      }

      // Split hierarchy into levels: "Human Resources / Benefits / Benefits Management"
      const levels = hierarchy.split(' / ').map(level => level.trim());
      
      // Create Level 2+ capabilities under the mapped Level 1
      let parentId = capabilityMap.get(mappedL1)!;
      let currentPath = mappedL1;

      for (let i = 0; i < levels.length; i++) {
        const levelName = levels[i];
        currentPath = `${mappedL1} / ${levels.slice(0, i + 1).join(' / ')}`;
        
        // Check if this capability already exists
        if (!capabilityMap.has(currentPath)) {
          const capability = {
            name: levelName,
            displayName: levelName,
            hierarchy: levels.slice(0, i + 1).join(' / '),
            parentId: parentId,
            level: i + 2, // Level 2+ since Level 1 is the mapped capability
            mappedLevel1Capability: mappedL1,
            mappedToLifesciencesCapabilities: i === levels.length - 1 ? (row['mapped to Lifesciences Capabilities Level 3'] || '') : '',
          };

          const [inserted] = await db.insert(businessCapabilities).values(capability).returning({ id: businessCapabilities.id });
          capabilityMap.set(currentPath, inserted.id);
          parentId = inserted.id;
        } else {
          // Use existing capability as parent for next level
          parentId = capabilityMap.get(currentPath)!;
        }
      }
    }

    console.log(`Business capabilities imported successfully - created ${capabilityMap.size} capabilities`);
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
