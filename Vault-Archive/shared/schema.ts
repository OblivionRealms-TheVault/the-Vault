import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  fileNumber: text("file_number").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  fileType: text("file_type").default("ANOMALY"), // ANOMALY, ENVIRONMENTAL, DISCOVERY
  imageUrl: text("image_url"),
  recoveredLogs: text("recovered_logs"),
  habitat: text("habitat"),
  behavior: text("behavior"),
  weaknesses: text("weaknesses"),
  isLocked: boolean("is_locked").default(false).notNull(),
  severity: text("severity").default("LOW"), // LOW, MEDIUM, CRITICAL, OMEGA
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true });

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
