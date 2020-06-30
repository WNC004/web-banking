import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import MustBeCustomer from "./HOCs/MustBeCustomer";
import { getUserInfo } from "../utils/authHelper";
import axios from "axios";
import { getCookie } from "tiny-cookie";

class Debts extends Component {

  state = {
    customerId : getUserInfo("f_id"),
    messageType: "",
    isMessageOpen: "",
    message: "",
    debtsOwner: [],
    debtsOther: [],
    account: "",
    msg: "",
    amount:"",
    account_creditor: "",
    debtId: "",
    isDialogClosePayAccOpen: false,
    toAccount: "",
    isDialogOpenTranfer: false,
    messagePay:"",
    reason:""
  };

  getListDebts = () =>{
    const {customerId} = this.state;
    axios
      .get(`http://localhost:3001/debts/other/${customerId}`, {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data: debts } = resp;
        if (status === 200) {
           this.setState({
            messageType: "success",
            debtsOther: debts
          });
        } else {
          this.setState({
            messageType: "error",
            message: "Failed get list others"
          });
          throw new Error(
            "Something went wrong when getting contacts list, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          message: "Failed get list others"
        });
      });
  }
  
  getListDebtOthers = () =>{
    const {customerId} = this.state;
    axios
    .get(`http://localhost:3001/debts/${customerId}`, {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status, data: debts } = resp;
      if (status === 200) {
        this.setState({
        messageType: "success",
        debtsOwner: debts
      });
      } else {
        this.setState({
          messageType: "error",
          message: "Failed get list others"
        });
        throw new Error(
          "Something went wrong when getting contacts list, status ",
          status
        );
      }
    })
    .catch(err => {
      this.setState({
        messageType: "error",
        message: "Failed get list others"
      });
    });
  }
  componentDidMount = () => {
    this.getListDebts();
    this.getListDebtOthers();
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false, message: "" });
  };

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleCloseClosePayAccDialog = () => {
    this.setState({
      isDialogClosePayAccOpen: false,
      isDialogOpenTranfer: false,
      debtId: ""
    });
  };

  onPayIn = (id, account, amount) =>{
    const {customerId} = this.state;
    axios
      .post(
        "http://localhost:3001/check-balance",
        {
          customerId,
          amount
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      )
      .then(resp => {
        const { status } = resp;
        const msg = resp.data.message;
        const key = resp.data.key;
        if (status === 200) {
          if(key === "Failed"){
            this.setState({
              messageType: "error",
              isMessageOpen: true,
              message: msg
            });
          }
          else{
            this.setState({
              toAccount: account,
              isDialogOpenTranfer: true,
              amount: amount,
              debtId: id
            })
          }
          
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Sorry, failed creating new debt"
          });
          
          // throw new Error(
          //   "Something went wrong when creating new debt, status ",
          //   status
          // );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Sorry, failed creating new debt"
        });
        console.log(err);
      });
  }

  handleCreateDebt = (creditor_id, account, msg, amount) =>{
    axios
      .post(
        "http://localhost:3001/debt",
        {
          creditor_id,
          account,
          msg,
          amount
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      )
      .then(resp => {
        const { status } = resp;
        const msg = resp.data.message;
        console.log(status);
        console.log(msg);
        if (status === 201) {
          this.setState({
            messageType: "success",
            isMessageOpen: true,
            message: "Successfully created new debt"
          });
          this.getListDebts();
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Sorry, failed creating new debt"
          });
          
          // throw new Error(
          //   "Something went wrong when creating new debt, status ",
          //   status
          // );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Sorry, failed creating new debt"
        });
        console.log(err);
      });
  }

  onClosePayAcc = (debtId) => {
    if (debtId === undefined)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, could not get this payment account information"
      });

    this.setState({
      debtId,
      isDialogClosePayAccOpen: true
    });
    console.log(debtId);
  };

  handleClosePayAcc = () => {
    const {
      customerId,
      debtId,
      reason
    } = this.state;
    axios
          .post(`http://localhost:3001/debt/delete/`, 
          {
            customerId,
            debtId,
            reason
          },
          {
            headers: {
              "x-access-token": getCookie("access_token")
            }
          })
          .then(resp => {
            const { status } = resp;
            if (status === 200) {
              this.setState({
              messageType: "success",
              isMessageOpen: true,
              message: "You deleted this debt",
              isDialogClosePayAccOpen: false,
              debtId: ""
            });
            this.getListDebts();
            this.getListDebtOthers();
            } else {
              this.setState({
                messageType: "error",
                isMessageOpen: true,
                message: "Failed deleted this debt",
                isDialogClosePayAccOpen: false,
                debtId: ""
              });
              throw new Error(
                "Something went wrong when getting contacts list, status ",
                status
              );
            }
          })
  }

  handleTranfer = () => {
    const {
      customerId,
      debtId,
      messagePay,
      toAccount,
      amount
    } = this.state;
    axios
          .post(`http://localhost:3001/debt/tranfer/`, 
          {
            customerId,
            debtId,
            messagePay,
            toAccount,
            amount
          },
          {
            headers: {
              "x-access-token": getCookie("access_token")
            }
          })
          .then(resp => {
            const { status } = resp;
            if (status === 200) {
              this.setState({
              messageType: "success",
              isMessageOpen: true,
              message: "You pay in this debt",
              isDialogOpenTranfer: false,
              debtId: "",
              amount:"",
              toAccount:"",
              messagePay:""
            });
            this.getListDebts();
            } else {
              this.setState({
                messageType: "error",
                isMessageOpen: true,
                message: "Failed tranfer this debt",
                isDialogClosePayAccOpen: false,
                debtId: "",
                amount:"",
                toAccount:"",
                messagePay:""
              });
              throw new Error(
                "Something went wrong when getting contacts list, status ",
                status
              );
            }
          })
  }

  handleNotify = (id, email_debtor)=>{
    axios
    .post(`http://localhost:3001/debt/notify/`, 
    {
      id,
      email_debtor
    },
    {
      headers: {
        "x-access-token": getCookie("access_token")
      }
    })
    .then(resp => {
      const { status } = resp;
      if (status === 200) {
        this.setState({
        messageType: "success",
        isMessageOpen: true,
        message: "Successfully Send notication",
        isDialogClosePayAccOpen: false,
        debtId: ""
      });
      this.getListDebts();
      this.getListDebtOthers();
      } else {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed Send notication",
          isDialogClosePayAccOpen: false,
          debtId: ""
        });
        throw new Error(
          "Something went wrong when getting contacts list, status ",
          status
        );
      }
    })
  }

  render() {
     const {
      debtsOwner,
      debtsOther,
      account,
      messageType,
      isMessageOpen,
      message,
      msg,
      amount,
      isDialogClosePayAccOpen,
      reason,
      toAccount,
      isDialogOpenTranfer,
      messagePay
    } = this.state;

    const data = debtsOwner.map((debt, index) => {
      const { id, account, name_debtors, msg, createdAt, amount, email_debtor } = debt;
      return [
        index + 1,
        account,
        name_debtors,
        amount,
        msg,
        email_debtor,
        createdAt,
        <div>
        <Button variant="contained" color="primary" onClick={() => this.handleNotify(id, email_debtor)}>
          Notify
        </Button>
        <Button variant="contained" color="secondary" onClick={() => this.onClosePayAcc(id)}>
          Delete
        </Button>
        </div>
      ];
    });

    const dataOther = debtsOther.map((debt, index) => {
      const { id, account, creditor_name, msg, createdAt, amount, account_creditor } = debt;
      return [
        index + 1,
        account,
        creditor_name,
        amount,
        msg,
        account_creditor,
        createdAt,
        <div>
        <Button variant="contained" color="primary" onClick={() => this.onPayIn(id, account, amount)}>
            Pay
        </Button>
        <Button variant="contained" color="secondary" onClick={() => this.onClosePayAcc(id)}>
          Delete
        </Button>
        </div>
      ];
    });

    const columns = [
      "#",
      "Account number",
      "Name",
      "Amount",
      "Message",
      "Email",
      "CreatedAt",
      "Action"
    ];

    const columnsb = [
      "#",
      "Account number",
      "Creditor",
      "Amount",
      "Message",
      "Creditor's Account",
      "CreatedAt",
      "Action"
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
        <Paper className="sign-up paper form-2-cols">
          <div>
            <Typography variant="title" component="h1">
              Create new debt
            </Typography>
            <div>
                <TextField
                  id="account"
                  label="Account number *"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="account"
                  value={account}
                />
               
                <TextField
                  id="amount"
                  label="Amount *"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="amount"
                />
              </div>
              <div>
                <TextField
                  id="msg"
                  label="Message *"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="msg"
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    this.handleCreateDebt(
                      getUserInfo("f_id"),
                      account,
                      msg,
                      amount
                    )
                  }
                >
                  Create debt
                </Button>
              </div>
            </div>
        </Paper>

        <MUIDataTable
          title={"My debt list"}
          data={data}
          columns={columns}
          options={options}
        />
        
        <br></br>

        <MUIDataTable
          title={"Owner debt list"}
          data={dataOther}
          columns={columnsb}
          options={options}
        />

        <Message
          variant={messageType}
          message={message}
          open={isMessageOpen}
          onClose={this.handleCloseMessage}
        />

        <Dialog
          open={isDialogClosePayAccOpen}
          onClose={this.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure to deleted this debt`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
           
              <React.Fragment>
              <TextField
                  id="reason"
                  label="Reason deleted"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="reason"
                  value={reason}
                />
              </React.Fragment>
            
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

        <Dialog
          open={isDialogOpenTranfer}
          onClose={this.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure to pay in this debt`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
           
              {/* <React.Fragment>
              <TextField
                  id="messagePay"
                  label="Message"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="messagePay"
                  value={messagePay}
                />
              </React.Fragment> */}
            
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseClosePayAccDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleTranfer} color="primary" autoFocus>
              Tranfer
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default MustBeCustomer(
  Debts
);
