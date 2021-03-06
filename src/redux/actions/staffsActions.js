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

    export const handleDeleteDialog = (
      staffId,
      staffEmail,
      staffName,
      phone,
      reload
    ) => dispatch =>
      axios
        .post(
          "http://localhost:3001/staffs/delete",
          {
            staffId,
            staffEmail,
            staffName,
            phone
          },
          {
            headers: {
              "x-access-token": getCookie("access_token")
            }
          }
        )
        .then(resp => {
          const {
            status,
            // data: { accNumber }
          } = resp;
          if (status === 201) {
            dispatch({
              type: staffsConstants.HANDLE_DELETE_DIALOG_CONFIRM_SUCCEED,
              payload: {
                isDeleteDialogOpen: false,
                staffId: "",
                staffEmail: "",
                staffName: "",
                isMessageOpen: true,
                messageType: "success",
                message: "Successful delete staff",
                reload: !reload
              }
            });
          } else {
            dispatch({
              type: staffsConstants.HANDLE_DELETE_DIALOG_CONFIRM_ERROR,
              payload: {
                isDeleteDialogOpen: false,
                staffId: "",
                staffEmail: "",
                staffName: "",
                isMessageOpen: true,
                messageType: "error",
                message: "Failed delete staff"
              }
            });
            throw new Error(
              "Something went wrong when delete staff, status ",
              status
            );
          }
        })
        .catch(err => {
          dispatch({
            type: staffsConstants.HANDLE_DELETE_DIALOG_CONFIRM_ERROR,
            payload: {
              isDeleteDialogOpen: false,
              staffId: "",
              staffEmail: "",
              staffName: "",
              isMessageOpen: true,
              messageType: "error",
              message: "Failed delete staff"
            }
          });
          console.log(err);
        });
    
    export const openDeleteConfirmDialog = (
      staffId,
      staffEmail,
      staffName,
      phone
    ) => ({
      type: staffsConstants.OPEN_DELETE_DIALOG_CONFIRM,
      payload: {
        staffId,
        staffEmail,
        staffName,
        phone
      }
    });
    
    export const closeDeleteConfirmDialog = () => ({
      type: staffsConstants.CLOSE_DELETE_DIALOG_CONFIRM
    });
    
    //Edit-------------------------------------------------------------------------------------------------------------
    export const handleEditDialog = (
      staffId,
      staffEmail,
      staffName,
      phone, 
      reload
    ) => dispatch =>
      axios
        .post(
          "http://localhost:3001/staffs/edit",
          {
            staffId,
            staffEmail,
            staffName,
            phone
          },
          {
            headers: {
              "x-access-token": getCookie("access_token")
            }
          }
        )
        .then(resp => {
          const {
            status
          } = resp;
          if (status === 201) {
            dispatch({
              type: staffsConstants.HANDLE_EDIT_DIALOG_CONFIRM_SUCCEED,
              payload: {
                isEditDialogOpen: false,
                staffId: "",
                staffEmail: "",
                staffName: "",
                isMessageOpen: true,
                messageType: "success",
                message: "Successful edit staff",
                reload: !reload
              }
            });
          } else if (status === 204) {
            dispatch({
              type: staffsConstants.HANDLE_EDIT_DIALOG_CONFIRM_ERROR,
              payload: {
                isEditDialogOpen: true,
                staffId: "",
                staffEmail: "",
                staffName: "",
                isMessageOpen: true,
                messageType: "error",
                message: "Fail to edit staff. This phone number does already exists!",
                // reload: !reload
              }
            });
          }
          else if (status === 202) {
            dispatch({
              type: staffsConstants.HANDLE_EDIT_DIALOG_CONFIRM_ERROR,
              payload: {
                isEditDialogOpen: true,
                staffId: "",
                staffEmail: "",
                staffName: "",
                isMessageOpen: true,
                messageType: "error",
                message: "Failed to edit staff. This email does already exists!"
              }
            });
            throw new Error(
              "Something went wrong when edit staff, status ",
              status
            );
          }
        })
        .catch(err => {
          dispatch({
            type: staffsConstants.HANDLE_EDIT_DIALOG_CONFIRM_ERROR,
            payload: {
              isEditDialogOpen: true,
              staffId: "",
              staffEmail: "",
              staffName: "",
              isMessageOpen: true,
              messageType: "error",
              message: "Failed edit staff"
            }
          });
          console.log(err);
        });
    
    export const openEditConfirmDialog = (
      staffId,
      staffEmail,
      staffName,
      phone
    ) => ({
      type: staffsConstants.OPEN_EDIT_DIALOG_CONFIRM,
      payload: {
        staffId,
        staffEmail,
        staffName,
        phone
      }
    });
    
export const closeEditConfirmDialog = () => ({
  type: staffsConstants.CLOSE_EDIT_DIALOG_CONFIRM
});

export const handleInputChange = e => ({
  type: staffsConstants.HANDLE_INPUT_CHANGE,
  payload: {
    name: e.target.name,
    value: e.target.value
  }
});
    
  