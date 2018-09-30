import React, {Component} from 'react';
import { Layout, Breadcrumb, Form, Select, Input, Button, Tag, Tooltip, Icon, message } from 'antd';
// 引入编辑器以及EditorState子模块
import BraftEditor, { EditorState } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import './style.css'
const FormItem = Form.Item

class AddArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      tags: ['感叹号的文章', 'CSS', '翻译'],
      inputVisible: false,
      inputValue: ''
    };
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

    handleSubmit = (e) => {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          this.addPost(values)
        }
      })
    }
  
    saveInputRef = input => this.input = input

  addPost = (values) => {
    let data = {
      author: values.author,
      taxonomyId: values.taxonomyId,
      tags: this.state.tags.toString(),
      name: this.state.tags.toString(),
      title: values.title,
      excerpt: values.excerpt,
      content: values.content.toHTML()
    }

		var myFetchOptions = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			  },
      credentials: 'include',
      body: JSON.stringify(data)
    };

    fetch('/newPost', myFetchOptions)
    .then(response => {
      if (response.status !== 200) {
          throw new Error('未请求成功，状态码为' + response.status)
      }
      response.json().then( json => {
          console.log(`请求成功，状态码为${response.status}`)
          message.success('发表文章成功！', 20);
        }
      )
    })
  }

  render() {
    const { Content } = Layout;
    const { TextArea } = Input;
    const { tags, inputVisible, inputValue } = this.state;
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form
    const editorProps = {
      contentFormat: 'html',
      initialContent: '',
      height: 300,
      media: {
        image: true, // 开启图片插入功能
        uploadFn: this.uploadFn // 指定上传函数，说明见下文
      },
      placeholder: '冲鸭！感叹号'
    }

    return (
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Article</Breadcrumb.Item>
          <Breadcrumb.Item>AddArticle</Breadcrumb.Item>
          </Breadcrumb>
        <Form style={{ background: '#fff', margin: 24, padding: 16, minHeight: 540 }} onSubmit={this.handleSubmit}>
          {getFieldDecorator('taxonomyId', {
              initialValue: '1',
              rules: [{ required: true, message: '请选择分类!' }]
             })(
            <Select style={{ width: 120 }} >
              <Option value="1">学习</Option>
              <Option value="2">生活</Option>
              <Option value="3">转载</Option>
            </Select>)
          }
          <FormItem>
            <label>题目：</label>
            {getFieldDecorator('title', {
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
              rules: [{ required: true, message: '文章摘要!' }]
              })(<TextArea rows={4} placeholder="摘要" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('content', {
                rules: [{ required: true, message: '文章内容!' }]
              })(<BraftEditor
              editorState={this.state.editorState}
              {...editorProps}
            />)}
          </FormItem>
          <Button type="primary" htmlType="submit">发表文章</Button>
        </Form>
      </Content>
    )
  }
}

export default Form.create()(AddArticle);;
