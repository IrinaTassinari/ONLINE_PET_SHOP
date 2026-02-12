import { useEffect, useState } from "react";
import style from "./ScrollToTopButton.module.css";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      setVisible(y > 200); //делает кнопку видимой, если y > 200
    };

    onScroll();
    /**
     * { passive: true } в addEventListener
      Говорит браузеру: “этот обработчик скролла не будет вызывать preventDefault()”.
      Тогда браузер может скроллить сразу, не ожидая JS, и прокрутка становится плавнее/быстрее.
     */
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll); //Это cleanup-функция useEffect. Она удаляет обработчик при размонтировании компонента (или перед повторным запуском эффекта)
  }, []); //[]  - Эффект запускается один раз при монтировании компонента

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`${style.btn} ${visible ? style.show : ""}`}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

export default ScrollToTopButton;
