import * as contactsConstants from "../constants/contactsConstants";
import * as messageConstants from "../constants/messageConstants";

const initState = {
  contacts: [],
  messageType: "",
  isMessageOpen: false,
  message: "",
  toAccNumber: "",
  toNickName: "",
  isDialogDeletedOpen: false,
  isDialogEditOpen: false,
  id: "",
  reload: false
};

const contactsReducer = (state = initState, action) => {
  switch (action.type) {
    case contactsConstants.GET_CONTACTS_LIST_SUCCEED:
      return { ...state, contacts: action.payload };
    case contactsConstants.HANDLE_CREATE_CONTACT_SUCCEED:
      return { ...state, toAccNumber: "", toNickName: "", ...action.payload };
    case contactsConstants.HANDLE_INPUT_CHANGE:
      return { ...state, [action.payload.name]: action.payload.value };
    case messageConstants.CLOSE_MESSAGE:
      return { ...state, isMessageOpen: false };
    case contactsConstants.HANDLE_OPEN_DELETED:
      return { ...state, isDialogDeletedOpen: true, ...action.payload };
    case contactsConstants.HANDLE_CLOSE_DELETED:
      return { ...state, isDialogDeletedOpen: false, id:"", ...action.payload };
    case contactsConstants.HANDLE_OPEN_EDIT:
      return { ...state, isDialogEditOpen: true, ...action.payload };
    case contactsConstants.HANDLE_CLOSE_EDIT:
      return { ...state, isDialogEditOpen: false, ...action.payload };
    case messageConstants.OPEN_MESSAGE:
       return { ...state, isMessageOpen: true };
    default:
      return state;
  }
};

export default contactsReducer;
