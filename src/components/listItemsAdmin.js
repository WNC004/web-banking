import React from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon ,
  PieChart as PieChartIcon
} from "@material-ui/icons";

export const mainListItems = (
  <div>
    <Link to="/staffs">
      <ListItem button>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Staffs" />
      </ListItem>
    </Link>
  
  <Link to="/report">
    <ListItem button>
      <ListItemIcon>
        <PieChartIcon />
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
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Sign out" />
      </ListItem>
    </Link>
  </div>
);
