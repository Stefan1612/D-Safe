import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { HashLink } from "react-router-hash-link";
// change logo to d tweets
/* import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg"; */

import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";

import logo from "../assets/icons/logo.png";

const pages = [/* "propose", */ "roadmap", "faq"];

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{
        boxShadow: 0,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          size="large"
          aria-label="logo"
          href="/"
          sx={{ p: 0, borderRadius: 1 }}
          color="inherit"
        >
          <logo height="64px" />
        </IconButton>

        <img src={logo} alt="logo" />
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            value="closed"
            size="large"
            aria-label="open menu"
            onClick={openMenu}
            color="inherit"
            aria-controls={open ? "basic-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
          >
            <MenuIcon width="40px" height="40px" />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={closeMenu}
        >
          {pages.map((page) => (
            <MenuItem
              key={page}
              to={`#${page}`}
              component={HashLink}
              smooth
              onClick={closeMenu}
            >
              {page}
            </MenuItem>
          ))}
          <MenuItem to="#" component={HashLink} smooth onClick={closeMenu}>
            s
          </MenuItem>
        </Menu>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "flex-end",
            columnGap: 3,
            display: { xs: "none", md: "flex" },
          }}
          component="nav"
        >
          {pages.map((page) => (
            <Button
              key={page}
              size="medium"
              variant="text"
              to={`#${page}`}
              component={HashLink}
              smooth
              color="inherit"
            >
              <Typography variant="h2" component="span" sx={{ m: 0 }}>
                {page}
              </Typography>
            </Button>
          ))}
          <Button
            to="#time-machine"
            size="medium"
            component={HashLink}
            smooth
            variant="contained"
            sx={{ fontWeight: 700 }}
          >
            Archive Data
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
