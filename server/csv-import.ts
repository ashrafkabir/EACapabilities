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

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"/, '').replace(/"$/, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
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

    for (const row of data) {
      if (!row['Business Capability in LeanIX']) continue;

      const capability = {
        name: row['Business Capability in LeanIX'],
        displayName: row['Business Capability in LeanIX'],
        hierarchy: row['Hierarchy'] || '',
        mappedLevel1Capability: row['Mapped  Level 1 Capability'] || '',
        mappedToLifesciencesCapabilities: row['mapped to Lifesciences Capabilities Level 3'] || '',
        level: (row['Hierarchy'] || '').split(' / ').length,
      };

      await db.insert(businessCapabilities).values(capability).onConflictDoNothing();
    }

    console.log('Business capabilities imported successfully');
  } catch (error) {
    console.error('Error importing business capabilities:', error);
  }
}

async function importApplications() {
  try {
    const data = await parseCSV('Applications_1749518164788.csv');
    console.log(`Processing ${data.length} applications...`);

    for (const row of data) {
      if (!row['Name'] || row['Name'] === 'Name') continue;

      const application = {
        name: row['Name'] || '',
        displayName: row['Display Name'] || row['Name'] || '',
        businessCapabilities: row['Business Capabilities'] || '',
        itComponentDisplayName: row['IT Component: Display Name'] || '',
        activeFrom: row['Active from'] || '',
        activeUntil: row['Active until'] || '',
        costTotalAnnual: row['costTotalAnnual'] || '',
        description: row['Description'] || '',
        obsolescenceRiskComment: row['Obsolescence Risk Comment'] || '',
        obsolescenceRiskStatus: row['Obsolescence Risk Status'] || '',
        serviceLevel: row['serviceLevel'] || '',
        technicalSuitability: row['Technical Fit'] || '',
        gdItTeams: row['GD IT Teams'] || '',
        ownedBy: row['Owned By'] || '',
        owningFunction: row['Owning Function'] || '',
        businessDomain: row['Business Domain'] || '',
        maturityStatus: row['Maturity Status'] || '',
        mainArea: row['Main Area'] || '',
        pace: row['PACE'] || '',
        businessUnit: row['Business Unit'] || '',
        vendor: row['Vendor'] || '',
        lxPsWip: row['LX PS WiP'] || '',
        region: row['Region'] || '',
        otherTags: row['Other tags'] || '',
        organizations: row['Organizations'] || '',
        cmdbApplicationServiceUrl: row['CMDB Application Service URL'] || '',
        cmdbBusinessApplicationUrl: row['CMDB Business Application URL'] || '',
        functionalFit: row['Functional Fit'] || '',
        technicalFit: row['Technical Fit'] || '',
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
