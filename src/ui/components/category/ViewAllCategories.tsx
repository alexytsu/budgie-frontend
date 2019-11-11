import * as React from "react";
import { Component } from "react";

import * as moment from "moment";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from "react-dates";

import "../../tailwind.css";
import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";
import Transaction from "../transaction/Transaction";
import { action } from "mobx";
import { observer } from "mobx-react";
import { number } from "prop-types";

interface ViewAllCategoriesState {
    /*categories: any[];*/
    endDate: moment.Moment;
    startDate: moment.Moment;
    calendarFocused: "startDate" | "endDate" | null;
}

@observer
export default class ViewAllCategories extends Component <{}, ViewAllCategoriesState>{
    
    constructor(props) {
        super(props);
        this.state = {
            endDate: moment(),
            startDate: moment().subtract(1, "week"),
            calendarFocused: null,
        };    
    }

    @action
    select(id){
        ApplicationStore.selected = id.target.value
    }

    edit(){
        //view category
    }

    delete = async () => {
        await ApplicationStore.deleteCategory(UserStore.token, ApplicationStore.selected);
    }

    changeHandler = e => {
		const stateCopy = this.state;
		stateCopy[e.target.name] = e.target.value;
		this.setState({ ...stateCopy });
	};

	handleDateChange = ({ startDate, endDate }) => {
		this.setState({ startDate, endDate });
	};

	handleFocusChange = calendarFocused => {
		this.setState({ calendarFocused });
	};

    render() {
        return (
          <div className="flex justify-between bg-white rounded-lg shadow-md p-8">
              <div className="w-full ml-4">
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
                            onClick={()=>this.edit()}>
                            edit
                        </button>
                        <button
                            className="whitespace-pre bg-teal-500 text-white mt-6 py-1 px-4 rounded"
                            onClick={()=>this.delete()}>
                            Delete
                        </button>
                    </div>
                }
              </div>
              <div className="w-full ml-4">
                {ApplicationStore.selected === "" ? null :
                    <div>
                        
                        <div className="text-gray-600 my-2">Expense Period</div>
                        <DateRangePicker
                            startDate={this.state.startDate}
                            startDateId="startDate"
                            endDate={this.state.endDate}
                            endDateId="endDate"
                            onDatesChange={this.handleDateChange}
                            focusedInput={this.state.calendarFocused}
                            onFocusChange={this.handleFocusChange}
                            isOutsideRange={() => false}
                            numberOfMonths={2}
                        ></DateRangePicker>
                        {ApplicationStore.transactions_raw.map((tr_raw) => {
                            const tr = apiHelpers.convertTransaction(tr_raw);
                            const tr_date = moment(tr.date)
                            if (tr.category === Number(ApplicationStore.selected)
                            && (tr_date.isBetween(this.state.startDate, this.state.endDate, null, '[]'))) {                        
                                return (
                                    <div className="my-2">
                                        <Transaction key={tr.id} {...tr}></Transaction>
                                    </div>
                                );
                            }
                        })}
                    </div>
                }
              </div>            
            </div>
            )
    }
}