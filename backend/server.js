// TEMPORARY: PostgreSQL-only mode (MongoDB disabled)
// This version runs without MongoDB to ensure stability
// MongoDB can be re-enabled later when credentials are ready

import "./server-postgres-only.js";

export { default } from "./server-postgres-only.js";
