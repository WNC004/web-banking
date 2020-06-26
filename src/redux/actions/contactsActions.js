import axios from "axios";
import { getCookie } from "tiny-cookie";
import * as contactsConstants from "../constants/contactsConstants";
import * as messageConstants from "../constants/messageConstants";

export const getContactsList = customerId => dispatch =>
  axios
    .get(`http://localhost:3001/contacts/${customerId}`, {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status, data: contacts } = resp;
      if (status === 200) {
        dispatch({
          type: contactsConstants.GET_CONTACTS_LIST_SUCCEED,
          payload: contacts
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

export const handleCreateContact = (
  customerId,
  toAccNumber,
  toNickName,
  reload
) => dispatch => {
  if (toNickName.trim() === "")
    return axios
      .get(`http://localhost:3001/pay-acc/${toAccNumber}`, {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data } = resp;
        if (status === 200) {
          axios
            .post(
              "http://localhost:3001/contact",
              {
                customerId,
                toAccNumber,
                toNickName: data[0].clientName
              },
              {
                headers: {
                  "x-access-token": getCookie("access_token")
                }
              }
            )
            .then(resp => {
              const { status } = resp;
              if (status === 201) {
                dispatch({
                  type: contactsConstants.HANDLE_CREATE_CONTACT_SUCCEED,
                  payload: {
                    reload: !reload,
                    messageType: "success",
                    isMessageOpen: true,
                    message: "Successfully created new contact"
                  }
                });
              } else {
                dispatch({
                  type: messageConstants.OPEN_MESSAGE,
                  payload: {
                    messageType: "error",
                    message: "Sorry, failed creating new contact"
                  }
                });
                throw new Error(
                  "Something went wrong when creating new contact, status ",
                  status
                );
              }
            })
            .catch(err => {
              dispatch({
                type: messageConstants.OPEN_MESSAGE,
                payload: {
                  messageType: "error",
                  message: "Sorry, failed creating new contact"
                }
              });
              console.log(err);
            });
        } else {
          dispatch({
            type: messageConstants.OPEN_MESSAGE,
            payload: {
              messageType: "error",
              message: "Sorry, failed getting username for this account"
            }
          });
          throw new Error(
            "Something went wrong when getting username for this account, status ",
            status
          );
        }
      })
      .catch(err => {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Sorry, failed getting username for this account"
          }
        });
        console.log(err);
      });
  else
    return axios
      .post(
        "http://localhost:3001/contact",
        {
          customerId,
          toAccNumber,
          toNickName
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      )
      .then(resp => {
        const { status } = resp;
        if (status === 201) {
          dispatch({
            type: contactsConstants.HANDLE_CREATE_CONTACT_SUCCEED,
            payload: {
              reload: !reload,
              messageType: "success",
              isMessageOpen: true,
              message: "Successfully created new contact"
            }
          });
        } else {
          dispatch({
            type: messageConstants.OPEN_MESSAGE,
            payload: {
              messageType: "error",
              message: "Sorry, failed creating new contact"
            }
          });
          throw new Error(
            "Something went wrong when creating new contact, status ",
            status
          );
        }
      })
      .catch(err => {
        dispatch({
          type: messageConstants.OPEN_MESSAGE,
          payload: {
            messageType: "error",
            message: "Sorry, failed creating new contact"
          }
        });
        console.log(err);
      });
};

export const handleInputChange = e => ({
  type: contactsConstants.HANDLE_INPUT_CHANGE,
  payload: {
    name: e.target.name,
    value: e.target.value
  }
});

export const closeMessage = () => ({
  type: messageConstants.CLOSE_MESSAGE
});

export const onClosePayAcc = id =>({
  type: contactsConstants.HANDLE_OPEN_DELETED,
  payload:{
    id: id
  }
});

export const handleCloseDeletedDialog = () =>({
  type: contactsConstants.HANDLE_CLOSE_DELETED
})

export const handleCloseDeleted = (id, reload) => dispatch =>
axios
  .post(`http://localhost:3001/contact/delete`, 
  {
    id
  },
  {
    headers: {
      "x-access-token": getCookie("access_token")
    }
  })
  .then(resp => {
    const { status} = resp;
    if (status === 201) {
      dispatch({
        type: contactsConstants.HANDLE_CLOSE_DELETED,
        payload: {
          id: "",
          reload: !reload,
          messageType: "success",
          isMessageOpen: true,
          message: "Successfully deleted contact"
        }
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

export const onEdit = (id, toAccNumber, toNickName) =>({
  type: contactsConstants.HANDLE_OPEN_EDIT,
  payload:{
    id: id,
    isDialogEditOpen: true,
    payAccEdit: toAccNumber,
    nickNameEdit: toNickName
  }
})

export const handleCloseEditDialog = () => ({
  type: contactsConstants.HANDLE_CLOSE_EDIT,
  payload:{
    id: "",
    isDialogEditOpen: false,
    payAccEdit: "",
    nickNameEdit: ""
  }
})
export const handleCloseEdit = (id, payAccEdit, nickNameEdit, reload) => dispatch =>
axios
  .post(`http://localhost:3001/contact/update`, 
  {
    id, 
    payAccEdit, 
    nickNameEdit
  },
  {
    headers: {
      "x-access-token": getCookie("access_token")
    }
  })
  .then(resp => {
    const { status} = resp;
    if (status === 201) {
      dispatch({
        type: contactsConstants.HANDLE_CLOSE_EDIT,
        payload: {
          id: "",
          payAccEdit:"", 
          nickNameEdit:"",
          reload: !reload,
          messageType: "success",
          isMessageOpen: true,
          message: "Successfully edit contact"
        }
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
