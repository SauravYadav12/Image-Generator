import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Sidebar = ({ onSelectOption }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 70,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        <ListItem onClick={() => onSelectOption("dashboard")}>
          <DashboardIcon />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
