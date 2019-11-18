import React = require("react");
import AccountsStore from "../../../stores/AccountSceneStore";
import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import Slider from "react-slick";

export default class AccountList extends React.Component<{}, any>{

    render() {
        const accounts = AccountsStore.accounts
        
        const sliderSettings = {
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
                        <div>{act.name}</div>
                    ))}
                </Slider>
                
                
            </div>
        )
    }
}