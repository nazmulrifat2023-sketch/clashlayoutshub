import { pgTable, integer, timestamp, uuid, date } from "drizzle-orm/pg-core";

export const copiesAnalyticsTable = pgTable("copies_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  base_id: uuid("base_id").notNull(),
  copied_at: date("copied_at").notNull(),
  count: integer("count").default(1).notNull(),
});

export type CopiesAnalytics = typeof copiesAnalyticsTable.$inferSelect;
