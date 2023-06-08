import React ,{Component} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import { Form, Icon, Input, Button, Divider } from 'antd';


import Login from "./pages/login/login"
import Admin from "./pages/admin/admin"

export default class App extends Component {

  render(){
    return (
      <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/" component={Admin}></Route>
          </Switch>
      </BrowserRouter>
      // <div>
      //   <Button type="primary">Primary</Button>
        
      // </div>
    );
  }
}


{/* <div>
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
  >
  <Button type="primary" onClick={this.handleClick}>Primary</Button>
  <Button type="primary">Button</Button>
  </ConfigProvider>
</div> */}