import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, AppBar, Toolbar, Button, Typography, Tabs, Tab } from "@mui/material";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import { selectAuth } from "../redux/store";
import { NAV_TABS } from "../constants/staticData";

const Header = () => {
  const { isLogin } = useSelector(selectAuth);
  const { handleLogout } = useAuth();
  const [value, setValue] = useState(false);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h4">BLOG APP</Typography>

        {isLogin && (
          <Box display="flex" marginLeft="auto" marginRight="auto">
            <Tabs
              textColor="inherit"
              value={value}
              onChange={(e, val) => setValue(val)}
            >
              {NAV_TABS.map((tab) => (
                <Tab key={tab.to} label={tab.label} LinkComponent={Link} to={tab.to} />
              ))}
            </Tabs>
          </Box>
        )}

        <Box display="flex" marginLeft="auto">
          {!isLogin ? (
            <>
              <Button sx={{ margin: 1, color: "white" }} LinkComponent={Link} to="/login">
                Login
              </Button>
              <Button sx={{ margin: 1, color: "white" }} LinkComponent={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} sx={{ margin: 1, color: "white" }}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
