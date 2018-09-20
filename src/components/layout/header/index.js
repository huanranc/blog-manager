import React, {Component} from 'react';
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
        <Menu.Item key="1">发表文章</Menu.Item>
        <Menu.Item key="2">管理文章</Menu.Item>
      </Menu>
      </Header>
    )
  }
}

export default BlogHeader;
