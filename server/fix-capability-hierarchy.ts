import { db } from './db';
import { businessCapabilities } from '@shared/schema';
import { eq, and, isNull } from 'drizzle-orm';

async function fixCapabilityHierarchy() {
  console.log('Starting capability hierarchy relationship fix...');
  
  const allCapabilities = await db.select().from(businessCapabilities);
  console.log(`Found ${allCapabilities.length} total capabilities`);
  
  // Group capabilities by level
  const level1Caps = allCapabilities.filter(cap => cap.level === 1);
  const level2Caps = allCapabilities.filter(cap => cap.level === 2);
  const level3Caps = allCapabilities.filter(cap => cap.level === 3);
  
  console.log(`Level 1: ${level1Caps.length}, Level 2: ${level2Caps.length}, Level 3: ${level3Caps.length}`);
  
  let updatedCount = 0;
  
  // First, create missing Level 1 capabilities
  const uniqueLevel1Names = new Set();
  allCapabilities.forEach(cap => {
    if (cap.level1) uniqueLevel1Names.add(cap.level1);
  });
  
  const existingLevel1Names = new Set(level1Caps.map(cap => cap.name));
  const missingLevel1Names = Array.from(uniqueLevel1Names).filter(name => !existingLevel1Names.has(name as string));
  
  console.log(`Creating ${missingLevel1Names.length} missing Level 1 capabilities...`);
  
  for (const name of missingLevel1Names) {
    const newLevel1Cap = {
      id: crypto.randomUUID(),
      name: name as string,
      description: `Level 1 capability: ${name}`,
      level1: name as string,
      level2: '',
      level3: '',
      level: 1,
      parentId: null,
      domain: name as string,
      criticality: 'High',
      maturity: 'Established',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.insert(businessCapabilities).values(newLevel1Cap);
    level1Caps.push(newLevel1Cap);
    console.log(`✓ Created Level 1: ${name}`);
  }
  
  // Refresh all capabilities after insertions
  const refreshedCapabilities = await db.select().from(businessCapabilities);
  const refreshedLevel1Caps = refreshedCapabilities.filter(cap => cap.level === 1);
  const refreshedLevel2Caps = refreshedCapabilities.filter(cap => cap.level === 2);
  const refreshedLevel3Caps = refreshedCapabilities.filter(cap => cap.level === 3);
  
  // Update Level 2 capabilities to have Level 1 parents
  console.log('Setting Level 1 parents for Level 2 capabilities...');
  for (const level2Cap of refreshedLevel2Caps) {
    if (!level2Cap.parentId && level2Cap.level1) {
      const parent = refreshedLevel1Caps.find(cap => cap.name === level2Cap.level1);
      if (parent) {
        await db
          .update(businessCapabilities)
          .set({ parentId: parent.id })
          .where(eq(businessCapabilities.id, level2Cap.id));
        
        updatedCount++;
        console.log(`✓ Set parent: ${level2Cap.name} -> ${parent.name}`);
      }
    }
  }
  
  // Update Level 3 capabilities to have Level 2 parents
  console.log('Setting Level 2 parents for Level 3 capabilities...');
  for (const level3Cap of refreshedLevel3Caps) {
    if (!level3Cap.parentId && level3Cap.level1 && level3Cap.level2) {
      const parent = refreshedLevel2Caps.find(cap => 
        cap.level1 === level3Cap.level1 && 
        cap.level2 === level3Cap.level2 &&
        cap.level === 2
      );
      
      if (parent) {
        await db
          .update(businessCapabilities)
          .set({ parentId: parent.id })
          .where(eq(businessCapabilities.id, level3Cap.id));
        
        updatedCount++;
        console.log(`✓ Set parent: ${level3Cap.name} -> ${parent.name}`);
      } else {
        // Create missing Level 2 parent if it doesn't exist
        const level2Name = level3Cap.level2;
        const newLevel2Cap = {
          id: crypto.randomUUID(),
          name: level2Name,
          description: `Level 2 capability: ${level2Name}`,
          level1: level3Cap.level1,
          level2: level2Name,
          level3: '',
          level: 2,
          parentId: refreshedLevel1Caps.find(cap => cap.name === level3Cap.level1)?.id || null,
          domain: level3Cap.level1,
          criticality: 'Medium',
          maturity: 'Developing',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await db.insert(businessCapabilities).values(newLevel2Cap);
        refreshedLevel2Caps.push(newLevel2Cap);
        
        await db
          .update(businessCapabilities)
          .set({ parentId: newLevel2Cap.id })
          .where(eq(businessCapabilities.id, level3Cap.id));
        
        updatedCount++;
        console.log(`✓ Created Level 2 parent and linked: ${level3Cap.name} -> ${level2Name}`);
      }
    }
  }
  
  console.log(`\nHierarchy fix completed. Updated ${updatedCount} relationships.`);
  
  // Final verification
  const finalCapabilities = await db.select().from(businessCapabilities);
  const finalLevel1 = finalCapabilities.filter(cap => cap.level === 1);
  const finalLevel2 = finalCapabilities.filter(cap => cap.level === 2);
  const finalLevel3 = finalCapabilities.filter(cap => cap.level === 3);
  
  console.log('\nFinal capability counts:');
  console.log(`Level 1: ${finalLevel1.length} capabilities`);
  console.log(`Level 2: ${finalLevel2.length} capabilities`);
  console.log(`Level 3: ${finalLevel3.length} capabilities`);
  console.log(`Total: ${finalCapabilities.length} capabilities`);
  
  // Count orphaned capabilities
  const orphanedLevel2 = finalLevel2.filter(cap => !cap.parentId);
  const orphanedLevel3 = finalLevel3.filter(cap => !cap.parentId);
  
  console.log(`\nOrphaned capabilities:`);
  console.log(`Level 2 without parents: ${orphanedLevel2.length}`);
  console.log(`Level 3 without parents: ${orphanedLevel3.length}`);
  
  return {
    totalCapabilities: finalCapabilities.length,
    level1Count: finalLevel1.length,
    level2Count: finalLevel2.length,
    level3Count: finalLevel3.length,
    updatedRelationships: updatedCount
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fixCapabilityHierarchy()
    .then((results) => {
      console.log('\nCapability hierarchy fix completed successfully!');
      console.log('Results:', results);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Hierarchy fix failed:', error);
      process.exit(1);
    });
}

export { fixCapabilityHierarchy };