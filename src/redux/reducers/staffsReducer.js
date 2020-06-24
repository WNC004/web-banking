import * as staffsConstants from "../constants/staffsConstants";
import * as messageConstants from "../constants/messageConstants";

const initState = {
  staffs: [],
  // for notify message
  isMessageOpen: false,
  messageType: "",
  message: "",
  // for dialog edit
  openDialog: false,
  isDeleteDialogOpen: false,
  staffId: "",
  staffEmail: "",
  staffName: "",
  staffPhone: "",
  // for dialog edit
  isEditDialogOpen: false
};

const staffsReducer = (state = initState, action) => {
  switch (action.type) {
    case staffsConstants.GET_STAFFS_LIST_SUCCEED:
      return {
        ...state,
        staffs: action.payload
      };
    case messageConstants.OPEN_MESSAGE:
      return {
        ...state,
        ...action.payload,
        isMessageOpen: true
      };
    case messageConstants.CLOSE_MESSAGE:
      return {
        ...state,
        isMessageOpen: false
      };
      // Delete
      case staffsConstants.OPEN_DELETE_DIALOG_CONFIRM:
        return {
          ...state,
          isDeleteDialogOpen: true,
          ...action.payload
        };
      case staffsConstants.CLOSE_DELETE_DIALOG_CONFIRM:
        return {
          ...state,
          isDeleteDialogOpen: false,
          staffId: "",
          staffEmail: "",
          staffName: ""
        };
      case staffsConstants.HANDLE_DELETE_DIALOG_CONFIRM_SUCCEED:
        return {
          ...state,
          ...action.payload
        };
         // Edit
      case staffsConstants.OPEN_EDIT_DIALOG_CONFIRM:
        return {
          ...state,
          isEditDialogOpen: true,
          ...action.payload
        };
      case staffsConstants.CLOSE_EDIT_DIALOG_CONFIRM:
        return {
          ...state,
          isEditDialogOpen: false,
          staffId: "",
          staffEmail: "",
          staffName: ""
        };
      case staffsConstants.HANDLE_EDIT_DIALOG_CONFIRM_SUCCEED:
        return {
          ...state,
          ...action.payload
        };
    default:
      return state;
  }
};

export default staffsReducer;
