import styles from "../styles/common.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <span className={styles.footerBrand}>STORM Blog</span>
      <span className={styles.footerMeta}>est. 2026</span>
    </div>
  );
}
