import * as staffsConstants from "../constants/staffsConstants";
import * as messageConstants from "../constants/messageConstants";

const initState = {
  staffs: [],
  // for notify message
  isMessageOpen: false,
  messageType: "",
  message: "",
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
    default:
      return state;
  }
};

export default staffsReducer;
