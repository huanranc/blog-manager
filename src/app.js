import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/layout/header/index'
import Footer from './components/layout/footer/index'
import AddArticle from './components/article/addArticle'
import ManageArticle from './components/article/manaeArticle'

const App = () => {
  return (
    <Router>
      <Layout className="container-body">
        <Header />
         <div>
            <Switch>
              <Route exact path="/" component={AddArticle}></Route>
              <Route path="/manager" component={ManageArticle}></Route>
            </Switch>
         </div>
        <Footer />
      </Layout>
    </Router>
  );
};
export default App;
