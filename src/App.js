import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Editor, EditorState} from 'draft-js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    return (
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

export default App;
