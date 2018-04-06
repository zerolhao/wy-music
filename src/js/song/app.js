{
  let view = {
    el: '#app',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      this.$el.find('audio').attr('src',data.song.url)
    },
    play(){
      let audio = this.$el.find('audio')[0]
      audio.play()
    },
    pause(){
      let audio = this.$el.find('audio')[0]
      audio.pause()
    }
  }
  let model = {
    data: { 
      song: {id: '', name: '', singer: '', url: ''}
     },
    getSong(id) {
      var query = new AV.Query('Song');
      return query.get(id).then((song)=>{
        Object.assign(this.data.song, {id:song.id, ...song.attributes})
        return song
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      let id = this.getSongId()
      this.model.getSong(id).then(()=>{
        this.view.render(this.model.data)
        //this.view.play()
      })
      this.bindEvents()
    },
    bindEvents(){
      this.view.$el.on('click', '.icon-play', ()=>{
        this.view.$el.find('.disc-container').addClass('playing')
        this.view.play()
      })
      this.view.$el.on('click', '.icon-pause', ()=>{
        this.view.$el.find('.disc-container').removeClass('playing')        
        this.view.pause()
      })
    },
    getSongId() {
      let search = window.location.search
      if (search.indexOf('?') === 0) {
        search = search.substring(1)
      }
      let arr = search.split('&').filter(v => v)
      let id = ''
      for (let i = 0; i < arr.length; i++) {
        let kv = arr[i].split('=')
        let key = kv[0]
        let value = kv[1]
        if (key === 'id') {
          id = (value)
          break
        }
      }
      return id
    }
  }
  controller.init(view, model)
}