import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button, Paper
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import CreateStaff from "./CreateStaff";
import MustBeAdmin from "./HOCs/MustBeAdmin";
import * as messageActions from "../redux/actions/messageActions";
import * as staffsActions from "../redux/actions/staffsActions";
import Modal from 'react-modal';
import {Form, Input} from 'react';



class Staffs extends Component {

  constructor(props) {
    super(props)
    this.state = {
        modalIsOpen: false,
    }
}

  componentDidMount = () => {
    this.props.getStaffsList();
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  componentWillMount() {
    // Modal.setAppElement('body');
  };

  openModal() {
    this.setState({
        modalIsOpen: true,
    });
}

closeModal() {
  this.setState({
      modalIsOpen: false
  });
}

  render() {
    const {
      staffs
    } = this.props;

    console.log(staffs);

    const data = staffs.map((staff, index) => [
      index + 1,
      staff.email,
      staff.name,
      staff.phone,
      staff.createdAt,
      <Button
        variant="contained"
        color="primary"
        onClick={() => this.openModal()}
      >
        Edit
      </Button>,
      <Button
        variant="contained"
        color="primary"
    >
      Delete
    </Button>
    ]);

    console.log(data.index);

    const columns = ["#", "Email", "Name", "Phone", "Created at", "Action","Delete"];

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
        <CreateStaff onCreateAccountSucceed={this.props.getStaffsList}/>
        <MUIDataTable
          title={"Staffs list"}
          data={data}
          columns={columns}
          options={options}
          
        />
        <React.Fragment>
        <Paper className="sign-up paper form-2-cols">
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}>
          <button onClick={this.closeModal}>Close</button>
          <div>Nội dung Modal</div>
          <form>
          <table>
            <tbody>
              <tr>
                <th><label>Title</label></th>
                <td>
                  <input
                    type="text"
                    name="title"
                    value="" />
                </td>
              </tr>

              <tr>
                <th><label>Description</label></th>
                <td>
                  <textarea
                    name="description"
                    value="" />
                </td>
              </tr>

              <tr>
                <th><label>Content</label></th>
                <td>
                  <textarea
                    name="content"
                    value="" />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Edit</button>
        </form>
        </Modal>
        </Paper>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.staffs
});

const mapDispatchToProps = dispatch => ({
  getStaffsList: () => dispatch(staffsActions.getStaffsList()),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeAdmin(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Staffs)
);
