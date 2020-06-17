import React, { Component } from "react";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import InternalTransfer from "./InternalTransfer";
import PayAccClient from "./PayAccClient";
import PayAccStaff from "./PayAccStaff";
import Contacts from "./Contacts";
import ChangePassword from "./ChangePassword";
import Debt from "./Debt";
import Staffs from "./Staff";


export class CustomersContainer extends Component {
  render() {
    return (
      <Dashboard screen={<Customers {...this.props} />} title="Customers" />
    );
  }
}

export class InternalTransferContainer extends Component {
  render() {
    return (
      <Dashboard
        screen={<InternalTransfer {...this.props} />}
        title="Internal Transfer"
      />
    );
  }
}

export class PayAccClientContainer extends Component {
  render() {
    return (
      <Dashboard
        screen={<PayAccClient {...this.props} />}
        title="Payment Accounts"
      />
    );
  }
}

export class PayAccStaffContainer extends Component {
  render() {
    return (
      <Dashboard
        screen={<PayAccStaff {...this.props} />}
        title="Payment Accounts"
      />
    );
  }
}

export class ContactsContainer extends Component {
  render() {
    return <Dashboard screen={<Contacts {...this.props} />} title="Contacts" />;
  }
}

export class ChangePasswordContainer extends Component {
  render() {
    return <Dashboard screen={<ChangePassword {...this.props} />} title="Change password" />;
  }
}

export class DebtContainer extends Component {
  render() {
    return <Dashboard screen={<Debt {...this.props} />} title="Debt" />;
  }
}

export class StaffsContainer extends Component {
  render() {
    return (
    <Dashboard screen={<Staffs {...this.props} />} title="Staffs" />
    );
  }
}
