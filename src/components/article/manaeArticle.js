import React, {Component} from 'react';
import { Layout, Breadcrumb, Table, Divider, Tag } from 'antd';

class ManageArticle extends Component {
  constructor(props) {
    super(props);
    this.nameTaxoAll = ['学习','生活','转载']
    this.state = {
      article: ''
    }
  }

  componentDidMount() {
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
            article: [data]
          })
      }))
    })
  }

  timeCreate(time) {
    let unix = time * 1000
    let unixTime = new Date(unix)
    let y = unixTime.getFullYear()
    let m = (unixTime.getMonth() + 1) > 10 ? (unixTime.getMonth() + 1) : '0' + (unixTime.getMonth() + 1)
    let d = unixTime.getDate() > 10 ? unixTime.getDate() : '0' + unixTime.getDate()
    return y + '-' + m + '-' + d
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
          <a href="javascript:;">删除</a>
        </span>
      ),
    }];

    const {article} = this.state;
    let data = []
    article.length > 0 ? article[0].map(items => {
          data.push(items)
    }):{}
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