"use client";

import { MapInstanceProvider } from "@/lib/mapContext";
import { EditorTopBar } from "./EditorTopBar";
import { EditorCanvas } from "./EditorCanvas";
import { ControlPanel } from "./ControlPanel";

export function MapEditor() {
  return (
    <MapInstanceProvider>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-paper">
        <EditorTopBar />
        <div className="relative flex min-h-0 flex-1">
          <div className="relative min-w-0 flex-1">
            <EditorCanvas />
          </div>
          <ControlPanel />
        </div>
      </div>
    </MapInstanceProvider>
  );
}
