import React from 'react';
import { Layout } from 'antd';
import Header from './components/layout/header/index'
import Footer from './components/layout/footer/index'
import AddArticle from './components/article/addArticle'

const App = () => {
  return (
    <Layout className="container-body">
        <Header />
        <AddArticle />
        <Footer />
    </Layout>
  );
};
export default App;
