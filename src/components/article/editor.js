import React, {Component} from 'react';
// 引入编辑器以及EditorState子模块
import BraftEditor, { EditorState } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

class Editor extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (content) => {
    if (this.props.onChange) {
      this.props.onChange(content.toHTML())
    }
  }
  

  render() {
    const editorProps = {
      contentFormat: 'html',
      height: 300,
      defaultValue: EditorState.createFrom(this.props.value),
      media: {
        image: true, // 开启图片插入功能
        uploadFn: this.uploadFn // 指定上传函数，说明见下文
      },
      placeholder: '冲鸭！感叹号',
      onChange: this.handleChange
    }
    return (
      <div>
        <BraftEditor  {...editorProps} />
      </div>
    )
  }
}

export default Editor