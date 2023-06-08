import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDeleteImg } from '../../api';

import {BASE_IMG_URL} from '../../utils/constants'


// 用于图片上传的组件
export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false,      // 标识是否显示大图预览
    previewImage: '',           // 预览大图的url
    fileList: [                 
      /*{
        uid: '-1',              // 每个file有一个唯一的Id, 自己设置时，建议设置为负数，防止冲突
        name: 'image.png',      // 图片文件名
        status: 'done',         // 图片状态：'done'已上传  'uploading'正在上传 'removed'已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',        // 图片地址
      },*/
    ],
  }

  constructor(props){
    super(props)

    let fileList = []

    // 如果传入了imgs属性
    const {imgs} = this.props
    console.log('picture-wall: imgs:::::::',imgs)
    if(imgs && imgs.length >0 ){

      console.log('picture-wall----------- imgs=',imgs)
      fileList = imgs.map((img, index) => ({
        uid: -index,  
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList  // 所有已上传图片的数组
    }
    console.log('picture-wall: fileList=',fileList)

  }

  // 获取所有已上传图片文件名的数组
  getImgs = ()=>{
    return this.state.fileList.map(file => file.name)
  }

  // 隐藏预览大图Modal
  handleCancel = () => this.setState({ previewVisible: false });

  // 显示指定文件的预览大图Modal
  handlePreview = file => {
    console.log('handlePreview()', file)

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /*
    file: 当前操作的图片文件（已上传/删除的）
    fileList: 所有已上传的图片文件对象的数组
  */
  handleChange = async ({ file, fileList }) => {
    console.log('picture-wall：handleChange()', file, file.status)   // 会在图片对象的状态改变的过程中一直被调用，一直被监听

    // 一旦上传成功，将当前上传的file的信息修正(name,url)
    if(file.status === 'done'){
      const result = file.response
      if(result.status === 0){
        message.success('上传图片成功')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else{
        message.error('上传图片失败')
      }
    } else if(file.status === 'removed'){
      const result = await reqDeleteImg(file.name)
      if(result.status === 0){
        message.success('删除图片成功！')
      } else{
        message.error('删除图片失败！')
      }
    }

    // 在操作（上传/删除）过程中及时更新fileList状态
    this.setState({ fileList })                        // 并且会一直更新状态 
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"       // 上传图片的地址
          accept='image/*'                  // 只接受所有图片格式的文件
          name='image'                      // 发送给后台的请 求参数名，默认值为'file'
          listType="picture-card"           // 图片展示的样式效果：'text' 'picture' 'picture-card'
          fileList={fileList}               // 所有已上传图片文件对象的数组
          onPreview={this.handlePreview}    // 点击缩略图上的preview file时触发
          onChange={this.handleChange}      
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: 100 }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
