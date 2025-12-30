import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const ADMIN_PASSWORD = "D34TH";

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.authenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes
  app.post(api.auth.login.path, (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      if (input.password === ADMIN_PASSWORD) {
        req.session.authenticated = true;
        res.json({ authenticated: true });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.auth.check.path, (req, res) => {
    res.json({ authenticated: !!req.session.authenticated });
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.authenticated = false;
    res.json({ success: true });
  });

  // Seed data if empty
  const existingFiles = await storage.getFiles();
  if (existingFiles.length === 0) {
    console.log("Seeding Vault...");
    await storage.createFile({
      fileNumber: "File-001",
      title: "The Shadewood Beast",
      content: "Subject was first sighted in the northern woodlands of [REDACTED]. Witnesses describe a creature of immense height, composed primarily of shifting shadows and decaying bark. \n\n<p>WARNING: Do not approach at night. The creature appears to feed on light sources.</p>\n\nStatus: AT LARGE.",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
      isLocked: false,
      severity: "MEDIUM"
    });
    await storage.createFile({
      fileNumber: "File-002",
      title: "Subject 89: 'The Weeping Signal'",
      content: "An anomalous radio frequency detected on [DATE REDACTED]. Listeners report hearing their own voices from the future screaming in agony. \n\nContainment: Signal jammed. All recordings destroyed.",
      isLocked: true,
      severity: "CRITICAL"
    });
    await storage.createFile({
      fileNumber: "File-003",
      title: "The Hollow Man",
      content: "Entity manifests as a 2D cutout in 3D space. It can slide under doors 1mm thick. \n\nObservation: It creates a sense of overwhelming dread in anyone viewing it directly.",
      imageUrl: "https://images.unsplash.com/photo-1502891676898-a88b13ce709d?w=800&h=600&fit=crop",
      isLocked: false,
      severity: "LOW"
    });
    await storage.createFile({
      fileNumber: "File-004",
      title: "Project OMEGA",
      content: "[DATA EXPUNGED] \n\nAuthorization Level 5 Required.",
      isLocked: true,
      severity: "OMEGA"
    });
    console.log("Seeding complete.");
  }

  app.get(api.files.list.path, async (req, res) => {
    const files = await storage.getFiles();
    res.json(files);
  });

  app.get(api.files.get.path, async (req, res) => {
    const file = await storage.getFile(Number(req.params.id));
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  });

  app.post(api.files.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.files.create.input.parse(req.body);
      const file = await storage.createFile(input);
      res.status(201).json(file);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.files.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.files.update.input.parse(req.body);
      const file = await storage.updateFile(Number(req.params.id), input);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.json(file);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
