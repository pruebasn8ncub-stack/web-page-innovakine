"use client";

import { useEffect, useState, useCallback } from "react";
import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/puck/config";
import { supabase } from "@/lib/supabase";

// Default page data with InnovaKine's standard layout
const defaultData: Data = {
  root: { props: {} },
  content: [
    { type: "HeroBlock", props: { id: "hero-1" } },
    { type: "AboutBlock", props: { id: "about-1" } },
    { type: "ServicesBlock", props: { id: "services-1" } },
    { type: "TeamBlock", props: { id: "team-1" } },
    { type: "ReviewsBlock", props: { id: "reviews-1" } },
    { type: "LocationBlock", props: { id: "location-1" } },
    { type: "FAQBlock", props: { id: "faq-1" } },
    { type: "BookingFormBlock", props: { id: "booking-1" } },
    { type: "InstagramFeedBlock", props: { id: "instagram-1" } },
    { type: "FooterBlock", props: { id: "footer-1" } },
  ],
};

export default function EditorPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pageData, setPageData] = useState<Data>(defaultData);
  const [saveStatus, setSaveStatus] = useState<string>("");

  // Check admin auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAdmin(false);
          return;
        }

        // Check admin role in profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setIsAdmin(profile?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    }
    checkAuth();
  }, []);

  // Load saved page data
  useEffect(() => {
    async function loadPageData() {
      try {
        const res = await fetch("/api/puck?page=home");
        if (res.ok) {
          const data = await res.json();
          if (data?.content) {
            setPageData(data);
          }
        }
      } catch {
        console.log("No saved page data found, using defaults");
      }
    }
    if (isAdmin) loadPageData();
  }, [isAdmin]);

  // Save handler
  const handleSave = useCallback(async (data: Data) => {
    setSaveStatus("Guardando...");
    try {
      const res = await fetch("/api/puck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "home", data }),
      });

      if (res.ok) {
        setSaveStatus("✅ ¡Guardado exitosamente!");
      } else {
        const err = await res.json();
        setSaveStatus(`❌ Error: ${err.error || "No se pudo guardar"}`);
      }
    } catch {
      setSaveStatus("❌ Error de conexión");
    }

    setTimeout(() => setSaveStatus(""), 3000);
  }, []);

  // Loading state
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Unauthorized
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">
            Solo los administradores pueden acceder al editor visual.
            Inicia sesión con tu cuenta de administrador.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition"
          >
            ← Volver al sitio
          </a>
        </div>
      </div>
    );
  }

  // Editor
  return (
    <div className="relative">
      {saveStatus && (
        <div className="fixed top-4 right-4 z-[9999] px-4 py-2 bg-gray-900 text-white rounded-lg shadow-lg font-medium text-sm">
          {saveStatus}
        </div>
      )}
      <Puck
        config={puckConfig}
        data={pageData}
        onPublish={handleSave}
        headerTitle="InnovaKine — Editor Visual"
      />
    </div>
  );
}
