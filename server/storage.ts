import { 
  users, type User, type InsertUser,
  businessCapabilities, type BusinessCapability,
  applications, type Application,
  dataObjects, type DataObject,
  interfaces, type Interface,
  initiatives, type Initiative,
  itComponents, type ITComponent,
  adrs, type Adr, type InsertAdr,
  adrVersions, type AdrVersion, type InsertAdrVersion,
  diagrams, type Diagram, type InsertDiagram
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, sql, desc } from "drizzle-orm";
import { generateNetworkData, generateHeatmapData, generateDashboardMetrics, buildHierarchy } from "../client/src/lib/data-processing";

interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Business Capability methods
  getAllBusinessCapabilities(): Promise<BusinessCapability[]>;
  getBusinessCapabilityById(id: string): Promise<BusinessCapability | undefined>;
  getBusinessCapabilityHierarchy(): Promise<BusinessCapability[]>;
  
  // Application methods
  getAllApplications(search?: string, capability?: string, domain?: string): Promise<Application[]>;
  getApplicationById(id: string): Promise<Application | undefined>;
  getApplicationsByCapability(capabilityId: string): Promise<Application[]>;
  
  // Data Object methods
  getAllDataObjects(): Promise<DataObject[]>;
  getDataObjectById(id: string): Promise<DataObject | undefined>;
  
  // Interface methods
  getAllInterfaces(): Promise<Interface[]>;
  getInterfaceById(id: string): Promise<Interface | undefined>;
  
  // IT Component methods
  getAllITComponents(): Promise<ITComponent[]>;
  
  // Initiative methods
  getAllInitiatives(): Promise<Initiative[]>;
  
  // Analytics methods
  getNetworkData(capabilityId?: string): Promise<any>;
  getDashboardMetrics(): Promise<any>;
  getHeatmapData(metric?: string): Promise<any>;
  searchEntities(query: string, type?: string): Promise<any>;
  
  // Application-Capability relationship methods
  addApplicationCapabilityRelationship(applicationId: string, capabilityName: string): Promise<void>;
  removeApplicationCapabilityRelationship(applicationId: string, capabilityName: string): Promise<void>;
  
  // ADR methods
  getAllAdrs(): Promise<Adr[]>;
  getAdrById(id: string): Promise<Adr | undefined>;
  createAdr(insertAdr: InsertAdr): Promise<Adr>;
  updateAdr(id: string, updateData: Partial<InsertAdr>): Promise<Adr | undefined>;
  
  // ADR Version methods
  getAdrVersions(adrId: string): Promise<any[]>;
  getAdrVersion(adrId: string, version: number): Promise<any | undefined>;
  
  // Diagram methods
  getAllDiagrams(): Promise<Diagram[]>;
  getDiagramById(id: string): Promise<Diagram | undefined>;
  createDiagram(insertDiagram: InsertDiagram): Promise<Diagram>;
  updateDiagram(id: string, updateData: Partial<InsertDiagram>): Promise<Diagram | undefined>;
  deleteDiagram(id: string): Promise<void>;
  getDiagramsByApplicationId(applicationId: string): Promise<Diagram[]>;
  linkDiagramToApplication(diagramId: string, applicationId: string): Promise<void>;
  unlinkDiagramFromApplication(diagramId: string, applicationId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Business Capability methods
  async getAllBusinessCapabilities(): Promise<BusinessCapability[]> {
    return await db.select().from(businessCapabilities);
  }

  async getBusinessCapabilityById(id: string): Promise<BusinessCapability | undefined> {
    const [capability] = await db.select().from(businessCapabilities).where(eq(businessCapabilities.id, id));
    return capability || undefined;
  }

  async getBusinessCapabilityHierarchy(): Promise<BusinessCapability[]> {
    const capabilities = await this.getAllBusinessCapabilities();
    return buildHierarchy(capabilities);
  }

  // Application methods
  async getAllApplications(search?: string, capability?: string, domain?: string): Promise<Application[]> {
    let whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(applications.name, `%${search}%`),
          like(applications.displayName, `%${search}%`),
          like(applications.businessDomain, `%${search}%`)
        )
      );
    }
    
    if (domain) {
      whereConditions.push(like(applications.businessDomain, `%${domain}%`));
    }
    
    if (whereConditions.length > 0) {
      return await db.select().from(applications).where(or(...whereConditions));
    } else {
      return await db.select().from(applications);
    }
  }

  async getApplicationById(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplicationsByCapability(capabilityId: string): Promise<Application[]> {
    // Get the capability name to match against application business_capabilities field
    const capability = await this.getBusinessCapabilityById(capabilityId);
    if (!capability) return [];

    const apps = await db.select().from(applications);
    
    // Filter applications that have this capability in their business_capabilities field
    return apps.filter(app => {
      if (!app.businessCapabilities) return false;
      
      // Handle multiple capabilities separated by semicolons
      const appCapabilities = app.businessCapabilities
        .split(';')
        .map(cap => cap.trim().replace(/^~/, ''));
      
      // Check for exact matches or hierarchical matches
      return appCapabilities.some(appCap => {
        // Exact match
        if (appCap === capability.name) return true;
        
        // Check if the capability name is contained in the app capability
        if (appCap.includes(capability.name)) return true;
        
        // Check if the app capability starts with the capability name
        if (capability.name.startsWith(appCap)) return true;
        
        return false;
      });
    });
  }

  // Data Object methods
  async getAllDataObjects(): Promise<DataObject[]> {
    return await db.select().from(dataObjects);
  }

  async getDataObjectById(id: string): Promise<DataObject | undefined> {
    const [dataObject] = await db.select().from(dataObjects).where(eq(dataObjects.id, id));
    return dataObject || undefined;
  }

  // Interface methods
  async getAllInterfaces(): Promise<Interface[]> {
    return await db.select().from(interfaces);
  }

  async getInterfaceById(id: string): Promise<Interface | undefined> {
    const [interfaceObj] = await db.select().from(interfaces).where(eq(interfaces.id, id));
    return interfaceObj || undefined;
  }

  // IT Component methods
  async getAllITComponents(): Promise<ITComponent[]> {
    return await db.select().from(itComponents);
  }

  // Initiative methods
  async getAllInitiatives(): Promise<Initiative[]> {
    return await db.select().from(initiatives);
  }

  // Analytics methods
  async getNetworkData(capabilityId?: string): Promise<any> {
    const capabilities = await this.getAllBusinessCapabilities();
    const apps = await this.getAllApplications();
    const dataObjs = await this.getAllDataObjects();
    
    return generateNetworkData(capabilities, apps, dataObjs, capabilityId);
  }

  async getDashboardMetrics(): Promise<any> {
    const capabilities = await this.getAllBusinessCapabilities();
    const apps = await this.getAllApplications();
    const dataObjs = await this.getAllDataObjects();
    
    return generateDashboardMetrics(capabilities, apps, dataObjs);
  }

  async getHeatmapData(metric?: string): Promise<any> {
    const capabilities = await this.getAllBusinessCapabilities();
    const apps = await this.getAllApplications();
    
    return generateHeatmapData(capabilities, apps, metric);
  }

  async searchEntities(query: string, type?: string): Promise<any> {
    const results: any[] = [];
    
    if (!type || type === 'capabilities') {
      const capabilities = await db.select().from(businessCapabilities)
        .where(
          or(
            like(businessCapabilities.name, `%${query}%`),
            like(businessCapabilities.displayName, `%${query}%`)
          )
        );
      results.push(...capabilities.map(c => ({ ...c, entityType: 'capability' })));
    }
    
    if (!type || type === 'applications') {
      const apps = await db.select().from(applications)
        .where(
          or(
            like(applications.name, `%${query}%`),
            like(applications.displayName, `%${query}%`)
          )
        );
      results.push(...apps.map(a => ({ ...a, entityType: 'application' })));
    }
    
    if (!type || type === 'dataObjects') {
      const dataObjs = await db.select().from(dataObjects)
        .where(
          or(
            like(dataObjects.name, `%${query}%`),
            like(dataObjects.displayName, `%${query}%`)
          )
        );
      results.push(...dataObjs.map(d => ({ ...d, entityType: 'dataObject' })));
    }
    
    return results;
  }

  async addApplicationCapabilityRelationship(applicationId: string, capabilityName: string): Promise<void> {
    // Get the current application
    const [application] = await db.select().from(applications).where(eq(applications.id, applicationId));
    if (!application) {
      throw new Error(`Application with id ${applicationId} not found`);
    }

    // Get current business capabilities
    const currentCapabilities = application.businessCapabilities || '';
    
    // Check if capability is already mapped
    if (currentCapabilities.toLowerCase().includes(capabilityName.toLowerCase())) {
      return; // Already mapped, no need to add again
    }

    // Add the new capability
    const updatedCapabilities = currentCapabilities 
      ? `${currentCapabilities}, ${capabilityName}`
      : capabilityName;

    // Update the application
    await db.update(applications)
      .set({ businessCapabilities: updatedCapabilities })
      .where(eq(applications.id, applicationId));
  }

  async removeApplicationCapabilityRelationship(applicationId: string, capabilityName: string): Promise<void> {
    // Get the current application
    const [application] = await db.select().from(applications).where(eq(applications.id, applicationId));
    if (!application) {
      throw new Error(`Application with id ${applicationId} not found`);
    }

    // Get current business capabilities
    const currentCapabilities = application.businessCapabilities || '';
    
    // Remove the capability (case-insensitive)
    const capabilitiesList = currentCapabilities
      .split(',')
      .map(cap => cap.trim())
      .filter(cap => cap.toLowerCase() !== capabilityName.toLowerCase());

    const updatedCapabilities = capabilitiesList.join(', ');

    // Update the application
    await db.update(applications)
      .set({ businessCapabilities: updatedCapabilities })
      .where(eq(applications.id, applicationId));
  }

  async getAllAdrs(): Promise<Adr[]> {
    const adrList = await db.select().from(adrs).orderBy(desc(adrs.date));
    return adrList;
  }

  async getAdrById(id: string): Promise<Adr | undefined> {
    const [adr] = await db.select().from(adrs).where(eq(adrs.id, parseInt(id)));
    return adr || undefined;
  }

  async createAdr(insertAdr: InsertAdr): Promise<Adr> {
    const [adr] = await db
      .insert(adrs)
      .values({
        ...insertAdr,
        updatedAt: new Date(),
      })
      .returning();
    return adr;
  }

  async updateAdr(id: string, updateData: any): Promise<Adr | undefined> {
    // Get the current ADR to save as previous version
    const currentAdr = await this.getAdrById(id);
    if (!currentAdr) return undefined;

    // Remove any problematic fields that shouldn't be updated directly
    const { 
      id: _id, 
      createdAt, 
      updatedAt, 
      date,
      lastModifiedAt,
      ...cleanData 
    } = updateData;

    // Detect what fields have changed
    const changedFields: string[] = [];
    Object.keys(cleanData).forEach(key => {
      const currentValue = currentAdr[key as keyof typeof currentAdr];
      const newValue = cleanData[key];
      if (currentValue !== newValue) {
        changedFields.push(key);
      }
    });

    // Save current state as a version record in JSON format (store minimal data)
    const versionData = {
      version: currentAdr.version,
      data: {
        ...currentAdr,
        // Remove heavy fields to reduce payload size
        auditTrail: null,
        revisionHistory: null
      },
      timestamp: new Date().toISOString(),
      user: "Current User",
      changes: changedFields,
      changeDetails: changedFields.map(field => ({
        field,
        oldValue: currentAdr[field as keyof typeof currentAdr],
        newValue: cleanData[field]
      }))
    };

    // Store version in auditTrail - limit to last 10 versions to prevent payload issues
    let existingAuditTrail = [];
    try {
      existingAuditTrail = currentAdr.auditTrail ? JSON.parse(currentAdr.auditTrail) : [];
      // Keep only the last 9 versions, so with the new one we have max 10
      if (existingAuditTrail.length >= 10) {
        existingAuditTrail = existingAuditTrail.slice(-9);
      }
    } catch (e) {
      existingAuditTrail = [];
    }

    // Increment version number
    const newVersion = currentAdr.version + 1;
    
    const [adr] = await db
      .update(adrs)
      .set({
        ...cleanData,
        version: newVersion,
        lastModifiedAt: new Date(),
        updatedAt: new Date(),
        // Store version history in auditTrail
        auditTrail: JSON.stringify([
          ...existingAuditTrail,
          versionData
        ])
      })
      .where(eq(adrs.id, parseInt(id)))
      .returning();
    return adr || undefined;
  }

  async getAdrVersions(adrId: string): Promise<any[]> {
    const [adr] = await db
      .select()
      .from(adrs)
      .where(eq(adrs.adrId, adrId));
    
    if (!adr || !adr.auditTrail) return [];
    
    try {
      const auditTrail = JSON.parse(adr.auditTrail);
      return auditTrail.filter((entry: any) => entry.data && entry.version);
    } catch (e) {
      return [];
    }
  }

  async getAdrVersion(adrId: string, version: number): Promise<any | undefined> {
    const [adr] = await db
      .select()
      .from(adrs)
      .where(eq(adrs.adrId, adrId));
    
    if (!adr) return undefined;
    
    // If requesting current version, return current ADR
    if (version === adr.version) {
      return adr;
    }
    
    // For version 1, return the original creation state
    if (version === 1) {
      // Check if version 1 is stored in audit trail first
      if (adr.auditTrail) {
        try {
          const auditTrail = JSON.parse(adr.auditTrail);
          const version1Entry = auditTrail.find((entry: any) => 
            entry.data && entry.version === 1
          );
          if (version1Entry) {
            return version1Entry.data;
          }
        } catch (e) {
          // Continue to return basic version 1
        }
      }
      
      // Return a basic version 1 (original creation state)
      return {
        ...adr,
        version: 1,
        problemStatement: adr.title || '',
        businessDrivers: '',
        currentState: '',
        constraints: '',
        decisionCriteria: '',
        optionsConsidered: '',
        selectedOption: '',
        justification: '',
        actionItems: '',
        impactAssessment: '',
        verificationMethod: '',
        positiveConsequences: '',
        negativeConsequences: '',
        risksAndMitigations: '',
        notes: '',
        references: ''
      };
    }
    
    // Look for specific version in audit trail
    if (!adr.auditTrail) return undefined;
    
    try {
      const auditTrail = JSON.parse(adr.auditTrail);
      const versionEntry = auditTrail.find((entry: any) => 
        entry.data && entry.version === version
      );
      return versionEntry ? versionEntry.data : undefined;
    } catch (e) {
      return undefined;
    }
  }

  // Diagram methods
  async getAllDiagrams(): Promise<Diagram[]> {
    return await db.select().from(diagrams).orderBy(desc(diagrams.updatedAt));
  }

  async getDiagramById(id: string): Promise<Diagram | undefined> {
    const [diagram] = await db.select().from(diagrams).where(eq(diagrams.id, id));
    return diagram || undefined;
  }

  async createDiagram(insertDiagram: InsertDiagram): Promise<Diagram> {
    console.log("DatabaseStorage.createDiagram - Input data:", JSON.stringify(insertDiagram, null, 2));
    
    try {
      const [diagram] = await db
        .insert(diagrams)
        .values({
          ...insertDiagram,
          updatedAt: sql`now()`
        })
        .returning();
      
      console.log("DatabaseStorage.createDiagram - Inserted diagram:", JSON.stringify(diagram, null, 2));
      return diagram;
    } catch (error) {
      console.error("DatabaseStorage.createDiagram - Database error:", error);
      throw error;
    }
  }

  async updateDiagram(id: string, updateData: Partial<InsertDiagram>): Promise<Diagram | undefined> {
    const [diagram] = await db
      .update(diagrams)
      .set({
        ...updateData,
        updatedAt: sql`now()`
      })
      .where(eq(diagrams.id, id))
      .returning();
    return diagram || undefined;
  }

  async deleteDiagram(id: string): Promise<void> {
    await db.delete(diagrams).where(eq(diagrams.id, id));
  }

  async getDiagramsByApplicationId(applicationId: string): Promise<Diagram[]> {
    return await db
      .select()
      .from(diagrams)
      .where(like(diagrams.applicationIds, `%"${applicationId}"%`))
      .orderBy(desc(diagrams.updatedAt));
  }

  async linkDiagramToApplication(diagramId: string, applicationId: string): Promise<void> {
    const diagram = await this.getDiagramById(diagramId);
    if (!diagram) return;

    let applicationIds: string[] = [];
    if (diagram.applicationIds) {
      try {
        applicationIds = JSON.parse(diagram.applicationIds);
      } catch {
        applicationIds = [];
      }
    }

    if (!applicationIds.includes(applicationId)) {
      applicationIds.push(applicationId);
      await this.updateDiagram(diagramId, {
        applicationIds: JSON.stringify(applicationIds)
      });
    }
  }

  async unlinkDiagramFromApplication(diagramId: string, applicationId: string): Promise<void> {
    const diagram = await this.getDiagramById(diagramId);
    if (!diagram) return;

    let applicationIds: string[] = [];
    if (diagram.applicationIds) {
      try {
        applicationIds = JSON.parse(diagram.applicationIds);
      } catch {
        applicationIds = [];
      }
    }

    const filteredIds = applicationIds.filter(id => id !== applicationId);
    await this.updateDiagram(diagramId, {
      applicationIds: JSON.stringify(filteredIds)
    });
  }
}

export const storage = new DatabaseStorage();