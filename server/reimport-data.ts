import { importCSVData } from './csv-import.js';

async function main() {
  try {
    console.log('Starting data re-import with corrected hierarchy...');
    await importCSVData();
    console.log('Data import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

main();