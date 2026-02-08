import { useNavigate } from 'react-router-dom'
import imgBanner from '../../../assets/images/main-banner.jpg'
import Button from '../../ui/Button/Button'
import style from './MainBanner.module.css'

function MainBanner(){
    const navigate = useNavigate()

    return(
                <div className={style.mainBannerBox}>
                    <img src={imgBanner} alt="Main Banner" />
                    <div className={style.bannerContent}>
                        <h2 className={style.h2Banner}>Amazing Discounts <br /> on Pets Products!</h2>
                        <Button onClick={() => navigate('/sales')}>Check out</Button>
                    </div>
                </div>
            
    )
}
export default MainBanner