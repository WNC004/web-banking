import React from "react";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import {
  CustomersContainer,
  InternalTransferContainer,
  PayAccClientContainer,
  PayAccStaffContainer,
  ContactsContainer,
  ChangePasswordContainer,
  DebtContainer,
  StaffsContainer,
  ReportsContainer,
  ExternalTransferContainer,
  HistoryStaffContainer
} from "./components/DashContainer";

const routes = [
  {
    path: "/",
    isPrivate: true,
    exact: true,
    comp: props => <Home {...props} />
  },
  {
    path: "/sign-in",
    isPrivate: false,
    exact: false,
    comp: props => <SignIn {...props} />
  },
  {
    path: "/sign-out",
    isPrivate: false,
    exact: false,
    comp: props => <SignOut />
  },
  {
    path: "/customers",
    isPrivate: true,
    exact: true,
    comp: props => <CustomersContainer {...props} />
  },
  {
    path: "/staffs",
    isPrivate: true,
    exact: true,
    comp: props => <StaffsContainer {...props} />
  },
  {
    path: "/payment-accounts",
    isPrivate: true,
    exact: true,
    comp: props => <PayAccClientContainer {...props} />
  },
  {
    path: "/payment-accounts-staff",
    isPrivate: true,
    exact: true,
    comp: props => <PayAccStaffContainer {...props} />
  },
  {
    path: "/internal-transfers",
    isPrivate: true,
    exact: true,
    comp: props => <InternalTransferContainer {...props} />
  },
  {
    path: "/external-transfers",
    isPrivate: true,
    exact: true,
    comp: props => <ExternalTransferContainer {...props} />
  },
  {
    path: "/contacts",
    isPrivate: true,
    exact: true,
    comp: props => <ContactsContainer {...props} />
  },
  {
    path: "/change-password",
    isPrivate: true,
    exact: true,
    comp: props => <ChangePasswordContainer {...props} />
  },
  {
    path: "/debt",
    isPrivate: true,
    exact: true,
    comp: props => <DebtContainer {...props} />
  },
  {
    path: "/history-staff",
    isPrivate: true,
    exact: true,
    comp: props => <HistoryStaffContainer {...props} />
  },
  {
    path: "/report",
    isPrivate: true,
    exact: true,
    comp: props => <ReportsContainer {...props} />
  },
  {
    path: "/somewhere-the-God-only-knows",
    isPrivate: false,
    exact: false,
    comp: props => <NotFound />
  },
  {
    path: "",
    isPrivate: false,
    exact: false,
    comp: props => <NotFound />
  }
];

export default routes;
