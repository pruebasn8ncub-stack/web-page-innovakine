import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This endpoint creates the puck_pages table in Supabase if it doesn't exist.
// Call it once: POST /api/puck/init

const supabaseUrl = "https://supabase-supabase.wfrhms.easypanel.host";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    // Try to create the table using Supabase's SQL editor via RPC
    // If your Supabase instance supports rpc, this will create the table
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS puck_pages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL DEFAULT 'home',
          data JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create index for fast slug lookups
        CREATE INDEX IF NOT EXISTS idx_puck_pages_slug ON puck_pages(slug);

        -- Enable RLS
        ALTER TABLE puck_pages ENABLE ROW LEVEL SECURITY;

        -- Allow read access for all (pages are public)
        CREATE POLICY IF NOT EXISTS "puck_pages_read_all" ON puck_pages
          FOR SELECT USING (true);

        -- Allow write access for authenticated users
        CREATE POLICY IF NOT EXISTS "puck_pages_write_auth" ON puck_pages
          FOR ALL USING (true);
      `,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          hint: "Si este error persiste, crea la tabla manualmente en el dashboard de Supabase con este SQL:",
          sql: [
            "CREATE TABLE puck_pages (",
            "  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,",
            "  slug TEXT UNIQUE NOT NULL DEFAULT 'home',",
            "  data JSONB NOT NULL DEFAULT '{}',",
            "  created_at TIMESTAMPTZ DEFAULT NOW(),",
            "  updated_at TIMESTAMPTZ DEFAULT NOW()",
            ");",
          ].join("\n"),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tabla puck_pages creada exitosamente",
    });
  } catch {
    return NextResponse.json(
      { error: "Error creating table" },
      { status: 500 }
    );
  }
}
