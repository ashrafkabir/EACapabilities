import { enhancedImportCSVData } from './enhanced-csv-import';

async function main() {
  try {
    console.log('Starting enhanced data import...');
    await enhancedImportCSVData();
    console.log('Enhanced import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Enhanced import failed:', error);
    process.exit(1);
  }
}

main();