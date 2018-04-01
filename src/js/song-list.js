{
  let view = {
    el: '.songList-container',
    template: `
      <ul class="songList">
      </ul>
    `,
    init() {
      this.$el = $(this.el)
      this.$el.html(this.template)
    },
    render(data) {
      let { songs } = data
      let liList = songs.map((song) => { return $('<li></li>').text(song.name) })
      this.$el.find('ul').empty()
      liList.map((li) => {
        this.$el.find('ul').append(li)
      })
    },
    clearActive() {
      $(this.el).find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs: [
        //{ id:'1', name:'1'},{ id:'2', name:'2'}
      ]
    },
    find(){
      var query = new AV.Query('Song');
      return query.find().then((songs)=>{
        this.data.songs = songs.map((song)=>{
          return {id:song.id, ...song.attributes}
        })
        return songs
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
    },
    bindEventHub() {
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}