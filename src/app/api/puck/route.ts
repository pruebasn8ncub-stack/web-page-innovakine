import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
const supabaseUrl = "https://supabase-supabase.wfrhms.easypanel.host";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/puck?page=home — Load saved page data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "home";

  try {
    const { data, error } = await supabase
      .from("puck_pages")
      .select("data")
      .eq("slug", page)
      .single();

    if (error) {
      // If table doesn't exist or no data, return empty
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(data?.data || null);
  } catch {
    return NextResponse.json(
      { error: "Error loading page data" },
      { status: 500 }
    );
  }
}

// POST /api/puck — Save page data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page = "home", data } = body;

    if (!data) {
      return NextResponse.json(
        { error: "No data provided" },
        { status: 400 }
      );
    }

    // Upsert: insert or update the page data
    const { error } = await supabase
      .from("puck_pages")
      .upsert(
        {
          slug: page,
          data: data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Error saving: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
