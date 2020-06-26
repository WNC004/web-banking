import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Paper,
  Typography,
  TextField,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import MustBeCustomer from "./HOCs/MustBeCustomer";
import { getUserInfo } from "../utils/authHelper";
import * as contactsActions from "../redux/actions/contactsActions";
import * as messageActions from "../redux/actions/messageActions";

class Contacts extends Component {
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
      reload,
      isDialogDeletedOpen,
      isDialogEditOpen,
      payAccEdit,
      nickNameEdit,
      id
    } = this.props;

    const data = contacts.map((contact, index) => {
      const { id, toAccNumber, toNickName, createdAt } = contact;
      console.log(id);
      return [
        index + 1,
        toAccNumber,
        toNickName,
        createdAt,
        <div>
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
        <Button variant="contained" color="secondary" onClick={() => this.props.onClosePayAcc(id)}>
          Delete
        </Button>

        <Button variant="contained" color="primary" onClick={() => this.props.onEdit(id, toAccNumber, toNickName)}>
          Edit
        </Button>

        </div>
      ];
    });

    const columns = [
      "#",
      "Payment account number",
      "Nickname",
      "Created at",
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
        <Paper className="contacts paper">
          <div>
            <Typography variant="title" component="h1">
              Create new contact
            </Typography>
            <div>
              <div>
                <TextField
                  id="contactNumber"
                  label="Payment account number *"
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
              </div>
              <div>
                <TextField
                  id="contactName"
                  label="Nickname"
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="toNickName"
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

        <MUIDataTable
          title={"Contacts list"}
          data={data}
          columns={columns}
          options={options}
        />

        <Dialog
          open={isDialogDeletedOpen}
          onClose={this.props.handleCloseCloseDeletedDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure to deleted this contact`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
           
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> this.props.handleCloseDeletedDialog()} color="primary">
              Cancel
            </Button>
            <Button onClick={()=> this.props.handleCloseDeleted(id)} color="primary" autoFocus>
              Yes, I'm sure
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isDialogEditOpen}
          onClose={this.props.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Forgot Password`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
           
              <React.Fragment>
              <TextField
                  id="payAccEdit"
                  label="Payment account number"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="payAccEdit"
                  value={payAccEdit}
                />
                <TextField
                  id="nickNameEdit"
                  label="Nickname"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.props.handleInputChange}
                  name="nickNameEdit"
                  value={nickNameEdit}
                />
              </React.Fragment>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> this.props.handleCloseEditDialog()} color="primary">
              Cancel
            </Button>
            <Button onClick={()=> this.props.handleCloseEdit(id, payAccEdit, nickNameEdit)} color="primary" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>

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
  closeMessage: () => dispatch(messageActions.closeMessage()),
  handleCloseDeletedDialog: id => dispatch(contactsActions.handleCloseDeletedDialog(id)),
  onClosePayAcc: id => dispatch(contactsActions.onClosePayAcc(id)),
  handleCloseDeleted: (id,reload) => dispatch(contactsActions.handleCloseDeleted(id,reload)),
  onEdit: (id, toAccNumber, toNickName) => dispatch(contactsActions.onEdit(id, toAccNumber, toNickName)),
  handleCloseEditDialog: id => dispatch(contactsActions.handleCloseEditDialog(id)),
  handleCloseEdit: (id, payAccEdit, nickNameEdit, reload) => dispatch(contactsActions.handleCloseEdit(id, payAccEdit, nickNameEdit, reload))
});

export default MustBeCustomer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Contacts)
);
