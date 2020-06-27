import React from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  People as PeopleIcon,
  Person as PersonIcon
} from "@material-ui/icons";

export const mainListItems = (
  <div>
    <Link to="/staffs">
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Staffs" />
      </ListItem>
    </Link>
  
  <Link to="/report">
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Report" />
    </ListItem>
  </Link>
</div>
);

export const secondaryListItems = (
  <div>
    <Link to="/sign-out">
      <ListItem button>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Sign out" />
      </ListItem>
    </Link>
  </div>
);
