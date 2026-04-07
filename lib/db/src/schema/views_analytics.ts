import { pgTable, integer, uuid, date, unique } from "drizzle-orm/pg-core";

export const viewsAnalyticsTable = pgTable("views_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  base_id: uuid("base_id").notNull(),
  viewed_at: date("viewed_at").notNull(),
  count: integer("count").default(1).notNull(),
}, (t) => [
  unique("views_analytics_base_date_unique").on(t.base_id, t.viewed_at),
]);

export type ViewsAnalytics = typeof viewsAnalyticsTable.$inferSelect;
