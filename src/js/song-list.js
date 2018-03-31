{
  let view = {
    el: '.songList-container',
    template: `
      <ul class="songList">
      </ul>
    `,
    init(){
      this.$el = $(this.el)
      this.$el.html(this.template)
    },
    render(data){
      let {songs} = data
      let liList = songs.map((song)=>{return $('<li></li>').text(song.name)})
      this.$el.find('ul').empty()
      liList.map((li)=>{
        this.$el.find('ul').append(li)
      })
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs: [
        //{ id:'1', name:'1'},{ id:'2', name:'2'}
      ]
    }
  }
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload',()=>{
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData)=>{
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}