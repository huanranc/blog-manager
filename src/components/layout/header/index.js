import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import { Layout, Menu } from 'antd';

class BlogHeader extends Component {
  render() {
    const { Header } = Layout;

    return (
      <Header>
        <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">
          <NavLink to="/">
            发表文章
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/manager">
           管理文章
          </NavLink>
        </Menu.Item>
      </Menu>
      </Header>
    )
  }
}

export default BlogHeader;
