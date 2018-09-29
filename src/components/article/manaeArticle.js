import React, {Component} from 'react';
import { Layout, Breadcrumb, Table, Divider, Tag } from 'antd';

class ManageArticle extends Component {
  constructor(props) {
    super(props);
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
          newItem.time = this.timeCreate(item.date)
          newItem.status = item.status
          fetch('/term', {
            method: 'post',
            credentials: 'include',
            mode: 'cors',
            body: item.id
          }).then(res => {
            if (res.status !== 200) {
              throw new Error('未请求成功，状态码为' + res.status)
            }
            res.json().then(json => {
              newItem.tags = json.message.term.split(','),
              newItem.nameTaxo = json.message.nameTaxo,
              newItem.taxonmyDes = json.message.taxonmyDes
            })
          })
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
          {tags!==undefined?tags.map(tag => <Tag color="blue" key={tags}>{tags}</Tag>): ''}
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
        </span>
      ),
    }];

    const {article} = this.state;
    let data = []
    article.length > 0 ? article[0].map(items => {
          data.push(items)
    }):{}
    // const data = [{
    //   key: '1',
    //   taxonomy: 'John Brown',
    //   title: '文章',
    //   excerpt: 'New York No. 1 Lake Park',
    //   status: '显示',
    //   time: '2018/9/18',
    //   tags: ['nice', 'developer']
    // }];
    console.log(data.nameTaxo)
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