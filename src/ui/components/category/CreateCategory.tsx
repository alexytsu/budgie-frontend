import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import apiHelpers from "../../../util/api-helpers";

interface CreateCategoryState {
  category: string;
  warning: boolean;
  created: boolean;
}

export default class CreateCategory extends Component<{},CreateCategoryState> {

  constructor(props) {
    super(props);

    this.state = {
      category: "",
      warning: false,
      created: false,
    };
  }

  onInputChanged = (event) => {
    this.setState({category: event.target.value});
  }

  submit = async () => {
    if (this.state.category.length < 1){
      this.setState({warning: true})
      this.setState({created: false})
    } else {
      this.setState({warning: false})
      await apiHelpers.loginUser("joe", "password");
      await apiHelpers.createCategory(this.state.category);
      this.setState({created: true})
    }
  }

  render() {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="font-sans text-5xl font-semibold mt-6 mb-8 text-gray-800 text-left">Create a Category</h1>
        <label htmlFor="category">Category Name:</label>
        <input id="category"
              placeholder="Category"
              value={this.state.category}
              onChange={(event)=>this.onInputChanged(event)}
              className="mb-8 pl-6"/>
        <button onClick={this.submit}
                className="bg-teal-500 text-white py-2 px-4 rounded">
          Create Category
        </button>
        {this.state.warning === true ? <p className="text-red-600">Please enter a category name.</p> : null}
        {this.state.created === true? <p>Transaction created</p> : null}
      </div>
    )
  }
} 
