import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertApplicationSchema, insertBusinessCapabilitySchema, insertDataObjectSchema, insertInterfaceSchema, insertInitiativeSchema, insertITComponentSchema } from "@shared/schema";
import { importCSVData } from "./csv-import";
import Anthropic from '@anthropic-ai/sdk';

export async function registerRoutes(app: Express): Promise<Server> {
  // Business Capabilities routes
  app.get("/api/business-capabilities", async (req, res) => {
    try {
      const capabilities = await storage.getAllBusinessCapabilities();
      res.json(capabilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business capabilities" });
    }
  });

  app.get("/api/business-capabilities/hierarchy", async (req, res) => {
    try {
      const hierarchy = await storage.getBusinessCapabilityHierarchy();
      res.json(hierarchy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch capability hierarchy" });
    }
  });

  app.get("/api/business-capabilities/:id", async (req, res) => {
    try {
      const capability = await storage.getBusinessCapabilityById(req.params.id);
      if (!capability) {
        return res.status(404).json({ message: "Business capability not found" });
      }
      res.json(capability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business capability" });
    }
  });

  // Applications routes
  app.get("/api/applications", async (req, res) => {
    try {
      const { search, capability, domain } = req.query;
      const applications = await storage.getAllApplications(
        search as string,
        capability as string,
        domain as string
      );
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/:id", async (req, res) => {
    try {
      const application = await storage.getApplicationById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  app.get("/api/capabilities/:id/applications", async (req, res) => {
    try {
      const applications = await storage.getApplicationsByCapability(req.params.id);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications for capability" });
    }
  });



  // Data Objects routes
  app.get("/api/data-objects", async (req, res) => {
    try {
      const dataObjects = await storage.getAllDataObjects();
      res.json(dataObjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch data objects" });
    }
  });

  app.get("/api/data-objects/:id", async (req, res) => {
    try {
      const dataObject = await storage.getDataObjectById(req.params.id);
      if (!dataObject) {
        return res.status(404).json({ message: "Data object not found" });
      }
      res.json(dataObject);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch data object" });
    }
  });

  // Interfaces routes
  app.get("/api/interfaces", async (req, res) => {
    try {
      const interfaces = await storage.getAllInterfaces();
      res.json(interfaces);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interfaces" });
    }
  });

  app.get("/api/interfaces/:id", async (req, res) => {
    try {
      const interfaceObj = await storage.getInterfaceById(req.params.id);
      if (!interfaceObj) {
        return res.status(404).json({ message: "Interface not found" });
      }
      res.json(interfaceObj);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interface" });
    }
  });

  // IT Components routes
  app.get("/api/it-components", async (req, res) => {
    try {
      const components = await storage.getAllITComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IT components" });
    }
  });

  // Initiatives routes
  app.get("/api/initiatives", async (req, res) => {
    try {
      const initiatives = await storage.getAllInitiatives();
      res.json(initiatives);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch initiatives" });
    }
  });

  // Network data for visualization
  app.get("/api/network-data", async (req, res) => {
    try {
      const { capabilityId } = req.query;
      const networkData = await storage.getNetworkData(capabilityId as string);
      res.json(networkData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch network data" });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Heatmap data
  app.get("/api/heatmap-data", async (req, res) => {
    try {
      const { metric } = req.query;
      const heatmapData = await storage.getHeatmapData(metric as string);
      res.json(heatmapData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heatmap data" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const results = await storage.searchEntities(q as string, type as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform search" });
    }
  });

  // CSV Import endpoint
  app.post("/api/import-csv", async (req, res) => {
    try {
      await importCSVData();
      res.json({ message: "CSV data imported successfully" });
    } catch (error) {
      console.error("CSV import error:", error);
      res.status(500).json({ message: "Failed to import CSV data" });
    }
  });

  // Add application-capability relationship
  app.post("/api/applications/:applicationId/capabilities", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { capabilityName } = req.body;
      
      if (!capabilityName) {
        return res.status(400).json({ error: "Capability name is required" });
      }

      await storage.addApplicationCapabilityRelationship(applicationId, capabilityName);
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding application-capability relationship:", error);
      res.status(500).json({ error: "Failed to add relationship" });
    }
  });

  // Remove application-capability relationship
  app.delete("/api/applications/:applicationId/capabilities", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { capabilityName } = req.body;
      
      if (!capabilityName) {
        return res.status(400).json({ error: "Capability name is required" });
      }

      await storage.removeApplicationCapabilityRelationship(applicationId, capabilityName);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing application-capability relationship:", error);
      res.status(500).json({ error: "Failed to remove relationship" });
    }
  });

  // AI Diagram Generation endpoint using Claude
  app.post("/api/generate-diagram", async (req, res) => {
    try {
      const { description, type } = req.body;
      
      if (!description || !type) {
        return res.status(400).json({ error: "Description and type are required" });
      }

      if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: "Anthropic API key not configured" });
      }

      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const diagramPrompts = {
        process: "Create a process flow diagram showing the business process steps, decision points, and flow paths.",
        integration: "Create an integration flow diagram showing systems, data flows, APIs, and connection points.",
        dataflow: "Create a data flow diagram showing data sources, processes, data stores, and external entities.",
        sequence: "Create a sequence diagram showing interactions between actors, objects, and timeline.",
        class: "Create a class diagram showing classes, attributes, methods, and relationships.",
        architecture: "Create an architecture diagram showing system components, layers, and connections.",
        erd: "Create an entity relationship diagram showing entities, attributes, and relationships.",
        journey: "Create a user journey diagram showing touchpoints, actions, and experience stages."
      };

      const prompt = `You are an expert diagram designer specializing in ArchiMate and enterprise architecture patterns. 
      
Generate a Mermaid diagram code for the following ${type} diagram request:
"${description}"

Guidelines:
- ${diagramPrompts[type] || "Create a professional diagram"}
- Use ArchiMate principles where applicable
- Ensure proper syntax and clear labeling
- Include appropriate styling and colors
- Make it professional and visually clear
- Use appropriate Mermaid diagram type (flowchart, sequenceDiagram, classDiagram, erDiagram, etc.)

Return ONLY the Mermaid code without any explanation or markdown formatting.`;

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const mermaidCode = message.content[0].text.trim();
      
      res.json({ mermaidCode });
    } catch (error) {
      console.error("Error generating diagram:", error);
      res.status(500).json({ error: "Failed to generate diagram" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
