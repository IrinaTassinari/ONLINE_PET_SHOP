import CategoriesComp from "../../components/layout/CategoriesComp/CategoriesComp"
import DiscountBanner from "../../components/layout/DiscountBanner/DiscountBanner"
import MainBanner from "../../components/layout/MainBanner/MainBanner"
import SaleBanner from '../../components/layout/SaleBanner/SaleBanner'

function MainPage(){
    return(
        <div>
           <MainBanner/>
           <CategoriesComp/>
           <DiscountBanner/>
           <SaleBanner/>
        </div>
    )
}
export default MainPage