import { combineReducers } from "redux";
import payAccStaffReducer from "./payAccStaffReducer";
import customersReducer from "./customersReducer";
import payAccClientReducer from "./payAccClientReducer";
import contactsReducer from "./contactsReducer";
import debtsReducer from "./debtsReducer";
import staffsReducer from "./staffsReducer";

const indexReducer = combineReducers({
  payAccStaff: payAccStaffReducer,
  customers: customersReducer,
  payAccClient: payAccClientReducer,
  contacts: contactsReducer,
  debts: debtsReducer,
  staffs: staffsReducer
});

export default indexReducer;
