import React, {Component} from 'react';
import { Layout, Breadcrumb, Table, Divider, Tag, Modal, Button } from 'antd';

class ManageArticle extends Component {
  constructor(props) {
    super(props);
    this.nameTaxoAll = ['学习','生活','转载']
    this.state = {
      id: 0,
      article: ''
    }
  }

  componentDidMount() {
    this.articles();
  }

  articles() {
    const fetchOptions = {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    }

    const data = []

    fetch('/posts', fetchOptions)
      .then(response => {
        if (response.status !== 200) {
          throw new Error('未请求成功，状态码为' + response.status)
      }
      response.json().then(json => json.posts.map(item => {
          let newItem = {}
          newItem.id = item.id
          newItem.key = item.id
          newItem.title = item.title
          newItem.excerpt = item.excerpt
          newItem.nameTaxo = this.nameTaxoAll[item.taxonomyId - 1]
          newItem.tags = item.tags.split(',')
          newItem.time = this.timeCreate(item.date)
          newItem.status = item.status ? "显示":"隐藏"
          data.push(newItem)
          return this.setState({
            id: item.id,
            article: [data]
          })
      }))
    })
  }

  deletArticle(id) {
    const confirm = Modal.confirm;
    const that = this
    confirm({
      title: '确定删除吗?',
      content: '单击“确定”按钮后，此对话框将在1秒后关闭',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve() : reject, 1000);
        }).then(function() {
          const fetchOptions = {
            method: 'PATCH',
            credentials: 'include',
            mode: 'cors'
          }
      
          fetch('/delPost/' + id, fetchOptions)
            .then(response => {
              if (response.status !== 200) {
                throw new Error('未请求成功，状态码为' + response.status)
              }
              console.log(that)
              that.articles()
            })
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }

  timeCreate(time) {
    let unix = time * 1000
    let unixTime = new Date(unix)
    let y = unixTime.getFullYear()
    let m = (unixTime.getMonth() + 1) >= 10 ? (unixTime.getMonth() + 1) : '0' + (unixTime.getMonth() + 1)
    let d = unixTime.getDate() >= 10 ? unixTime.getDate() : '0' + unixTime.getDate()
    return y + '年' + m + '月' + d + '日'
  }

  render() {
    const columns = [{
      title: '文章分类',
      dataIndex: 'nameTaxo',
      key: 'nameTaxo',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '文章摘要',
      dataIndex: 'excerpt',
      key: 'excerpt',
    }, 
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
        </span>
      ),
    }, 
    {
      title: '发表时间',
      dataIndex: 'time',
      key: 'time',
      render: text => <a href="javascript:;">{text}</a>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => <a href="javascript:;">{text}</a>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <span>
          <a href="javascript:;">编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.deletArticle.bind(this, this.state.id)}>删除</a>
        </span>
      ),
    }];

    const {article} = this.state;
    let data = []
    /* eslint-disable no-unused-expressions */
    article.length ?  article[0].map(
      items => {
        data.push(items)
      }
    ):""
    /* eslint-enable */
    const { Content } = Layout;
    return (
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Article</Breadcrumb.Item>
          <Breadcrumb.Item>ManageArticle</Breadcrumb.Item>
        </Breadcrumb>
        <Table columns={columns} dataSource={data} />
      </Content>
    )
  }
}

export default ManageArticle;