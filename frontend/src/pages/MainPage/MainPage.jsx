import CategoriesComp from "../../components/layout/CategoriesComp/CategoriesComp"
import DiscountBanner from "../../components/layout/DiscountBanner/DiscountBanner"
import MainBanner from "../../components/layout/MainBanner/MainBanner"


function MainPage(){
    return(
        <div>
           <MainBanner/>
           <CategoriesComp/>
           <DiscountBanner/>
        </div>
    )
}
export default MainPage