"use client";

import { HangingCalendar } from "@/components/HangingCalendar";
import { WallScene } from "@/components/WallScene";
import { useWallCalendar } from "@/hooks/useWallCalendar";

export default function Home() {
  const calendar = useWallCalendar();

  return (
    <WallScene
      dark={calendar.isDarkTheme}
      heroBackdropUrl={calendar.isDarkTheme ? calendar.heroImageUrl : undefined}
    >
      <HangingCalendar {...calendar} />
    </WallScene>
  );
}
