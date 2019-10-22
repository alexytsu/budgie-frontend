import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import "../tailwind.css";
import UserStore from "../../stores/UserStore";

@observer
export default class ProfileScene extends Component {
  render() {
    return (
      <div className="bg-gray-200 h-screen w-screen">
        <div className="container mx-auto h-full flex justify-center">
          <h1 className="font-sans text-3xl font-semibold mt-6 mb-8 text-gray-800 text-center">
            Username
            {UserStore.username}
          </h1>
        </div>
      </div>
    );
  }
}
