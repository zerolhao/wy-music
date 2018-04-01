{
  let view = {
    el: '.newSong',
    template: `新建歌曲`,
    render(data){
      $(this.el).html(this.template)
    },
    deactive(){
      $(this.el).removeClass('active')
    },
    active(){
      $(this.el).addClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.view.active()
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      $(this.view.el).on('click',()=>{
        this.view.active()
        window.eventHub.emit('new')
      })
    },
    bindEventHub(){
      window.eventHub.on('upload',(data)=>{
        this.view.active()
      })
      window.eventHub.on('select',()=>{
        this.view.deactive()
      })
    }
  }
  controller.init(view, model)
}