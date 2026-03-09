"use client";

import { Render, Data } from "@measured/puck";
import { puckConfig } from "@/puck/config";

interface PuckRenderProps {
  data: Data;
}

/**
 * PuckRender: Renders a page using Puck's saved configuration data.
 * This component takes the JSON data saved by the Puck editor and renders
 * the corresponding React components in the correct order and layout.
 *
 * Usage:
 *   <PuckRender data={savedPageData} />
 */
export function PuckRender({ data }: PuckRenderProps) {
  return <Render config={puckConfig} data={data} />;
}
