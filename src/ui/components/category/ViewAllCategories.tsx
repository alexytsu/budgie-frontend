import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";

interface ViewAllCategoriesState {
    categories: any[];
    selected: string;
}

export default class ViewAllCategories extends Component <{}, ViewAllCategoriesState>{
    
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            selected: ""
        };    
    }

    async componentDidMount() {
        await apiHelpers.loginUser("joe", "password");
        const response = await apiHelpers.getAllCategories(UserStore.token);
        this.setState({categories: response})
    }

    select(id){
        this.setState({selected: id.target.value})
    }

    delete = async () => {
        await apiHelpers.loginUser("joe", "password");
        await apiHelpers.deleteCategory(UserStore.token, this.state.selected);

        let i;
        let index;
        for (i = 0; i < this.state.categories.length; i++) {
            if (this.state.categories[i].id == this.state.selected){
                index = i;
            }
        }
        let prev = this.state.categories;
        prev.splice(index, 1)
        this.setState({categories: prev})
    }

    render() {
        
        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            <label className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-left" htmlFor="category">Categories</label>
            {this.state.categories.map((cat) => {
                return (
                    <div>{
                        <button value={cat.id}
                                onClick={(value)=>this.select(value)}
                                className="bg-teal-500 focus:bg-red-500 text-white mt-1 py-1 px-4 rounded">
                            {cat.name}
                        </button>}
                    </div>
                )
            }
            )}
            {this.state.selected === "" ? null :
                <button
                    className="whitespace-pre bg-teal-500 text-white mt-3 py-1 px-4 rounded"
                    onClick={()=>this.delete()}>
                    Delete
                </button>}
          </div>
        )
    }
}
