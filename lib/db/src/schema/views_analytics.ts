import { pgTable, integer, timestamp, uuid, date } from "drizzle-orm/pg-core";

export const viewsAnalyticsTable = pgTable("views_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  base_id: uuid("base_id").notNull(),
  viewed_at: date("viewed_at").notNull(),
  count: integer("count").default(1).notNull(),
});

export type ViewsAnalytics = typeof viewsAnalyticsTable.$inferSelect;
