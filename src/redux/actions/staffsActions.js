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
      phone
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
      phone
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
            status,
            // data: { accNumber }
          } = resp;
          if (status === 201) {
            dispatch({
              type: staffsConstants.HANDLE_EDIT_DIALOG_CONFIRM_SUCCEED,
              payload: {
                isEditDialogOpen: false,
                staffId: "",
                staffEmail: "",
                staffName: "",
              }
            });
          } else {
            dispatch({
              type: staffsConstants.HANDLE_EDIT_DIALOG_CONFIRM_ERROR,
              payload: {
                isEditDialogOpen: false,
                staffId: "",
                staffEmail: "",
                staffName: "",
                messageType: "error",
                message: "Failed edit staff"
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
              isEditDialogOpen: false,
              staffId: "",
              staffEmail: "",
              staffName: "",
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
    
  