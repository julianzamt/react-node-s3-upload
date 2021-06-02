import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Proyectos from "./pages/Proyectos";
import Obras from "./pages/Obras";
import Obra from "./pages/Obra";
import { Route, Switch } from "react-router";
import Header from "./components/Header";

import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/obras" component={Obras} />
        <Route exact path="/proyectos" component={Proyectos} />
        <Route path="/obras/:id" component={Obra} />
      </Switch>
    </div>
  );
}

export default App;
