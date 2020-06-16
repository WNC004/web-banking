import * as debtsConstants from "../constants/debtConstants";

const initState = {
  debtsOwner: [],
  debtsOther: [],
  account: "",
  message: "",
  amount: "",
  accountAll: [],
  reload: false
};

const debtsReducer = (state = initState, action) => {
  switch (action.type) {
    case debtsConstants.GET_DEBTS_OWNER_LIST_SUCCEED:
      return { ...state, debtsOwner: action.payload };
    case debtsConstants.GET_DEBTS_OTHER_LIST_SUCCEED:
      return { ...state, debtsOther: action.payload };
    case debtsConstants.HANDLE_CREATE_DEBT_SUCCEED:
      return { ...state, account: "", message: "",  amount: "", ...action.payload };
    case debtsConstants.HANDLE_INPUT_CHANGE:
      return { ...state, [action.payload.name]: action.payload.value };
    default:
      return state;
  }
};

export default debtsReducer;
