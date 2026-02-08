import DiscountImage from '../../../assets/images/discount-image.svg'
import FormAntd from '../FormAntd/FormAntd'
import style from './DiscountBanner.module.css'


function DiscountBanner(){
    return(
        <section className='container'>
            <div className={style.discountBannerBox}>
                <h2 className={style.discountTitle}>5% off on the first order</h2>
                <div className={style.imgAndForm}>
                    <img className={style.discountImage} src={DiscountImage} alt="Discount Image" />
                   <FormAntd/>
                </div>
            </div>
        </section>
    )
}
export default DiscountBanner