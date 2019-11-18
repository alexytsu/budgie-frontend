import React = require("react");
import AccountsStore from "../../../stores/AccountSceneStore";

export default class AccountList extends React.Component<{}, any>{

    render() {
        const accounts = AccountsStore.accounts
        
        return(
            <div>
                <select>
                    {accounts.map(act => (
                        <option>act</option>
                    ))}
                </select>
            </div>
        )
    }
}