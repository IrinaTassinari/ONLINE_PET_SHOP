import { Link } from "react-router-dom";
import NotFoundImg from '../../assets/images/404.svg'
import style from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <section className={`container ${style.wrapperNotFound}`}>
      <img className={style.codeNotFound} src={NotFoundImg} alt="Not Found Page" />
      <h2 className={style.titleNotFound}>Page Not Found</h2>
      <p className={style.textNotFound}>
        We&apos;re sorry, the page you requested could not be found. <br /> Please go back to
        the homepage.
      </p>
      <Link to="/" className={style.homeBtn}>
        Go Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
