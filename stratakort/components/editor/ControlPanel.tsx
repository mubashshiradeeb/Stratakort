"use client";

import { useState } from "react";
import {
  MapPin,
  Palette as PaletteIcon,
  LayoutTemplate,
  Type as TypeIcon,
  Layers as LayersIcon,
  Locate,
  Route as RouteIcon,
  SlidersHorizontal,
} from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { LocationPanel } from "./LocationPanel";
import { StyleSelector } from "./StyleSelector";
import { PosterSettingsControls } from "./PosterSettingsControls";
import { ColorControls } from "./ColorControls";
import { EffectsControls } from "./EffectsControls";
import { TypographyControls } from "./TypographyControls";
import { LayerControls } from "./LayerControls";
import { MarkerControls } from "./MarkerControls";
import { RouteControls } from "./RouteControls";
import { SettingsControls } from "./SettingsControls";
import { CurrentSettingsSummary } from "./CurrentSettingsSummary";
import { DownloadBar } from "./DownloadBar";

function PanelBody() {
  return (
    <>
      <div className="thin-scroll flex-1 overflow-y-auto">
        <Accordion defaultOpen="theme">
          <AccordionItem id="location" title="Location" icon={Locate}>
            <LocationPanel />
          </AccordionItem>
          <AccordionItem id="theme" title="Theme" icon={PaletteIcon}>
            <StyleSelector />
          </AccordionItem>
          <AccordionItem id="layout" title="Layout" icon={LayoutTemplate}>
            <PosterSettingsControls />
          </AccordionItem>
          <AccordionItem id="style" title="Style" icon={SlidersHorizontal}>
            <div className="space-y-6">
              <div>
                <div className="eyebrow mb-3">Typography</div>
                <TypographyControls />
              </div>
              <div className="border-t border-line pt-5">
                <div className="eyebrow mb-3">Colors</div>
                <ColorControls />
              </div>
              <div className="border-t border-line pt-5">
                <div className="eyebrow mb-3">Effects</div>
                <EffectsControls />
              </div>
            </div>
          </AccordionItem>
          <AccordionItem id="layers" title="Layers" icon={LayersIcon}>
            <LayerControls />
          </AccordionItem>
          <AccordionItem id="markers" title="Markers" icon={MapPin}>
            <MarkerControls />
          </AccordionItem>
          <AccordionItem id="routes" title="Routes" icon={RouteIcon}>
            <RouteControls />
          </AccordionItem>
          <AccordionItem id="settings" title="Settings" icon={SlidersHorizontal}>
            <SettingsControls />
          </AccordionItem>
        </Accordion>
      </div>
      <CurrentSettingsSummary />
      <DownloadBar />
    </>
  );
}

export function ControlPanel() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop panel */}
      <aside className="hidden md:flex md:w-[380px] md:shrink-0 md:flex-col md:border-l md:border-line md:bg-paper">
        <div className="border-b border-line px-5 py-4">
          <span className="eyebrow">Editor</span>
        </div>
        <PanelBody />
      </aside>

      {/* Mobile bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-md border-t border-line bg-paper shadow-poster transition-[height] duration-300 ease-out md:hidden ${
          mobileOpen ? "h-[78vh]" : "h-auto"
        }`}
      >
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center justify-center py-2.5"
          aria-label={mobileOpen ? "Collapse editor panel" : "Expand editor panel"}
        >
          <span className="h-1 w-9 rounded-full bg-line-strong" />
        </button>
        {mobileOpen ? (
          <PanelBody />
        ) : (
          <DownloadBar />
        )}
      </div>
    </>
  );
}
