import { pgTable, text, integer, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  townhall: integer("townhall"),
  base_type: text("base_type"),
  layout_link: text("layout_link").notNull(),
  description: text("description"),
  image_url: text("image_url"),
  status: text("status").default("pending").notNull(),
  admin_notes: text("admin_notes"),
  submitter_user_id: uuid("submitter_user_id"),
  submitted_at: timestamp("submitted_at").defaultNow().notNull(),
}, (t) => [index("submissions_user_id_idx").on(t.submitter_user_id)]);

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({ id: true, submitted_at: true });
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
