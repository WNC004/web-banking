import React from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  AccessTime as AccessTimeIcon,
  ExitToApp as ExitToAppIcon ,
  List as ListIcon,
  AccountCircle as AccountCircleIcon,
} from "@material-ui/icons";

export const mainListItems = (
  <div>
    <Link to="/customers">
      <ListItem button>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItem>
    </Link>
    <Link to="/payment-accounts-staff">
      <ListItem button>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Payment accounts" />
      </ListItem>
    </Link>
    <Link to="/history-staff">
      <ListItem button>
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText primary="History" />
      </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    <Link to="/sign-out">
      <ListItem button>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Sign out" />
      </ListItem>
    </Link>
  </div>
);
