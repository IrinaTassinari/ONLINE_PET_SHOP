import { useEffect, useState } from "react";
import styles from "./ScrollToTopButton.module.css";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      setVisible(y > 200);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`${styles.btn} ${visible ? styles.show : ""}`}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

export default ScrollToTopButton;
