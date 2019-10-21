import * as React from "react";
import { observable, computed } from "mobx";
import { loginUser } from "../util/api-helpers";

class UserState {

  private _token: string = "";
  private username = "joe";
  private password = "password";


  @computed
  get token() {
    if (this._token === "") {
        const resp = loginUser(this.username, this.password);
        resp.then( bearerToken => this._token = bearerToken);
    }

    return this._token;
  }
}