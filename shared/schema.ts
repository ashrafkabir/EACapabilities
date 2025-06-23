import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const businessCapabilities = pgTable("business_capabilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  hierarchy: text("hierarchy"),
  parentId: uuid("parent_id").references(() => businessCapabilities.id),
  level: integer("level").default(1),
  level1Capability: text("level1_capability"),
  level2Capability: text("level2_capability"),
  level3Capability: text("level3_capability"),
  mappedLevel1Capability: text("mapped_level1_capability"),
  mappedToLifesciencesCapabilities: text("mapped_to_lifesciences_capabilities"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  businessCapabilities: text("business_capabilities"),
  itComponentDisplayName: text("it_component_display_name"),
  activeFrom: text("active_from"),
  activeUntil: text("active_until"),
  costTotalAnnual: text("cost_total_annual"),
  description: text("description"),
  obsolescenceRiskComment: text("obsolescence_risk_comment"),
  obsolescenceRiskStatus: text("obsolescence_risk_status"),
  serviceLevel: text("service_level"),
  technicalSuitability: text("technical_suitability"),
  gdItTeams: text("gd_it_teams"),
  ownedBy: text("owned_by"),
  owningFunction: text("owning_function"),
  businessDomain: text("business_domain"),
  maturityStatus: text("maturity_status"),
  mainArea: text("main_area"),
  pace: text("pace"),
  businessUnit: text("business_unit"),
  vendor: text("vendor"),
  lxPsWip: text("lx_ps_wip"),
  region: text("region"),
  otherTags: text("other_tags"),
  organizations: text("organizations"),
  cmdbApplicationServiceUrl: text("cmdb_application_service_url"),
  cmdbBusinessApplicationUrl: text("cmdb_business_application_url"),
  functionalFit: text("functional_fit"),
  technicalFit: text("technical_fit"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dataObjects = pgTable("data_objects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  relDataObjectToInterface: text("rel_data_object_to_interface"),
  relDataObjectToProject: text("rel_data_object_to_project"),
  tagsGdItTeams: text("tags_gd_it_teams"),
  tagsOwnedBy: text("tags_owned_by"),
  tagsOwningFunction: text("tags_owning_function"),
  tagsBusinessDomain: text("tags_business_domain"),
  tagsMainArea: text("tags_main_area"),
  tagsBusinessUnit: text("tags_business_unit"),
  tagsLxPsWip: text("tags_lx_ps_wip"),
  tagsRegion: text("tags_region"),
  tagsOtherTags: text("tags_other_tags"),
  relDataObjectToApplication: text("rel_data_object_to_application"),
  relToChild: text("rel_to_child"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interfaces = pgTable("interfaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sourceApplication: text("source_application"),
  targetApplication: text("target_application"),
  dataFlow: text("data_flow"),
  frequency: text("frequency"),
  dataObjects: text("data_objects"),
  status: text("status"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const initiatives = pgTable("initiatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  businessCapabilities: text("business_capabilities"),
  applications: text("applications"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const itComponents = pgTable("it_components", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  category: text("category"),
  vendor: text("vendor"),
  version: text("version"),
  status: text("status"),
  applications: text("applications"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertBusinessCapabilitySchema = createInsertSchema(businessCapabilities).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertDataObjectSchema = createInsertSchema(dataObjects).omit({
  id: true,
  createdAt: true,
});

export const insertInterfaceSchema = createInsertSchema(interfaces).omit({
  id: true,
  createdAt: true,
});

export const insertInitiativeSchema = createInsertSchema(initiatives).omit({
  id: true,
  createdAt: true,
});

export const insertITComponentSchema = createInsertSchema(itComponents).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertBusinessCapability = z.infer<typeof insertBusinessCapabilitySchema>;
export type BusinessCapability = typeof businessCapabilities.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertDataObject = z.infer<typeof insertDataObjectSchema>;
export type DataObject = typeof dataObjects.$inferSelect;

export type InsertInterface = z.infer<typeof insertInterfaceSchema>;
export type Interface = typeof interfaces.$inferSelect;

export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;
export type Initiative = typeof initiatives.$inferSelect;

export type InsertITComponent = z.infer<typeof insertITComponentSchema>;
export type ITComponent = typeof itComponents.$inferSelect;

export const adrs = pgTable("adrs", {
  id: serial("id").primaryKey(),
  adrId: text("adr_id").unique().notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  decisionMakers: text("decision_makers"),
  relatedStandard: text("related_standard"),
  impactedSystems: text("impacted_systems"),
  classification: text("classification"),
  
  problemStatement: text("problem_statement"),
  businessDrivers: text("business_drivers"),
  currentState: text("current_state"),
  constraints: text("constraints"),
  decisionCriteria: text("decision_criteria"),
  optionsConsidered: text("options_considered"),
  selectedOption: text("selected_option"),
  justification: text("justification"),
  
  actionItems: text("action_items"),
  impactAssessment: text("impact_assessment"),
  verificationMethod: text("verification_method"),
  
  positiveConsequences: text("positive_consequences"),
  negativeConsequences: text("negative_consequences"),
  risksAndMitigations: text("risks_and_mitigations"),
  
  applicationId: text("application_id"),
  capabilityIds: text("capability_ids"),
  relatedAdrIds: text("related_adr_ids"),
  notes: text("notes"),
  references: text("references"),
  
  approvals: text("approvals"),
  revisionHistory: text("revision_history"),
  
  // Audit trail
  auditTrail: text("audit_trail"),
  lastModifiedBy: text("last_modified_by"),
  lastModifiedAt: timestamp("last_modified_at"),
  version: integer("version").default(1).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdrSchema = createInsertSchema(adrs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdr = z.infer<typeof insertAdrSchema>;
export type Adr = typeof adrs.$inferSelect;

// Legacy user table for authentication (keeping for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
