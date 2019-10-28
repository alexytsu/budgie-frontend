import * as React from "react";
import { Component } from "react";

import "../../tailwind.css";
import apiHelpers from "../../../util/api-helpers";
import { observer } from "mobx-react";
import UserStore from "../../../stores/UserStore";

interface CreateCategoryState {
  category: string;
  warning: boolean;
}

@observer
export default class CreateCategory extends Component<{},CreateCategoryState> {

  constructor(props) {
    super(props);

    this.state = {
      category: "",
      warning: false,
    };

  }

  onInputChanged = (event) => {
    this.setState({category: event.target.value});
  }

  submit = async () => {
    if (this.state.category.length < 1){
      this.setState({warning: true})
    } else {
      this.setState({warning: false})
      await apiHelpers.loginUser("joe", "password");
      await apiHelpers.createCategory(UserStore.token, this.state.category);
    }
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
        {this.state.warning === true ? <p className="">Please enter a category name.</p> : null}
        
      </div>
    )
  }

} 
