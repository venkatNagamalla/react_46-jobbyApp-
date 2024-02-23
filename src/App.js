import {Switch, Redirect, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import EachJob from './components/EachJob'
import Jobs from './components/Jobs'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import NotFound from './components/NotFound'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={EachJob} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
