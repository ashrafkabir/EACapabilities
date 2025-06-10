import { 
  users, type User, type InsertUser,
  businessCapabilities, type BusinessCapability,
  applications, type Application,
  dataObjects, type DataObject,
  interfaces, type Interface,
  initiatives, type Initiative,
  itComponents, type ITComponent
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, sql } from "drizzle-orm";
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
}

export const storage = new DatabaseStorage();