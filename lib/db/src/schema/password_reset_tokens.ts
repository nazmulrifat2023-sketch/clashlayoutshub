import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const passwordResetTokensTable = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expires_at: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
