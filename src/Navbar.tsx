import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { ThemeContext, DispatchThemeContext } from "./ThemeContext";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: "flex",
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
    },
    logoImage: {
      height: "32px",
    },
  })
);

export default function ButtonAppBar() {
  const classes = useStyles();
  const darkMode = useContext(ThemeContext);
  const dispatchTheme = useContext(DispatchThemeContext);

  const handleThemeChangeMenu = () => {
    dispatchTheme({ type: darkMode === "dark" ? "light" : "dark" });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Shorts
          </Typography>
          <IconButton
            aria-label="toggle dark mode"
            aria-controls="toggle dark mode"
            aria-haspopup="false"
            onClick={handleThemeChangeMenu}
            color="inherit"
          >
            {darkMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
