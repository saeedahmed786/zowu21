import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Home } from './pages/Home/Home';
import 'antd/dist/antd.css';
import { Userpage } from './pages/UserPage/Userpage';

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/user' component={Userpage} />
        </Switch>
      </BrowserRouter>

    </div>
  )
}

export default App;
