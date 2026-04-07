import { pgTable, text, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const basesTable = pgTable("bases", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  townhall: integer("townhall").notNull(),
  base_type: text("base_type").notNull(),
  image_url: text("image_url").notNull(),
  layout_link: text("layout_link").notNull(),
  description: text("description").notNull(),
  views: integer("views").default(0).notNull(),
  copies: integer("copies").default(0).notNull(),
  report_count: integer("report_count").default(0).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  key_features: text("key_features").array().default([]).notNull(),
  best_against: text("best_against").array().default([]).notNull(),
  win_rate: integer("win_rate").default(80).notNull(),
  difficulty: text("difficulty").default("Medium").notNull(),
  rating_avg: decimal("rating_avg", { precision: 4, scale: 2 }).default("0").notNull(),
  rating_count: integer("rating_count").default(0).notNull(),
  approved: boolean("approved").default(true).notNull(),
  ai_analysis: text("ai_analysis"),
  pro_tips: text("pro_tips").array().default([]).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBaseSchema = createInsertSchema(basesTable).omit({ id: true, created_at: true, updated_at: true });
export type InsertBase = z.infer<typeof insertBaseSchema>;
export type Base = typeof basesTable.$inferSelect;
