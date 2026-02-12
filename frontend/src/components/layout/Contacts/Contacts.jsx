import style from './Contacts.module.css'
import instagramIcon from '../../../assets/icons/instagram-icon.svg'
import whatsAppIcon from '../../../assets/icons/whatsapp-icon.svg'

function Contacts(){
    return(
        <section className={style.contactsBox}>
            <h2 className={style.contactsTitle}>Contacts</h2>
            <div className={style.phoneAndSocials}>
                <div className={style.phoneBox}>
                    <p>Phone</p>
                    <h4>+49 30 915-88492</h4>
                </div>
                <div className={style.socialsBox}>
                    <p>Socials</p>
                    <div className={style.socialsCont}>
                        <a href="#">
                            <img className={style.socialIcon} src={instagramIcon} alt="Instagram" />
                        </a>
                        <a href="#">
                            <img className={style.socialIcon} src={whatsAppIcon} alt="WhatsApp" />
                        </a>
                    </div>   
                </div>
            </div>
            <div className={style.addressAndHours}>
                <div className={style.addressBox}>
                    <p>Address</p>
                    <h4>Wallstraẞe 9-13, 10179 Berlin, Deutschland</h4>
                </div>
                <div className={style.hoursBox}>
                    <p>Working Hours</p>
                    <h4>24 hours a day</h4>
                </div>
            </div>
        </section>
    )
}
export default Contacts