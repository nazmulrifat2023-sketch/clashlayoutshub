import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";

export const savedBasesTable = pgTable(
  "saved_bases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    base_id: uuid("base_id").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("saved_bases_user_base_unique").on(t.user_id, t.base_id)],
);

export type SavedBase = typeof savedBasesTable.$inferSelect;
