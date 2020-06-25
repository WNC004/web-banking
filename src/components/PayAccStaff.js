import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import PayIn from "./PayIn";
import Message from "./Message";
import MustBeStaff from "./HOCs/MustBeStaff";
import * as payAccStaffActions from "../redux/actions/payAccStaffActions";
import * as messageActions from "../redux/actions/messageActions";

class PayAccStaff extends Component {
  componentDidMount = () => {
    this.props.getPayAccsList();
  };

  onPayInSucceed = amount => {
    this.props.handlePayInSucceed(+this.props.currentBalance + +amount);
    this.props.getPayAccsList();
  };


  render() {
    const {
      payAccs,
      payAccId,
      histories,
      accNumber,
      clientName,
      clientEmail,
      currentBalance,
      messageType,
      message,
      isMessageOpen,
      togglePayInPanel,
      isDialogHistoryPayAccOpen
    } = this.props;

    const data = payAccs.map((payAcc, index) => [
      index + 1,
      payAcc.accNumber,
      payAcc.clientName,
      payAcc.clientEmail,
      payAcc.balance,
      payAcc.createdAt,
      <span
        style={{ color: payAcc.status === "OPEN" ? "#008b00" : "#e54304" }}
      >
        {payAcc.status}
      </span>,
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          this.props.openPayInPanel(
            payAcc.id,
            payAcc.accNumber,
            payAcc.clientName,
            payAcc.clientEmail,
            payAcc.balance
          )
        }
        disabled={payAcc.status === "CLOSED"}
      >
        pay in
      </Button>,
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          this.props.handleViewHistory(
            payAcc.id,
            payAcc.accNumber,
            payAcc.clientName,
            payAcc.clientEmail,
            payAcc.balance
          )
        }
        disabled={payAcc.status === "CLOSED"}
      >
        History
      </Button>,
    ]);

    const columns = [
      "#",
      "Number",
      "Name",
      "Email",
      "Balance",
      "Created at",
      "Status",
      "Action",
      "History"
    ];

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
        {togglePayInPanel === true && (
          <PayIn
            payAccId={payAccId}
            accNumber={accNumber}
            clientName={clientName}
            clientEmail={clientEmail}
            currentBalance={currentBalance}
            onPayInSucceed={this.onPayInSucceed}
            onClosePayInPanel={this.props.closePayInPanel}
          />
        )}

        <MUIDataTable
          title={"Payment accounts list"}
          data={data}
          columns={columns}
          options={options}
        />

        <Message
          variant={messageType}
          message={message}
          open={isMessageOpen}
          onClose={this.props.closeMessage}
        />
        <Dialog
          open={isDialogHistoryPayAccOpen}
          onClose={this.handleCloseHistoryPayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth={"md"}
        >
          <DialogContent>
            <MUIDataTable
              title={`Recent activities of payment account ${accNumber}`}
              data={data}
              columns={columns}
              options={options}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseHistoryPayAccDialog}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.payAccStaff
});

const mapDispatchToProps = dispatch => ({
  getPayAccsList: () => dispatch(payAccStaffActions.getPayAccsList()),
  openPayInPanel: (id, accNumber, clientName, clientEmail, balance) =>
    dispatch(
      payAccStaffActions.openPayInPanel(
        id,
        accNumber,
        clientName,
        clientEmail,
        balance
      )
    ),
  closePayInPanel: () => dispatch(payAccStaffActions.closePayInPanel()),
  handlePayInSucceed: amount =>
    dispatch(payAccStaffActions.handlePayInSucceed(amount)),
  closeMessage: () => dispatch(messageActions.closeMessage()),
  handleViewHistory: (payAccId, accNumber) =>  dispatch(
    payAccStaffActions.handleViewHistory(
      payAccId,
      accNumber
    )
  ),
  handleCloseHistoryPayAccDialog: () => dispatch(payAccStaffActions.handleCloseHistoryPayAccDialog()),



});

export default MustBeStaff(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PayAccStaff)
);
