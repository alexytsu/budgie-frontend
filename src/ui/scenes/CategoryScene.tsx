import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";
import { userInfo } from "os";
import CreateCategory from "../components/category/CreateCategory";
import ViewAllCategories from "../components/category/ViewAllCategories";

export default class CategoryScene extends Component<{},{}> {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>
                {/* <label className="text-xl font-bold">CATEGORIES SCENE</label> */}
                <div className="flex float-right">
                    <CreateCategory></CreateCategory>
                </div>
                <div className="overflow-auto h-full w-3/4 float-left">
                    <ViewAllCategories></ViewAllCategories>
                </div>
                
            </div>
        );
    }
}
