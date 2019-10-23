import * as React from "react";
import { observable, computed } from "mobx";
import ApiHelper from "../util/api-helpers";

class UserStore {
	@observable
	username: string = "Not Logged In";

	@observable
	token: string = "";
}

export default new UserStore();
