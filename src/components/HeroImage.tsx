import Image from "next/image";
import styles from "./HeroImage.module.css";

type HeroImageProps = {
  imageUrl: string;
  month: string;
  year: number;
};

export function HeroImage({ imageUrl, month, year }: HeroImageProps) {
  return (
    <div className={styles.heroImage} role="img" aria-label={`${month} ${year} hero`}>
      <Image
        key={imageUrl}
        className={styles.heroPhoto}
        src={imageUrl}
        alt=""
        fill
        sizes="(max-width: 640px) 98vw, 460px"
        priority
      />
      <div className={styles.heroGradient} aria-hidden />
      <div className={styles.overlay}>
        <p>{year}</p>
        <h2>{month}</h2>
      </div>
    </div>
  );
}
