import axios from "axios";
import { getCookie } from "tiny-cookie";
import * as messageConstants from "../constants/messageConstants";
import * as staffsConstants from "../constants/staffsConstants";

export const getStaffsList = () => dispatch =>
  axios
    .get("http://localhost:3001/staffs", {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status, data: staffs } = resp;
      if (status === 200) {
        dispatch({
          type: staffsConstants.GET_STAFFS_LIST_SUCCEED,
          payload: staffs
        });
      } else {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Failed getting staffs list."
          }
        });
        throw new Error(
          "Something went wrong when getting staffs list, status ",
          status
        );
      }
    })
    .catch(err => {
      dispatch({
        type: messageConstants.OPEN_MESSAGE,
        payload: {
          messageType: "error",
          message: "Failed getting staffs list."
        }
      });
      console.log(err);
    });

