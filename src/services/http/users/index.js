import axios from "axios";
import { CONST } from "../../../config";

export const getUserById = (id, providerId = null) => {
  if (!id || typeof id !== "string") {
    throw new Error("id must be a valid string");
  }

  return axios.get(`${CONST.uri.resources.USERS}/${id}`, {
    params: providerId ? { providerId } : {},
    withCredentials: true,
  });
};

export const editUser = (data) => {
  // if (!data.name && !data.phone && !data.institution) {
  //   throw "Enter the details";
  // }

  return axios.put(CONST.uri.resources.EDIT_USERS, data, {  
    withCredentials: true, 
  });
};
