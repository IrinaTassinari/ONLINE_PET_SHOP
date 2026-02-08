import Contacts from "../Contacts/Contacts";
import style from "./Footer.module.css";

function Footer() {
  return (
    <footer className={style.footerContainer}>
      <div className="container">
        <Contacts />
        <div className={style.mapWrapper}>
          <iframe
            className={style.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.2316267311917!2d13.401903676819796!3d52.51114713688466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e27db4748a5%3A0x1d538c01013c2c7!2sWallstra%C3%9Fe%209-13%2C%2010179%20Berlin!5e0!3m2!1sen!2sde!4v1770479788005!5m2!1sen!2sde"
            title="Wallstrasse Berlin Map"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </footer>
  );
}
export default Footer;
