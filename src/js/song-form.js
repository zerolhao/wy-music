{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
        <div class="row">
          <label>歌名</label>
          <input type="text" name='name' value='__name__'>
        </div>
        <div class="row">
          <label>歌手</label>
          <input type="text" name='singer' value='__singer__'>
        </div>
        <div class="row">
          <label>外链</label>
          <input type="text" name='url' value='__url__'>
        </div>
        <div class="row actions">
          <button type="submit">保存</button>
        </div>
      </form>
      `,
    render(data = {}) {
      let placeholders = 'name singer url'.split(' ')
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
      if(data.id){
        this.$el.prepend('<h1>编辑歌曲</h1>')
      }else{
        this.$el.prepend('<h1>新建歌曲</h1>')    
      }
    },
    reset() {
      this.render({})
    }
  }
  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: ''
    },
    create(data) {
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set('name', data.name);
      song.set('url', data.url);
      song.set('singer', data.singer);
      // 设置优先级
      //song.set('priority',1);
      return song.save().then((newSong) => {
        let { id, attributes } = newSong
        //this.data = {id, ...attributes}  data 地址变更
        Object.assign(this.data, { id, ...attributes }) // data 地址不变更
      }, (error) => {
        console.error(error);
      });
    },
    updata(data) {
      var song = AV.Object.createWithoutData('Song', this.data.id);
      song.set('name', data.name);
      song.set('url', data.url);
      song.set('singer', data.singer);
      return song.save().then((oldSong)=>{
        let { id, attributes } = oldSong
        Object.assign(this.data, { id, ...attributes })
        return oldSong
      }, (error) => {
        console.error(error);
      });
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        let needs = 'name singer url'.split(' ')
        let data = {}
        needs.map((string) => {
          data[string] = this.view.$el.find(`[name=${string}]`).val()
        })
        if(this.model.data.id){
          this.model.updata(data)
            .then((e)=>{
              console.log()
            })
        }else{
        this.model.create(data)
          .then(() => {
            this.view.reset()
            let songData = JSON.parse(JSON.stringify(this.model.data))
            window.eventHub.emit('create', songData)
          })
        }
      })
    },
    bindEventHub(){
      window.eventHub.on('upload', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',()=>{
        this.model.data = {
          name: '', url:'', singer:'', id:''
        }
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}