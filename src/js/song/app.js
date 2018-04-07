{
  let view = {
    el: '#app',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let {song,status} = data
      this.$el.css('background-image', `url(${song.cover})`)
      this.$el.find('img.cover').attr('src',song.cover)
      this.$el.find('audio').attr('src',song.url)
      if(status === 'playing'){this.play()
      }else{this.pause }
      this.$el.find('.song-description>h1').text(song.name)
      let {lyrics} = song
      lyrics.split('\n').map((string)=>{
        let p = document.createElement('p')
        let regex = /\[([\d:.]+)\](.+)/
        let matches =string.match(regex)
        if(matches){
          p.textContent = matches[2]
          let time = matches[1]
          let parts = time.split(':')
          let minutes = parts[0]
          let seconds = parts[1]
          let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
          p.setAttribute('data-time', newTime)
        }else{
          p.textContent = string
        }
        this.$el.find('.lyric>.lines').append(p)
      })
    },
    play(){
      this.$el.find('.disc-container').addClass('playing')
      let audio = this.$el.find('audio')[0]
      audio.play()
    },
    pause(){
      this.$el.find('.disc-container').removeClass('playing')
      let audio = this.$el.find('audio')[0]
      audio.pause()
    },
    showLyric(time){
      let allP = this.$el.find('.lyric>.lines>p')
      let p 
      for(let i =0;i<allP.length;i++){
        if(i===allP.length-1){
          p = allP[i]
          break
        }else{
          let currentTime = allP.eq(i).attr('data-time')
          let nextTime = allP.eq(i+1).attr('data-time')
          if(currentTime <= time && time < nextTime){
            p = allP[i]
            break
          }
        }
      }
      let pHeight = p.getBoundingClientRect().top
      let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
      let height = pHeight - linesHeight
      this.$el.find('.lyric>.lines').css({
        transform: `translateY(${- (height - 24)}px)`
      })
      $(p).addClass('active').siblings('.active').removeClass('active')
    }
  }
  let model = {
    data: { 
      song: {id: '', name: '', singer: '', url: '', cover:'',lyrics:''},
      status: 'paused'
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
        this.view.play()
      })
      this.view.$el.on('click', '.icon-pause', ()=>{        
        this.view.pause()
      })
      let audio = this.view.$el.find('audio').get(0)
      audio.onended = ()=>{ this.view.pause() }
      audio.ontimeupdate = ()=>{
        this.view.showLyric(audio.currentTime)
      }
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