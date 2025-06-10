import { db } from './db';
import { 
  businessCapabilities, 
  applications, 
  dataObjects, 
  interfaces, 
  initiatives, 
  itComponents 
} from '@shared/schema';
import fs from 'fs';

export async function enhancedImportCSVData() {
  console.log('Starting enhanced CSV data import...');
  
  try {
    // Clear existing data
    await db.delete(applications);
    await db.delete(businessCapabilities);
    await db.delete(dataObjects);
    await db.delete(interfaces);
    await db.delete(initiatives);
    await db.delete(itComponents);
    console.log('Existing data cleared');

    // Import in order to handle dependencies
    await importBusinessCapabilities();
    await importApplications();
    await importDataObjects();
    await importInterfaces();
    await importInitiatives();
    await importITComponents();
    
    console.log('All enhanced CSV data imported successfully!');
  } catch (error) {
    console.error('Error during enhanced CSV import:', error);
    throw error;
  }
}

async function parseCSV(filePath: string): Promise<any[]> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record: any = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    records.push(record);
  }
  
  return records;
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
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

async function importBusinessCapabilities() {
  try {
    const filePath = './attached_assets/BusinessCapabilities_mapping_1749518164788.csv';
    const records = await parseCSV(filePath);
    
    console.log(`Processing ${records.length} business capability mappings...`);
    
    const capabilityIdMap = new Map<string, string>();
    
    for (const mapping of records) {
      if (!mapping.L1 || mapping.L1 === 'L1') continue;
      
      // Create L1 capability if needed
      if (!capabilityIdMap.has(mapping.L1)) {
        const l1Cap = {
          name: mapping.L1,
          displayName: mapping.L1,
          hierarchy: mapping.L1,
          parentId: null,
          level: 1,
          level1Capability: mapping.L1,
          level2Capability: null,
          level3Capability: null,
          mappedLevel1Capability: mapping.L1,
          mappedToLifesciencesCapabilities: '',
        };
        const [inserted] = await db.insert(businessCapabilities).values(l1Cap).returning({ id: businessCapabilities.id });
        capabilityIdMap.set(mapping.L1, inserted.id);
      }

      // Create L2 capability if needed
      if (mapping.L2) {
        const l2Key = `${mapping.L1}::${mapping.L2}`;
        if (!capabilityIdMap.has(l2Key)) {
          const l1ParentId = capabilityIdMap.get(mapping.L1);
          if (l1ParentId) {
            const l2Cap = {
              name: mapping.L2,
              displayName: mapping.L2,
              hierarchy: mapping.L2,
              parentId: l1ParentId,
              level: 2,
              level1Capability: mapping.L1,
              level2Capability: mapping.L2,
              level3Capability: null,
              mappedLevel1Capability: mapping.L1,
              mappedToLifesciencesCapabilities: '',
            };
            const [inserted] = await db.insert(businessCapabilities).values(l2Cap).returning({ id: businessCapabilities.id });
            capabilityIdMap.set(l2Key, inserted.id);
          }
        }

        // Create L3 capability if needed
        if (mapping.L3) {
          const l3Key = `${mapping.L1}::${mapping.L2}::${mapping.L3}`;
          if (!capabilityIdMap.has(l3Key)) {
            const l2ParentId = capabilityIdMap.get(l2Key);
            if (l2ParentId) {
              const l3Cap = {
                name: mapping.L3,
                displayName: mapping.L3,
                hierarchy: `${mapping.L2} / ${mapping.L3}`,
                parentId: l2ParentId,
                level: 3,
                level1Capability: mapping.L1,
                level2Capability: mapping.L2,
                level3Capability: mapping.L3,
                mappedLevel1Capability: mapping.L1,
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
  } catch (error) {
    console.error('Error importing business capabilities:', error);
  }
}

async function importApplications() {
  try {
    const filePath = './attached_assets/Applications_1749518164788.csv';
    const records = await parseCSV(filePath);
    
    // Skip header rows (first 2 rows are headers)
    const dataRows = records.slice(2);
    console.log(`Processing ${dataRows.length} applications...`);
    let imported = 0;

    for (const record of dataRows) {
      if (!record.id || !record.name) continue;

      const application = {
        name: record.name || '',
        displayName: record.displayName || null,
        description: record.description || null,
        vendor: record.vendor || null,
        businessDomain: record.businessDomain || null,
        technicalSuitability: record.technicalSuitability || null,
        functionalFit: record.functionalFit || null,
        technicalFit: record.technicalFit || null,
        serviceLevel: record.serviceLevel || null,
        maturityStatus: record.maturityStatus || null,
        obsolescenceRiskStatus: record.obsolescenceRiskStatus || null,
        obsolescenceRiskComment: record.obsolescenceRiskComment || null,
        ownedBy: record.ownedBy || null,
        owningFunction: record.owningFunction || null,
        businessUnit: record.businessUnit || null,
        organizations: record.organizations || null,
        region: record.region || null,
        mainArea: record.mainArea || null,
        activeFrom: record.activeFrom || null,
        activeUntil: record.activeUntil || null,
        costTotalAnnual: record.costTotalAnnual || null,
        pace: record.pace || null,
        itComponentDisplayName: record.itComponentDisplayName || null,
        businessCapabilities: record.businessCapabilities || null,
        cmdbApplicationServiceUrl: record.cmdbApplicationServiceUrl || null,
        cmdbBusinessApplicationUrl: record.cmdbBusinessApplicationUrl || null,
      };

      await db.insert(applications).values(application).onConflictDoNothing();
      imported++;
    }

    console.log(`Applications imported successfully - ${imported} records`);
  } catch (error) {
    console.error('Error importing applications:', error);
  }
}

async function importDataObjects() {
  try {
    const filePath = './attached_assets/DataObjects_1749518164787.csv';
    const records = await parseCSV(filePath);
    
    // Skip header rows (first 2 rows are headers)
    const dataRows = records.slice(2);
    console.log(`Processing ${dataRows.length} data objects...`);
    let imported = 0;

    for (const record of dataRows) {
      if (!record.id || !record.name) continue;

      const dataObject = {
        name: record.name || '',
        displayName: record.displayName || null,
        relDataObjectToInterface: record.relDataObjectToInterface || null,
        relDataObjectToProject: record.relDataObjectToProject || null,
        tagsGdItTeams: record['tags:GD IT Teams'] || null,
        tagsOwnedBy: record['tags:Owned By'] || null,
        tagsOwningFunction: record['tags:Owning Function'] || null,
        tagsBusinessDomain: record['tags:Business Domain'] || null,
        tagsMainArea: record['tags:Main Area'] || null,
        tagsBusinessUnit: record['tags:Business Unit'] || null,
        tagsLxPsWip: record['tags:LX PS WiP'] || null,
        tagsRegion: record['tags:Region'] || null,
        tagsOtherTags: record['tags:Other tags'] || null,
        relDataObjectToApplication: record.relDataObjectToApplication || null,
        relToChild: record.relToChild || null,
      };

      await db.insert(dataObjects).values(dataObject).onConflictDoNothing();
      imported++;
    }

    console.log(`Data objects imported successfully - ${imported} records`);
  } catch (error) {
    console.error('Error importing data objects:', error);
  }
}

async function importInterfaces() {
  try {
    const filePath = './attached_assets/Interfaces_1749518164787.csv';
    const records = await parseCSV(filePath);
    
    // Skip header rows (first 2 rows are headers)
    const dataRows = records.slice(2);
    console.log(`Processing ${dataRows.length} interfaces...`);
    let imported = 0;

    for (const record of dataRows) {
      if (!record.id || !record.name) continue;

      // Extract source application from interface name (e.g., "A2 to APS" -> "A2")
      const sourceApp = record.name.split(' to ')[0] || '';
      
      const interface_ = {
        name: record.name || '',
        sourceApplication: sourceApp,
        targetApplication: record.relInterfaceToConsumerApplication || '',
        dataFlow: record.dataFlowDirection || '',
        frequency: record.frequency || '',
        dataObjects: record.relInterfaceToDataObject || '',
        status: 'active',
      };

      await db.insert(interfaces).values(interface_).onConflictDoNothing();
      imported++;
    }

    console.log(`Interfaces imported successfully - ${imported} records`);
  } catch (error) {
    console.error('Error importing interfaces:', error);
  }
}

async function importInitiatives() {
  try {
    const filePath = './attached_assets/Initiatives_1749518164787.csv';
    const records = await parseCSV(filePath);
    
    // Skip header rows (first 2 rows are headers)
    const dataRows = records.slice(2);
    console.log(`Processing ${dataRows.length} initiatives...`);
    let imported = 0;

    for (const record of dataRows) {
      if (!record.id || !record.name) continue;

      const initiative = {
        name: record.name || '',
        description: record.displayName || null,
        status: record['tags:Project Phase'] || 'active',
        startDate: null,
        endDate: null,
        businessCapabilities: record.relProjectToBusinessCapability || null,
        applications: record.relProjectToApplication || null,
      };

      await db.insert(initiatives).values(initiative).onConflictDoNothing();
      imported++;
    }

    console.log(`Initiatives imported successfully - ${imported} records`);
  } catch (error) {
    console.error('Error importing initiatives:', error);
  }
}

async function importITComponents() {
  try {
    const filePath = './attached_assets/ITComponents_1749518164787.csv';
    const records = await parseCSV(filePath);
    
    // Skip header rows (first 2 rows are headers)
    const dataRows = records.slice(2);
    console.log(`Processing ${dataRows.length} IT components...`);
    let imported = 0;

    for (const record of dataRows) {
      if (!record.id || !record.name) continue;

      const component = {
        name: record.name || '',
        displayName: record.displayName || record.name || '',
        category: record.relITComponentToTechnologyStack || '',
        vendor: record.relITComponentToProvider || '',
        version: '',
        status: 'active',
        applications: record.relITComponentToApplication || '',
      };

      await db.insert(itComponents).values(component).onConflictDoNothing();
      imported++;
    }

    console.log(`IT components imported successfully - ${imported} records`);
  } catch (error) {
    console.error('Error importing IT components:', error);
  }
}