import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";


interface ViewCategoriesState {
}


export default class ViewCategories extends Component <{}, ViewCategoriesState>{
    constructor(props) {
        super(props)
        this.state = {
        }
    }

}
