import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schema";

export default defineConfig({
  name: "neretva-rafting",
  title: "Neretva Rafting",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eg9nka5c",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
