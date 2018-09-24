import React, {Component} from 'react';
import { Layout, Breadcrumb, Select, Input, Button, Tag, Tooltip, Icon } from 'antd';
// 引入编辑器以及EditorState子模块
import BraftEditor, { EditorState } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import './style.css'

class AddArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: '',
      author: 'huanranc',
      tags: ['学习', 'CSS', '翻译'],
      excerpt: '',
      content: '',
      inputVisible: false,
      inputValue: '',
      taxonomyId: '1'
    };
  }

    handleChange = (value) => { this.setState({ taxonomyId: value }) }

    titleChange = (e) => {
      this.setState({ title: e.target.value });
    }

    authorChange = (e) => {
      this.setState({ author: e.target.value })
    }

    excerptChange = (e) => {
      this.setState({ excerpt: e.target.value })
    }
  
    contentChange = (editorState) => this.setState({ content: editorState.toHTML() })

    handleClose = (removedTag) => {
      const tags = this.state.tags.filter(tag => tag !== removedTag);
      console.log(tags);
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

  addPost = () => {
    let data = {
      author:this.state.author,
      taxonomyId:this.state.taxonomyId,
      name:this.state.tags.toString(),
      title:this.state.title,
      excerpt: this.state.excerpt,
      content:this.state.content
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
          console.log(`返回${JSON.stringify(json)}`)
        }
      )
    })
  }

  render() {
    const { Content } = Layout;
    const { TextArea } = Input;
    const { tags, inputVisible, inputValue } = this.state;
    const Option = Select.Option;
    const editorProps = {
      contentFormat: 'html',
      initialContent: '',
      height: 400,
      media: {
        image: true, // 开启图片插入功能
        uploadFn: this.uploadFn // 指定上传函数，说明见下文
      },
      onChange: this.contentChange,
      placeholder: '冲鸭！感叹号'
    }

    return (
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Article</Breadcrumb.Item>
          <Breadcrumb.Item>AddArticle</Breadcrumb.Item>
          </Breadcrumb>
        <div style={{ background: '#fff', margin: 24, padding: 16, minHeight: 540 }}>
          <div className="drafit-control" style={{ margin: 16}}>
            <div>
              <Select defaultValue="1" style={{ width: 120, padding: 16 }} onChange={this.handleChange} >
                <Option value="1">学习</Option>
                <Option value="2">生活</Option>
              </Select>
              <label>题目：</label>
              <Input placeholder="文章标题" style={{ margin: 16, width: 200}} onChange={this.titleChange} />
              <label>作者：</label>
              <Input placeholder="作者" defaultValue="huanranc" style={{ margin: 16, width: 200}} onChange={this.authorChange} />
            </div>
            <div style={{ margin: 16}}>
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
            </div>
            <div style={{ margin: 16}}>
              <label>摘要：</label>
              <TextArea rows={4} placeholder="摘要" onChange = {this.excerptChange} />
            </div>
          </div>
            <BraftEditor
              editorState={this.state.editorState}
              onChange={this.onChange}
              {...editorProps}
            />
            <Button type="primary" style={{marginLeft: 32}} onClick = {this.addPost}>发表文章</Button>
          </div>
      </Content>
    )
  }
}

export default AddArticle;
