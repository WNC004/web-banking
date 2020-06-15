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
import * as contactsActions from "../redux/actions/contactsActions";
import * as messageActions from "../redux/actions/messageActions";

class Debts extends Component {
  componentDidMount = () => {
    const customerId = getUserInfo("f_id");
    this.props.getContactsList(customerId);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.reload !== this.props.reload) {
      const customerId = getUserInfo("f_id");
      this.props.getContactsList(customerId);
    }
  };

  render() {
    const {
      contacts,
      messageType,
      isMessageOpen,
      message,
      toAccNumber,
      toNickName,
      reload
    } = this.props;

    const data = contacts.map((contact, index) => {
      const { toAccNumber, toNickName, createdAt } = contact;
      return [
        index + 1,
        toAccNumber,
        toNickName,
        createdAt,
        <Button variant="contained" color="primary">
          <Link
            to={{
              pathname: "/internal-transfers",
              state: { receiverPayAccNumber: toAccNumber }
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
      "Email",
      "Amount",
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
              Create new contact
            </Typography>
            <div>
                <TextField
                  id="contactNumber"
                  label="Account number *"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="toAccNumber"
                  value={toAccNumber}
                />
                {toAccNumber !== "" &&
                  contacts.find(
                    contact => contact.toAccNumber === toAccNumber.trim()
                  ) && (
                    <FormHelperText style={{ color: "red" }}>
                      This account already existed in your contacts
                    </FormHelperText>
                  )}
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
                    this.props.handleCreateContact(
                      getUserInfo("f_id"),
                      toAccNumber,
                      toNickName,
                      reload
                    )
                  }
                  disabled={
                    toAccNumber.trim() === "" ||
                    contacts.find(
                      contact => contact.toAccNumber === toAccNumber.trim()
                    )
                  }
                >
                  create contact
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.contacts
});

const mapDispatchToProps = dispatch => ({
  getContactsList: customerId =>
    dispatch(contactsActions.getContactsList(customerId)),
  handleCreateContact: (customerId, toAccNumber, toNickName, reload) =>
    dispatch(
      contactsActions.handleCreateContact(
        customerId,
        toAccNumber,
        toNickName,
        reload
      )
    ),
  handleInputChange: e => dispatch(contactsActions.handleInputChange(e)),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeCustomer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Debts)
);
