import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";

export default class AccountScene extends Component<{},{}> {
    constructor(props) {
        super(props)
        this.state = {
            AccountComponents: []
        }
    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}
