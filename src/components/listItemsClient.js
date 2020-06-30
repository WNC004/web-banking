import React from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  BarChart as BarChartIcon,
  Contacts as ContactsIcon,
  ExitToApp as ExitToAppIcon ,
  List as ListIcon,
  VpnKey as VpnKeyIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Public as PublicIcon,
} from "@material-ui/icons";

export const mainListItems = (
  <div>
    <Link to="/payment-accounts">
      <ListItem button>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Payment Accounts" />
      </ListItem>
    </Link>
    <Link to="/internal-transfers">
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Internal transfers" />
      </ListItem>
    </Link>
    <Link to="/external-transfers">
      <ListItem button>
        <ListItemIcon>
          <PublicIcon />
        </ListItemIcon>
        <ListItemText primary="External transfers" />
      </ListItem>
    </Link>
    <Link to="/contacts">
      <ListItem button>
        <ListItemIcon>
          <ContactsIcon />
        </ListItemIcon>
        <ListItemText primary="Contacts" />
      </ListItem>
    </Link>
    <Link to="/debt">
      <ListItem button>
        <ListItemIcon>
          <AccountBalanceWalletIcon />
        </ListItemIcon>
        <ListItemText primary="Debt" />
      </ListItem>
    </Link>
    <Link to="/change-password">
      <ListItem button>
        <ListItemIcon>
          <VpnKeyIcon />
        </ListItemIcon>
        <ListItemText primary="Change password" />
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
