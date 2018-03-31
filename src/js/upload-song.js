{
  let view = {
    el: '.uploadArea',
    // 如果你确定这部分页面不会更新，那么就不将 html 代码放到 template 里
    find(selector){
      return $(this.el).find(selector)[0] // 注意我们返回的是 dom 元素
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.initQiniu()
    },
    initQiniu() {
      var uploader = Qiniu.uploader({
        disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
        runtimes: 'html5', // 上传模式,依次退化
        browse_button: this.view.find('#uploadBtn'), // 上传选择的点选按钮，**必需**
        uptoken_url: 'http://localhost:8888/uptoken', // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的 uptoken
        domain: 'p6az32xea.bkt.clouddn.com', // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
        max_file_size: '40mb', // 最大文件体积限制
        flash_swf_url: 'path/of/plupload/Moxie.swf', //引入 flash,相对路径
        max_retries: 3, // 上传失败最大重试次数
        dragdrop: true, // 开启可拖曳上传
        drop_element: this.view.find('#uploadContainer'), // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', // 分块上传时，每块的体积
        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        init: {
          'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          'BeforeUpload': function(up, file) {
            // 每个文件上传前,处理相关的事情
          },
          'UploadProgress': function(up, file) {
            // 每个文件上传时,处理相关的事情
          },
          // 文件上传成功后调用 FileUploaded
          'FileUploaded': function(up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            var domain = up.getOption('domain');
            var response = JSON.parse(info.response);
            var url = 'http://' + domain + '/' + encodeURIComponent(response.key);
            window.eventHub.emit('upload',{
              url: url,
              name: response.key
            })
          },
          'Error': function(up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          'UploadComplete': function() {
            //队列文件处理完毕后,处理相关的事情
          }
        }
      });
    },
  }
  controller.init(view, model)
}