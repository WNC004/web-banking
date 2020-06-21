import axios from "axios";
import { getCookie } from "tiny-cookie";
import * as debtsConstants from "../constants/debtConstants";
import * as messageConstants from "../constants/messageConstants";

export const getDebtsList = customerId => dispatch =>
  axios
    .get(`http://localhost:3001/debts/${customerId}`, {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status, data: debts } = resp;
      if (status === 200) {
        dispatch({
          type: debtsConstants.GET_DEBTS_OWNER_LIST_SUCCEED,
          payload: debts
        });
      } else {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Sorry, failed getting contacts list"
          }
        });
        throw new Error(
          "Something went wrong when getting contacts list, status ",
          status
        );
      }
    })
    .catch(err => {
      dispatch({
        type: messageConstants.OPEN_MESSAGE,
        payload: {
          messageType: "error",
          message: "Sorry, failed getting contacts list"
        }
      });
      console.log(err);
    });

export const getAllAccount = () =>dispatch =>
  axios
    .get(`http://localhost:3001/pay-accs`, {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status, data: debts } = resp;
      if (status === 200) {
        dispatch({
          type: debtsConstants.GET_ALL_ACCOUNT,
          payload: debts
        });
      } else {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Sorry, failed getting contacts list"
          }
        });
        throw new Error(
          "Something went wrong when getting contacts list, status ",
          status
        );
      }
    })
    .catch(err => {
      dispatch({
        type: messageConstants.OPEN_MESSAGE,
        payload: {
          messageType: "error",
          message: "Sorry, failed getting contacts list"
        }
      });
      console.log(err);
    });

    export const getDebtsListForOther = customerId => dispatch =>
    axios
      .get(`http://localhost:3001/debts/other/${customerId}`, {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data: debts } = resp;
        if (status === 200) {
          dispatch({
            type: debtsConstants.GET_DEBTS_OTHER_LIST_SUCCEED,
            payload: debts
          });
        } else {
          dispatch({
            type: messageConstants.OPEN_MESSAGE,
            payload: {
              messageType: "error",
              message: "Sorry, failed getting contacts list"
            }
          });
          throw new Error(
            "Something went wrong when getting contacts list, status ",
            status
          );
        }
      })
      .catch(err => {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Sorry, failed getting contacts list"
          }
        });
        console.log(err);
      });

export const handleCreateDebt = (
  account,
  msg,
  amount,
  reload
) => dispatch => {
    return axios
      .post(
        "http://localhost:3001/debt",
        {
          account,
          msg,
          amount
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      )
      .then(resp => {
        const { status } = resp;
        const msg = resp.data.message;
        console.log(status);
        console.log(msg);
        if (status === 201) {
          dispatch({
            type: debtsConstants.HANDLE_CREATE_DEBT_SUCCEED,
            payload: {
              reload: !reload,
              messageType: "success",
              isMessageOpen: true,
              message: "Successfully created new debt"
            }
          });
        } else {
          dispatch({
            type: messageConstants.OPEN_MESSAGE,
            payload: {
              messageType: "error",
              isMessageOpen: true,
              message: "Sorry, failed creating new debt"
            }
          });
          // throw new Error(
          //   "Something went wrong when creating new debt, status ",
          //   status
          // );
        }
      })
      .catch(err => {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            isMessageOpen: true,
            message: "Sorry, failed creating new contact"
          }
        });
        console.log(err);
      });
};

export const handleInputChange = e => ({
  type: debtsConstants.HANDLE_INPUT_CHANGE,
  payload: {
    name: e.target.name,
    value: e.target.value
  }
});

export const closeMessage = () => ({
  type: messageConstants.CLOSE_MESSAGE
});
