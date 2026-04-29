"use client";

import { SettingsControls } from "@/components/ui/SettingsControls/SettingsControls";

export function SetupSettings() {
  return (
    <div className="absolute top-8 right-8 z-50">
      <SettingsControls variant="solid" showThemeToggle={true} />
    </div>
  );
}
