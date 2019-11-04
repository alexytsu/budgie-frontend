import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";
import { action } from "mobx";
import { observer } from "mobx-react";
/*
interface ViewAllCategoriesState {
    categories: any[];
}*/

@observer
export default class ViewAllCategories extends Component <{} /*ViewAllCategoriesState*/>{
    /*
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };    
    }*/

    @action
    select(id){
        /*this.setState({selected: id.target.value})*/
        console.log(id.target.value + "selected")
        ApplicationStore.selected = id.target.value
        console.log("Applicationstore.selected is " + ApplicationStore.selected)
    }

    delete = async () => {
        await ApplicationStore.deleteCategory(UserStore.token, ApplicationStore.selected);
        //this.forceUpdate()
    }

    render() {
        
        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            <label className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-left" htmlFor="category">
                Categories
            </label>
            {ApplicationStore.categories_raw.map((cat) => {
                return (
                    <div>{
                        <button value={cat.id}
                                onClick={(value)=>this.select(value)}
                                className="bg-teal-500 focus:bg-red-500 text-white mt-1 py-1 px-4 rounded">
                            {cat.name}
                        </button>}
                    </div>
                )
            })}
            {ApplicationStore.selected === "" ? null :
                <button
                    className="whitespace-pre bg-teal-500 text-white mt-6 ml-2 py-1 px-4 rounded"
                    onClick={()=>this.delete()}>
                    Delete
                </button>}
          </div>
        )
    }
}
/*
headers: {
					Authorization: "Token " + token
				}
*/