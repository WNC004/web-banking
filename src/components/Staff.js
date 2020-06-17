import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import CreateAccount from "./CreateAccount";
import CreateStaff from "./CreateStaff";
import MustBeAdmin from "./HOCs/MustBeAdmin";
import * as customersActions from "../redux/actions/customersActions";
import * as messageActions from "../redux/actions/messageActions";

class Staffs extends Component {
  componentDidMount = () => {
    this.props.getCustomersList();
  };

  render() {
    const {
      customers,

    } = this.props;

    const data = customers.map((customer, index) => [
      index + 1,
      customer.email,
      customer.name,
      customer.phone,
      customer.createdAt,
      <Button
        variant="contained"
        color="primary"
      >
        Edit
      </Button>
    ]);

    const columns = ["#", "Email", "Name", "Phone", "Created at", "Action"];

    const options = {
      selectableRows: false,
      responsive: "scroll",
      print: false,
      download: false,
      viewColumns: false,
      filter: false
    };

    return (
      <React.Fragment>
        {/* <CreateAccount onCreateAccountSucceed={this.props.getCustomersList} /> */}
        <CreateStaff onCreateAccountSucceed={this.props.getCustomersList}/>
        <MUIDataTable
          title={"Staffs list"}
          data={data}
          columns={columns}
          options={options}
        />

      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.customers
});

const mapDispatchToProps = dispatch => ({
  getCustomersList: () => dispatch(customersActions.getCustomersList()),
  handleCreatePayAcc: (customerId, clientEmail, clientName, phone) =>
    dispatch(
      customersActions.handleCreatePayAcc(
        customerId,
        clientEmail,
        clientName,
        phone
      )
    ),
  openCreatePayAccConfirmDialog: (customerId, clientEmail, clientName, phone) =>
    dispatch(
      customersActions.openCreatePayAccConfirmDialog(
        customerId,
        clientEmail,
        clientName,
        phone
      )
    ),
  closeCreatePayAccConfirmDialog: () =>
    dispatch(customersActions.closeCreatePayAccConfirmDialog()),
  closeCreatePayAccOperatedDialog: () =>
    dispatch(customersActions.closeCreatePayAccOperatedDialog()),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeAdmin(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Staffs)
);
