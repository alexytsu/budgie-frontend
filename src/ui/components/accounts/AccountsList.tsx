import React = require("react");
import AccountsStore from "../../../stores/AccountSceneStore";
import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import Slider from "react-slick";

export default class AccountList extends React.Component<{}, any>{
    
    render() {
        const accounts = AccountsStore.accounts
        
        const sliderSettings = {
            dots:true,
            arrows: true,
            
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,

			afterChange: function(index) {
                console.log(index)
				AccountsStore.changeSelected(index)
			}
		};
        
        return(
            <div>
                <Slider {...sliderSettings}>
                    {accounts.map(act => (
                        <div key={act.id} className="font-sans font-bold text-center">{act.name}</div>
                    ))}
                </Slider>
                
                
            </div>
        )
    }
}