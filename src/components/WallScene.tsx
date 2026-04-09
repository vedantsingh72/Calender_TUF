import type { CSSProperties, ReactNode } from "react";
import styles from "./WallScene.module.css";
import { cssBackgroundUrl } from "@/lib/cssEscape";

type WallSceneProps = {
  dark: boolean;
  heroBackdropUrl?: string;
  children: ReactNode;
};

export function WallScene({ dark, heroBackdropUrl, children }: WallSceneProps) {
  const backdropStyle: CSSProperties | undefined =
    dark && heroBackdropUrl
      ? {
          ["--hero-bg-image" as string]: cssBackgroundUrl(heroBackdropUrl),
        }
      : undefined;

  return (
    <div className={`${styles.wall} ${dark ? styles.dark : ""}`} style={backdropStyle}>
      <div className={styles.nail} />
      <div className={styles.hangerLine} />
      {children}
    </div>
  );
}
