import { db } from './db';
import { businessCapabilities } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function rebuildCapabilityHierarchy() {
  console.log('Rebuilding capability hierarchy relationships...');
  
  const allCapabilities = await db.select().from(businessCapabilities);
  console.log(`Processing ${allCapabilities.length} capabilities`);
  
  // Create maps for efficient lookup
  const capsByLevel1 = new Map<string, any[]>();
  const capsByLevel1Level2 = new Map<string, any[]>();
  
  // Group capabilities by their level paths
  allCapabilities.forEach(cap => {
    if (cap.level1) {
      if (!capsByLevel1.has(cap.level1)) {
        capsByLevel1.set(cap.level1, []);
      }
      capsByLevel1.get(cap.level1)!.push(cap);
      
      if (cap.level2) {
        const key = `${cap.level1}::${cap.level2}`;
        if (!capsByLevel1Level2.has(key)) {
          capsByLevel1Level2.set(key, []);
        }
        capsByLevel1Level2.get(key)!.push(cap);
      }
    }
  });
  
  let updatedCount = 0;
  
  // Process each level1 group
  for (const [level1Name, caps] of capsByLevel1) {
    // Find or create level 1 capability
    let level1Cap = caps.find(cap => cap.level === 1 && cap.name.includes(level1Name));
    
    if (!level1Cap) {
      // Find the best representative level 1 capability
      level1Cap = caps.find(cap => cap.level === 1) || 
                  caps.find(cap => cap.level === 2 && !cap.level2) ||
                  caps.find(cap => cap.level === 2 && cap.level2 === cap.level1);
    }
    
    if (level1Cap) {
      console.log(`Found Level 1 capability: ${level1Cap.name} for domain: ${level1Name}`);
      
      // Update all level 2 capabilities in this domain to point to this level 1
      const level2Caps = caps.filter(cap => cap.level === 2 && cap.id !== level1Cap.id);
      
      for (const level2Cap of level2Caps) {
        if (level2Cap.parentId !== level1Cap.id) {
          await db
            .update(businessCapabilities)
            .set({ parentId: level1Cap.id })
            .where(eq(businessCapabilities.id, level2Cap.id));
          
          updatedCount++;
          console.log(`✓ Linked ${level2Cap.name} -> ${level1Cap.name}`);
        }
      }
    }
  }
  
  // Process level 2 to level 3 relationships
  for (const [key, caps] of capsByLevel1Level2) {
    const [level1Name, level2Name] = key.split('::');
    
    // Find level 2 capability
    const level2Cap = caps.find(cap => cap.level === 2);
    
    if (level2Cap) {
      // Link all level 3 capabilities to this level 2
      const level3Caps = caps.filter(cap => cap.level === 3);
      
      for (const level3Cap of level3Caps) {
        if (level3Cap.parentId !== level2Cap.id) {
          await db
            .update(businessCapabilities)
            .set({ parentId: level2Cap.id })
            .where(eq(businessCapabilities.id, level3Cap.id));
          
          updatedCount++;
          console.log(`✓ Linked ${level3Cap.name} -> ${level2Cap.name}`);
        }
      }
    } else {
      // Create missing level 2 capability
      const level3Caps = caps.filter(cap => cap.level === 3);
      if (level3Caps.length > 0) {
        const firstLevel3 = level3Caps[0];
        
        // Find the level 1 parent
        const level1Parent = allCapabilities.find(cap => 
          cap.level === 1 && cap.level1 === level1Name
        );
        
        const newLevel2Cap = {
          id: crypto.randomUUID(),
          name: level2Name,
          description: `Level 2 capability: ${level2Name}`,
          level1: level1Name,
          level2: level2Name,
          level3: '',
          level: 2,
          parentId: level1Parent?.id || null,
          domain: level1Name,
          criticality: 'Medium',
          maturity: 'Developing',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await db.insert(businessCapabilities).values(newLevel2Cap);
        console.log(`✓ Created Level 2: ${level2Name}`);
        
        // Link all level 3 capabilities to this new level 2
        for (const level3Cap of level3Caps) {
          await db
            .update(businessCapabilities)
            .set({ parentId: newLevel2Cap.id })
            .where(eq(businessCapabilities.id, level3Cap.id));
          
          updatedCount++;
          console.log(`✓ Linked ${level3Cap.name} -> ${newLevel2Cap.name}`);
        }
      }
    }
  }
  
  console.log(`\nHierarchy rebuild completed. Updated ${updatedCount} relationships.`);
  
  // Final verification
  const finalCapabilities = await db.select().from(businessCapabilities);
  const orphanedLevel2 = finalCapabilities.filter(cap => cap.level === 2 && !cap.parentId);
  const orphanedLevel3 = finalCapabilities.filter(cap => cap.level === 3 && !cap.parentId);
  
  console.log('\nFinal verification:');
  console.log(`Total capabilities: ${finalCapabilities.length}`);
  console.log(`Level 1: ${finalCapabilities.filter(cap => cap.level === 1).length}`);
  console.log(`Level 2: ${finalCapabilities.filter(cap => cap.level === 2).length}`);
  console.log(`Level 3: ${finalCapabilities.filter(cap => cap.level === 3).length}`);
  console.log(`Orphaned Level 2: ${orphanedLevel2.length}`);
  console.log(`Orphaned Level 3: ${orphanedLevel3.length}`);
  
  return {
    totalUpdated: updatedCount,
    finalCount: finalCapabilities.length,
    orphanedL2: orphanedLevel2.length,
    orphanedL3: orphanedLevel3.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  rebuildCapabilityHierarchy()
    .then((results) => {
      console.log('\nCapability hierarchy rebuild completed!');
      console.log('Results:', results);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Hierarchy rebuild failed:', error);
      process.exit(1);
    });
}

export { rebuildCapabilityHierarchy };