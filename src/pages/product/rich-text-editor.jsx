import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'


export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(),
    }

    constructor(props) {
        super(props);
        const html = this.props.detail
        if(html){
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {     // 检查该内容是否符合html格式
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState)
            this.state = {
                editorState,
            }
        }
    } else{
        this.state = {
            editorState: EditorState.createEmpty()
        }
    }
    
}

    getDetail =()=>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        });
    }

    uploadImageCallBack = (file) => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload')
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              const url = response.data.url //得到图片地址
              resolve({data: {link:url}});
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                toolbar={{
                inline: {
                    bold: { className: 'demo-option-custom' },
                    italic: { className: 'demo-option-custom' },
                    underline: { className: 'demo-option-custom' },
                    strikethrough: { className: 'demo-option-custom' },
                    monospace: { className: 'demo-option-custom' },
                    superscript: { className: 'demo-option-custom' },
                    subscript: { className: 'demo-option-custom' },
                },
                blockType: { className: 'demo-option-custom-wide', dropdownClassName: 'demo-dropdown-custom' },
                fontSize: { className: 'demo-option-custom-medium' },
                list: {
                    unordered: { className: 'demo-option-custom' },
                    ordered: { className: 'demo-option-custom' },
                    indent: { className: 'demo-option-custom' },
                    outdent: { lassName: 'demo-option-custom' },
                },
                textAlign: {
                    left: { className: 'demo-option-custom' },
                    center: { className: 'demo-option-custom' },
                    right: {  className: 'demo-option-custom' },
                    justify: { className: 'demo-option-custom' },
                },
                fontFamily: { className: 'demo-option-custom-wide', dropdownClassName: 'demo-dropdown-custom' },
                colorPicker: { className: 'demo-option-custom', popupClassName: 'demo-popup-custom' },
                link: {
                    popupClassName: 'demo-popup-custom',
                    link: { className: 'demo-option-custom' },
                    unlink: { className: 'demo-option-custom' },
                },
                emoji: { className: 'demo-option-custom', popupClassName: 'demo-popup-custom' },
                embedded: { className: 'demo-option-custom', popupClassName: 'demo-popup-custom' },
                image: { className: 'demo-option-custom', popupClassName: 'demo-popup-custom' },
                remove: { className: 'demo-option-custom' },
                history: {
                    undo: {className: 'demo-option-custom' },
                    redo: { className: 'demo-option-custom' },
                },
                }}
            />
        );
    }
}