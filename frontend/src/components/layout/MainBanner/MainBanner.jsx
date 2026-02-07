import imgBanner from '../../../assets/images/main-banner.jpg'
import Button from '../../ui/Button/Button'
import style from './MainBanner.module.css'

function MainBanner(){
    return(
            
                <div className={style.mainBannerBox}>
                    <img src={imgBanner} alt="Main Banner" />
                    <div className={style.bannerContent}>
                        <h2 className={style.h2Banner}>Amazing Discounts <br /> on Pets Products!</h2>
                        <Button>Check out</Button>
                    </div>
                </div>
            
    )
}
export default MainBanner