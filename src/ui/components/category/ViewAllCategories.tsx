import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";
import Transaction from "../transaction/Transaction";
import { action } from "mobx";
import { observer } from "mobx-react";
import { number } from "prop-types";
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
        console.log(id.target.value + "selected")
        ApplicationStore.selected = id.target.value
        console.log("Applicationstore.selected is " + ApplicationStore.selected)
    }

    view(){
        //view category
    }

    delete = async () => {
        await ApplicationStore.deleteCategory(UserStore.token, ApplicationStore.selected);
    }

    render() {
        
        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            <label className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-left" htmlFor="category">
                Categories
            </label>
            {ApplicationStore.categories_raw.map((cat) => {
                return (
                    <div>{cat.operation === "IN" ? 
                        <button value={cat.id}
                                onClick={(value)=>this.select(value)}
                                className="bg-teal-500 focus:bg-red-500 text-white mt-1 py-1 px-4 rounded">
                            {cat.name}
                        </button> : 
                        <button value={cat.id}
                            onClick={(value)=>this.select(value)}
                            className="bg-orange-500 focus:bg-red-500 text-white mt-1 py-1 px-4 rounded">
                        {cat.name}
                </button>}
                    </div>
                )
            })}
            {ApplicationStore.selected === "" ? null :
                <div>
                    <button
                        className="whitespace-pre bg-teal-500 text-white mt-6 py-1 px-4 mr-4 rounded"
                        onClick={()=>this.view()}>
                        View
                    </button>
                    <button
                        className="whitespace-pre bg-teal-500 text-white mt-6 py-1 px-4 rounded"
                        onClick={()=>this.delete()}>
                        Delete
                    </button>
                </div>}
            {ApplicationStore.selected === "" ? null :
                ApplicationStore.transactions_raw.map((tr_raw) => {
                    const tr = apiHelpers.convertTransaction(tr_raw);
                    if (tr.category === Number(ApplicationStore.selected)) {
                        return (
							<div className="my-2">
								<Transaction key={tr.id} {...tr}></Transaction>
							</div>
						);
                    }
						
                })

            }
          </div>
        )
    }
}
/*
headers: {
					Authorization: "Token " + token
				}
*/