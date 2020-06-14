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
import MustBeCustomer from "./HOCs/MustBeCustomer";
import { getUserInfo } from "../utils/authHelper";
import * as contactsActions from "../redux/actions/contactsActions";
import * as messageActions from "../redux/actions/messageActions";

class ChangePassword extends Component {
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
      toAccNumber,
      toNickName,
      reload
    } = this.props;

    return (
      <React.Fragment>
        <Paper className="contacts paper">
          <div>
            <Typography variant="title" component="h1">
              Create new contact
            </Typography>
            <div>
              <div>
                <TextField
                  id="oldPassword"
                  label="Old Password *"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="oldPassword"
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
              </div>
              <div>
                <TextField
                  id="newPassword"
                  label="New Password *"
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="newPassword"
                />
              </div>
              <div>
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
          </div>
        </Paper>
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
  )(ChangePassword)
);
