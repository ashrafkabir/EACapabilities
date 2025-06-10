import fs from 'fs';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function parseCSVLine(line) {
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

function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    records.push(record);
  }
  
  return records;
}

async function importITComponents() {
  try {
    const records = parseCSV('./attached_assets/ITComponents_1749518164787.csv');
    const dataRows = records.slice(2); // Skip header rows
    
    console.log(`Importing ${dataRows.length} IT components...`);
    
    for (const record of dataRows) {
      if (!record.id || !record.name) continue;
      
      const query = `
        INSERT INTO it_components (name, display_name, category, vendor, version, status, applications)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `;
      
      const values = [
        record.name || '',
        record.displayName || record.name || '',
        record.relITComponentToTechnologyStack || '',
        record.relITComponentToProvider || '',
        '',
        'active',
        record.relITComponentToApplication || ''
      ];
      
      await pool.query(query, values);
    }
    
    console.log(`IT components imported successfully`);
  } catch (error) {
    console.error('Error importing IT components:', error);
  }
}

async function importInitiatives() {
  try {
    const records = parseCSV('./attached_assets/Initiatives_1749518164787.csv');
    const dataRows = records.slice(2); // Skip header rows
    
    console.log(`Importing ${dataRows.length} initiatives...`);
    
    for (const record of dataRows) {
      if (!record.id || !record.name) continue;
      
      const query = `
        INSERT INTO initiatives (name, description, status, start_date, end_date, business_capabilities, applications)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `;
      
      const values = [
        record.name || '',
        record.displayName || null,
        record['tags:Project Phase'] || 'active',
        null,
        null,
        record.relProjectToBusinessCapability || null,
        record.relProjectToApplication || null
      ];
      
      await pool.query(query, values);
    }
    
    console.log(`Initiatives imported successfully`);
  } catch (error) {
    console.error('Error importing initiatives:', error);
  }
}

async function main() {
  try {
    await importITComponents();
    await importInitiatives();
    console.log('Bulk import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Bulk import failed:', error);
    process.exit(1);
  }
}

main();