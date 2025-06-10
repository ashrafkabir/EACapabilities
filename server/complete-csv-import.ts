import { db } from './db';
import { 
  dataObjects, 
  interfaces, 
  initiatives, 
  itComponents 
} from '@shared/schema';
import fs from 'fs';

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

async function main() {
  try {
    console.log('Starting complete CSV data import...');
    
    await importDataObjects();
    await importInterfaces();
    await importInitiatives();
    await importITComponents();
    
    console.log('Complete CSV data import finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during complete CSV import:', error);
    process.exit(1);
  }
}

main();