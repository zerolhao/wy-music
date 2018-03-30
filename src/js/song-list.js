{
  let view = {
    el: '.songList-container',
    template: `
      <ul class="songList">
        <li class="active">song 1</li>
        <li>song 2</li>
        <li>song 3</li>
      </ul>
    `,
    render(data){
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
    }
  }
  controller.init(view, model)
}