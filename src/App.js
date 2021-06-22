import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Associations from './Associations';
import NewAssociation from './NewAssociation';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3, 0, 3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            רישום עמותות
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <Container>
          <Router>
            <Switch>
              <Route path="/associations">
                <Associations />
              </Route>
              <Route path="/new-association">
                 <NewAssociation />
              </Route>
              <Route path="/">
                <Associations />
              </Route>
            </Switch>
          </Router>
        </Container>
      </div>
    </>
  );
}

export default App;