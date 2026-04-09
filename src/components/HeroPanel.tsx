import styles from "./HeroPanel.module.css";
import { HeroImage } from "./HeroImage";

type HeroPanelProps = {
  month: string;
  year: number;
  imageUrl: string;
};

export function HeroPanel({ month, year, imageUrl }: HeroPanelProps) {
  return (
    <section className={styles.heroPanel}>
      <div className={styles.rings} />
      <HeroImage imageUrl={imageUrl} month={month} year={year} />
      <p className={styles.caption}>Pinned memories and plans for this month.</p>
    </section>
  );
}
