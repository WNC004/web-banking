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
    reason: ""
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
      debtId: ""
    });
  };

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
      debtId,
      reason
    } = this.state;
    axios
          .post(`http://localhost:3001/debt/delete/`, 
          {
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
      reason
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
        <Button variant="contained" color="primary">
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
        <Button variant="contained" color="primary">
          <Link
            to={{
              pathname: "/internal-transfers",
              state: { receiverPayAccNumber: account_creditor}
            }}
            style={{ color: "white" }}
          >
            Pay
          </Link>
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
                  // disabled={
                  //   toAccNumber.trim() === "" ||
                  //   contacts.find(
                  //     contact => contact.toAccNumber === toAccNumber.trim()
                  //   )
                  // }
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
      </React.Fragment>
    );
  }
}

export default MustBeCustomer(
  Debts
);
