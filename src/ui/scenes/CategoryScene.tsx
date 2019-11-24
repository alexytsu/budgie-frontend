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
                <div>
                    <div className="flex-auto bg-gray-900 p-1 h-20 text-white font-bold rounded-lg">
                        <h1 className="ml-2 text-lg">CATEGORIES</h1>
                    </div>
                    <div className="float-right p-8">
                        <CreateCategory></CreateCategory>
                    </div>
                </div>
                
                
                <ViewAllCategories></ViewAllCategories>                
            </div>
        );
    }
}
