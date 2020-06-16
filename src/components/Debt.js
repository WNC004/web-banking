import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Paper,
  Typography,
  TextField,
  FormHelperText
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import MustBeCustomer from "./HOCs/MustBeCustomer";
import { getUserInfo } from "../utils/authHelper";
import * as debtsActions from "../redux/actions/debtActions";
import * as messageActions from "../redux/actions/messageActions";

class Debts extends Component {
  componentDidMount = () => {
    const customerId = getUserInfo("f_id");
    this.props.getDebtsList(customerId);
    this.props.getDebtsListForOther(customerId);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.reload !== this.props.reload) {
      const customerId = getUserInfo("f_id");
      this.props.getDebtsList(customerId);
      this.props.getDebtsListForOther(customerId);
    }
  };

  render() {
    const {
      debtsOwner,
      debtsOther,
      account,
      message,
      amount,
      reload
    } = this.props;

    const data = debtsOwner.map((debt, index) => {
      const { account, message, createdAt, amount, type } = debt;
      return [
        index + 1,
        account,
        message,
        amount,
        type,
        createdAt,
        <Button variant="contained" color="primary">
          Send notification
        </Button>
      ];
    });

    const dataOther = debtsOther.map((debt, index) => {
      const { account, message, createdAt, amount, type } = debt;
      return [
        index + 1,
        account,
        message,
        amount,
        type,
        createdAt,
        <Button variant="contained" color="primary">
          <Link
            to={{
              pathname: "/internal-transfers",
              state: { receiverPayAccNumber: account }
            }}
            style={{ color: "white" }}
          >
            TRANSFER
          </Link>
        </Button>
      ];
    });

    const columns = [
      "#",
      "Account number",
      "Name",
      "Amount",
      "Type",
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
                  onChange={this.props.handleInputChange}
                  name="account"
                  value={account}
                />
                {/* {toAccNumber !== "" &&
                  contacts.find(
                    contact => contact.toAccNumber === toAccNumber.trim()
                  ) && (
                    <FormHelperText style={{ color: "red" }}>
                      This account already existed in your contacts
                    </FormHelperText>
                  )} */}
                <TextField
                  id="amount"
                  label="Amount *"
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="amount"
                />
              </div>
              <div>
                <TextField
                  id="message"
                  label="Message *"
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="message"
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    this.props.handleCreateDebt(
                      getUserInfo("f_id"),
                      account,
                      message,
                      amount,
                      reload
                    )
                  }
                  // disabled={
                  //   toAccNumber.trim() === "" ||
                  //   contacts.find(
                  //     contact => contact.toAccNumber === toAccNumber.trim()
                  //   )
                  // }
                >
                  create debt
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
          columns={columns}
          options={options}
        />

        {/* <Message
          variant={messageType}
          open={isMessageOpen}
          onClose={this.props.closeMessage}
        /> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.debts
});

const mapDispatchToProps = dispatch => ({
  getDebtsList: customerId =>
    dispatch(debtsActions.getDebtsList(customerId)),
  getDebtsListForOther: customerId =>
    dispatch(debtsActions.getDebtsListForOther(customerId)),
  handleCreateDebt: (creditor_id, account, message, amount, reload) =>
    dispatch(
      debtsActions.handleCreateDebt(
        creditor_id,
        account,
        message,
        amount,
        reload
      )
    ),
  handleInputChange: e => dispatch(debtsActions.handleInputChange(e)),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeCustomer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Debts)
);
