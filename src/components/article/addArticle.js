import React, {Component} from 'react';
import { Layout, Breadcrumb } from 'antd';
// 引入编辑器以及EditorState子模块
import BraftEditor, { EditorState } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

class AddArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    // this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  // handleKeyCommand(command, editorState) {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     this.onChange(newState);
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // }

  // _onBoldClick() {
  //   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  // }

  // toggleInlineStyle(style) {
  //       let state = RichUtils.toggleInlineStyle(this.state.editorState, style);
  //       this.onChange(state);
  //   }
  

  render() {
    const { Content } = Layout;
    const editorProps = {
      contentFormat: 'html',
      height: 560,
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
        <div style={{ background: '#fff', padding: 24, minHeight: 560 }}>
          <BraftEditor
            editorState={this.state.editorState}
            onChange={this.onChange}
            {...editorProps}
          />
          </div>
      </Content>
    )
  }
}

export default AddArticle;
