import axios from 'axios';

import { API_URL } from "./config";

export const loginUser = async (username: string, password: string) => {
  return await axios.post(API_URL + '/login/', {username, password});
}