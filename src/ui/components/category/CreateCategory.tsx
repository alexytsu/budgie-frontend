import * as React from "react";
import {Component} from "react";

import "../../tailwind.css";
import { ENETDOWN } from "constants";
import apiHelpers from "../../../util/api-helpers";

interface CreateCategoryState {
  category: string;
}

export default class CreateCategory extends Component<{},CreateCategoryState> {

  constructor(props) {
    super(props);

    this.state = {
      category: "",
    };

  }

  onInputChanged = (event) => {
    this.setState({category: event.target.value});
  }

  submit = async () => {
    await apiHelpers.loginUser("joe", "password");
    await apiHelpers.createCategory(this.state.category);
  }

  render() {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <label htmlFor="category">Category Name</label>
        <input
          id="category"
          placeholder="Category"
          value={this.state.category}
          onChange={(event)=>this.onInputChanged(event)}
          className="mb-8"
        />
        <button 
        onClick={this.submit}
        className="bg-teal-500 text-white py-2 px-4 rounded">Create Category
        </button>
      </div>
    )
  }

} 