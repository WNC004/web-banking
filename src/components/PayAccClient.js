import React, { Component } from "react";
import axios from "axios";
import { getCookie } from "tiny-cookie";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import { getUserInfo } from "../utils/authHelper";
import MustBeCustomer from "./HOCs/MustBeCustomer";

class PayAccClient extends Component {
  state = {
    payAccs: [],
    histories: [],
    // pay in panel
    payAccId: "",
    accNumber: "",
    currentBalance: 0,
    // for dialog confirming closing payment account
    isDialogClosePayAccOpen: false,
    // for dialog viewing payment account history
    isDialogHistoryPayAccOpen: false,
    // transfer remaining balance of closing payment account to current customer's another one
    receiverPayAccNumber: "",
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: ""
  };

  getPayAccsList = () => {
    const customerId = getUserInfo("f_id");

    if (customerId === null)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, could not get user entity, please sign in again"
      });

    axios
      .get(`http://localhost:3001/pay-accs-all/${customerId}`, {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data: payAccs } = resp;
        if (status === 200) {
          this.setState({ payAccs });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Sorry, failed getting your payment accounts list"
          });
          throw new Error(
            "Something went wrong when getting payment accounts list, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Sorry, failed getting your payment accounts list"
        });
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.getPayAccsList();
  };

  onClosePayAcc = (payAccId, accNumber, currentBalance) => {
    if (
      payAccId === undefined ||
      accNumber === undefined ||
      currentBalance === undefined ||
      isNaN(currentBalance)
    )
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, could not get this payment account information"
      });

    const { payAccs } = this.state;
    const defaultSelectedPayAcc = payAccs.filter(
      payAcc => payAccId !== payAcc.id && payAcc.status === "OPEN"
    )[0].accNumber;
    this.setState({
      payAccId,
      accNumber,
      currentBalance,
      receiverPayAccNumber: defaultSelectedPayAcc,
      isDialogClosePayAccOpen: true
    });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleCloseClosePayAccDialog = () => {
    this.setState({
      isDialogClosePayAccOpen: false,
      payAccId: "",
      accNumber: "",
      currentBalance: 0,
      receiverPayAccNumber: ""
    });
  };

  handleClosePayAcc = () => {
    const {
      payAccId,
      accNumber,
      currentBalance,
      receiverPayAccNumber
    } = this.state;
    // if selected payment account balance were not empty,
    // let the customer transfer it to one of his account
    if (+currentBalance > 0) {
      if (receiverPayAccNumber === "")
        // already set as 1st account by default in radio group
        return this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Sorry, failed getting targeted account entity"
        });
      axios
        .get(`http://localhost:3001/pay-acc/${receiverPayAccNumber}`, {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        })
        .then(resp => {
          const { status } = resp;
          if (status === 200) {
            const {
              balance: receiverCurrentBalance,
              id: receiverPayAccId
            } = resp.data[0];
            // change balance of both account and update history
            axios
              .all([
                axios.patch(
                  "http://localhost:3001/pay-acc/balance",
                  {
                    payAccId,
                    newBalance: 0
                  },
                  {
                    headers: {
                      "x-access-token": getCookie("access_token")
                    }
                  }
                ),
                axios.patch(
                  "http://localhost:3001/pay-acc/balance",
                  {
                    payAccId: receiverPayAccId,
                    newBalance: +receiverCurrentBalance + +currentBalance
                  },
                  {
                    headers: {
                      "x-access-token": getCookie("access_token")
                    }
                  }
                ),
                axios.post(
                  "http://localhost:3001/history",
                  {
                    payAccId,
                    fromAccNumber: accNumber,
                    toAccNumber: receiverPayAccNumber,
                    amount: currentBalance,
                    transactionType: "closed",
                    message: "Close payment account",
                    feeType: 0
                  },
                  {
                    headers: {
                      "x-access-token": getCookie("access_token")
                    }
                  }
                ),
                axios.post(
                  "http://localhost:3001/history",
                  {
                    payAccId: receiverPayAccId,
                    fromAccNumber: accNumber,
                    toAccNumber: receiverPayAccNumber,
                    amount: currentBalance,
                    transactionType: "received",
                    message: "Receive",
                    feeType: 0
                  },
                  {
                    headers: {
                      "x-access-token": getCookie("access_token")
                    }
                  }
                )
              ])
              .then(
                axios.spread(
                  (
                    updateSenderPayAcc,
                    updateReceiverPayAcc,
                    sendHistory,
                    receiveHistory
                  ) => {
                    if (
                      updateSenderPayAcc.status !== 201 ||
                      updateReceiverPayAcc.status !== 201
                    ) {
                      this.setState({
                        messageType: "error",
                        isMessageOpen: true,
                        message: "Sorry, failed transferring remaining balance"
                      });
                      throw new Error(
                        "Something went wrong when transferring remaining balance, status ",
                        updateSenderPayAcc.status
                      );
                    }

                    if (
                      sendHistory.status !== 201 ||
                      receiveHistory.status !== 201
                    ) {
                      this.setState({
                        messageType: "error",
                        isMessageOpen: true,
                        message:
                          "Sorry, failed updating history of the transaction"
                      });
                      throw new Error(
                        "Something went wrong when updating history of the transaction, status ",
                        updateSenderPayAcc.status
                      );
                    }
                  }
                )
              );
          } else {
            this.setState({
              messageType: "error",
              isMessageOpen: true,
              message: "Sorry, failed getting targeted account entity"
            });
            throw new Error(
              "Something went wrong when getting targeted account entity"
            );
          }
        })
        .catch(err => {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Sorry, failed getting targeted account entity"
          });
          console.log(err);
        });
    }
    axios
      .patch(
        "http://localhost:3001/pay-acc/status/closed",
        {
          payAccId
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      )
      .then(resp => {
        const { status } = resp;
        if (status === 201) {
          this.setState(
            {
              // reset
              payAccId: "",
              receiverPayAccNumber: "",
              // show message
              messageType: "success",
              isMessageOpen: true,
              message: `Successfully close payment account ${accNumber}`,
              // close dialog
              isDialogClosePayAccOpen: false
            },
            // reset accNumber then refresh payment accounts list
            () => {
              this.setState({ accNumber: "" }, this.getPayAccsList);
            }
          );
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: `Sorry, failed closing payment account ${accNumber}`
          });
          throw new Error(
            "Something went wrong when closing payment account, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: `Sorry, failed closing payment account ${accNumber}`
        });
        console.log(err);
      });
  };

  handleViewHistory = (payAccId, accNumber) => {
    if (payAccId === undefined || accNumber === undefined)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, failed getting this payment account information"
      });

    axios
      .get(`http://localhost:3001/histories/${payAccId}`, {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data: histories } = resp;
        if (status === 200) {
          this.setState({
            histories,
            isDialogHistoryPayAccOpen: true,
            accNumber,
            payAccId
          });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: `Sorry, failed getting history of payment account ${accNumber}`
          });
          throw new Error(
            "Something went wrong getting history of payment account, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: `Sorry, failed getting history of payment account ${accNumber}`
        });
        console.log(err);
      });
  };

  handleCloseHistoryPayAccDialog = () => {
    this.setState({
      isDialogHistoryPayAccOpen: false,
      payAccId: "",
      accNumber: "",
      currentBalance: 0
    });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false, message: "" });
  };

  render() {
    const {
      payAccs,
      histories,
      payAccId,
      accNumber,
      currentBalance,
      receiverPayAccNumber,
      isDialogClosePayAccOpen,
      isDialogHistoryPayAccOpen,
      messageType,
      message,
      isMessageOpen
    } = this.state;

    const MUIDataTableInfo = {
      default: {
        data: payAccs.map((payAcc, index) => {
          const { id, accNumber, balance, createdAt, status, type } = payAcc;
          return [
            index + 1,
            accNumber,
            balance,
            type === '1' ? 'Payment' : 'Savings',
            createdAt,
            <span style={{ color: status === "OPEN" ? "#008b00" : "#e54304" }}>
              {status}
            </span>,
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.handleViewHistory(id, accNumber)}
              >
                history
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.onClosePayAcc(id, accNumber, balance)}
                style={{ marginLeft: "10px" }}
                disabled={
                  status === "CLOSED" ||
                  payAccs.filter(payAcc => payAcc.status === "OPEN").length < 2
                }
              >
                close
              </Button>
            </div>
          ];
        }),
        columns: ["#", "Number", "Balance", "Type", "Created at", "Status", "Action"],
        options: {
          selectableRows: false,
          responsive: "scroll",
          print: false,
          download: false,
          viewColumns: false,
          filter: false
        }
      },
      closePayAcc: {
        data: payAccs
          .filter(payAcc => payAcc.id !== payAccId && payAcc.status === "OPEN")
          .map((payAcc, index) => {
            const { accNumber: _accNumber, balance } = payAcc;
            return [
              <RadioGroup
                name="receiverPayAccNumber"
                value={
                  receiverPayAccNumber !== ""
                    ? receiverPayAccNumber
                    : index === 0 && _accNumber
                }
                onChange={this.handleInputChange}
              >
                <FormControlLabel
                  value={_accNumber}
                  control={
                    <Radio
                      color="primary"
                      checked={
                        (receiverPayAccNumber === "" && index === 0) ||
                        _accNumber === receiverPayAccNumber
                      }
                    />
                  }
                  label=""
                />
              </RadioGroup>,
              _accNumber,
              balance
            ];
          }),
        columns: ["Select", "Number", "Balance"],
        options: {
          selectableRows: false,
          responsive: "scroll",
          print: false,
          download: false,
          viewColumns: false,
          filter: false,
          rowsPerPage: 5,
          rowsPerPageOptions: [5, 10, 15]
        }
      },
      payAccHistory: {
        data: histories.map((history, index) => {
          const {
            fromAccNumber,
            toAccNumber,
            transactionType,
            amount,
            feeType,
            message: msg,
            createdAt
          } = history;
          return [
            index + 1,
            fromAccNumber,
            toAccNumber,
            amount,
            // transactionType.toUpperCase(),
            // <span style={{ color: transactionType === "sent" ? "#ff0000" : "#66ff99" }}>
            //   {history.transactionType.toUpperCase()}
            // </span>,
            <span style={{ 
              color: transactionType === "sent" ? "#66ff99" :  transactionType === "received" ? "#ff9933" : "#ff0066"
            }}>
              {history.transactionType.toUpperCase()}
            </span>,
            +feeType,
            msg,
            new Date(createdAt).toLocaleString()
          ];
        }),
        columns: [
          "#",
          "From",
          "To",
          "Amount",
          "Transaction type",
          "Extra fee",
          "Message",
          "Date time"
        ],
        options: {
          selectableRows: false,
          responsive: "scroll",
          print: false,
          download: false,
          viewColumns: false,
          filter: false,
          rowsPerPage: 5,
          rowsPerPageOptions: [5, 10],
        }
      }
    };

    return (
      <React.Fragment>
        <MUIDataTable
          title={"Payment accounts list"}
          data={MUIDataTableInfo.default.data}
          columns={MUIDataTableInfo.default.columns}
          options={MUIDataTableInfo.default.options}
        />

        {/* dialog to confirm closing payment account */}
        <Dialog
          open={isDialogClosePayAccOpen}
          onClose={this.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure to close the payment account ${accNumber}?`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
            {currentBalance > 0 ? (
              <React.Fragment>
                <span>Balance of this payment account is {currentBalance}</span>
                <br />
                <span>
                  Please choose one of the following payment accounts to inherit
                  the remaining
                </span>
                <p />
                <MUIDataTable
                  title={"Payment accounts list"}
                  data={MUIDataTableInfo.closePayAcc.data}
                  columns={MUIDataTableInfo.closePayAcc.columns}
                  options={MUIDataTableInfo.closePayAcc.options}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span>Balance of this payment account is 0</span>
                <br />
                <span>No further action required</span>
              </React.Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseClosePayAccDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClosePayAcc} color="primary" autoFocus>
              Yes, I'm sure
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog to view selected payment account history */}
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
              data={MUIDataTableInfo.payAccHistory.data}
              columns={MUIDataTableInfo.payAccHistory.columns}
              options={MUIDataTableInfo.payAccHistory.options}
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

        <Message
          variant={messageType}
          message={message}
          open={isMessageOpen}
          onClose={this.handleCloseMessage}
        />
      </React.Fragment>
    );
  }
}

export default MustBeCustomer(PayAccClient);
