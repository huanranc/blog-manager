import React, {Component} from 'react';
import { Layout, Breadcrumb, Table, Divider, Tag, Modal, Form, Select, Input, Button, Tooltip, Icon, Switch, message } from 'antd';
import Editor from './editor';
const FormItem = Form.Item
class ManageArticle extends Component {
  constructor(props) {
    super(props);
    this.nameTaxoAll = ['学习','生活','转载']
    this.state = {
      article: '',
      visible: false,
      tags: ['感叹号的文章', 'CSS', '翻译'],
      inputVisible: false,
      inputValue: '',
      status: true,
      update:{}
    }
  }

  componentDidMount() {
    this.articles();
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }
  
  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  saveInputRef = input => this.input = input

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
          newItem.taxonomyId = item.taxonomyId
          newItem.title = item.title
          newItem.excerpt = item.excerpt
          newItem.content = item.content
          newItem.nameTaxo = this.nameTaxoAll[item.taxonomyId - 1]
          newItem.tags = item.tags.split(',')
          newItem.time = this.timeCreate(item.date)
          newItem.status = item.status
          data.push(newItem)
          return this.setState({
            article: [data],
            status: item.status
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

  showModal = (action) => {
    this.setState({
      visible: true,
      update: action,
      tags: action.tags
    });

    console.log(this.state.update)
  }

  
  handleSubmit = (id, e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.updatePost(values, id)
      }
    })
  }

  updatePost = (values, id) => {
    const that = this
    let data = {
      author: values.author,
      taxonomyId: values.taxonomyId,
      status: this.state.status,
      tags: this.state.tags.toString(),
      name: this.state.tags.toString(),
      title: values.title,
      excerpt: values.excerpt,
      content: values.content
    }

		var myFetchOptions = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			  },
      credentials: 'include',
      body: JSON.stringify(data)
    };

    fetch('/updatePost/' + id, myFetchOptions)
    .then(response => {
      if (response.status !== 200) {
          throw new Error('未请求成功，状态码为' + response.status)
      }
      console.log(`请求成功，状态码为${response.status}`)
      console.log(that)
      that.articles()
      setTimeout(message.success('更新文章成功！', 20), 1000);
    })
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleSwitch = (checked) => {
    console.log(checked);

    this.setState({
      status: checked
    })
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
      render: Boolean => <a href="javascript:;">{Boolean?"显示":"隐藏"}</a>
    },
    {
      title: '操作',
      key: 'action',
      render: action => (
        <span>
          <a href="javascript:;" onClick={this.showModal.bind(this, action)}>编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.deletArticle.bind(this, action.id)}>删除</a>
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
    const { TextArea } = Input;
    const { tags, inputVisible, inputValue } = this.state;
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;

    return (
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Article</Breadcrumb.Item>
          <Breadcrumb.Item>ManageArticle</Breadcrumb.Item>
        </Breadcrumb>
        <Table columns={columns} dataSource={data} />
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        <Form style={{ background: '#fff', margin: 24, padding: 16, minHeight: 540 }} onSubmit={this.handleSubmit}>
           {getFieldDecorator('taxonomyId', {
              initialValue: `${this.state.update.taxonomyId}`,
              rules: [{ required: true, message: '请选择分类!' }]
            })(
            <Select style={{ width: 120 }} >
              <Option value="1">学习</Option>
              <Option value="2">生活</Option>
              <Option value="3">转载</Option>
            </Select>)
          }
          <FormItem>
            <label>是否显示：</label>
              {getFieldDecorator('status', {
              initialValue: `${this.state.update.status}`,
              rules: [{ required: true, message: '显示!' }]
              })(<Switch defaultChecked = {this.state.update.status} onChange= {this.handleSwitch}/>)}
          </FormItem>
          <FormItem>
            <label>题目：</label>
            {getFieldDecorator('title', {
              initialValue: `${this.state.update.title}`,
              rules: [{ required: true, message: '请填写文章标题!' }]
            })(
            <Input placeholder="文章标题" style={{ margin: 16, width: 200 }} />
            )}
          </FormItem>
          <FormItem>
            <label>作者：</label>
            {getFieldDecorator('author', {
              initialValue: 'huanranc',
              rules: [{ required: true, message: '作者!' }]
            })(<Input placeholder="作者" style={{ margin: 16, width: 200 }} />)}
          </FormItem>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag key={tag} closable={index !== 0} afterClose={() => this.handleClose(tag)}>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus" /> 新标签
                  </Tag>
          )}
          <FormItem>
            <label>摘要：</label>
              {getFieldDecorator('excerpt', {
              initialValue: `${this.state.update.excerpt}`,
              rules: [{ required: true, message: '文章摘要!' }]
              })(<TextArea rows={4} placeholder="摘要" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('content', {
              initialValue: `${this.state.update.content}`,
              rules: [{ required: true, message: '文章内容!' }]
              })(<Editor
            />)}
          </FormItem>
          <Button type="primary" onClick={this.handleSubmit.bind(this, this.state.update.id)}>更新文章</Button>
        </Form>
        </Modal>
      </Content>
    )
  }
}

export default Form.create()(ManageArticle);