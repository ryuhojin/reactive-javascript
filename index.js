class Bframe {
  constructor(state) {
    this.data = new Proxy(state.data, {
      set: function (target, key, value) {
        target[key] = value;
        let model = document.querySelectorAll("[b-model]");
        model.forEach((el) => {
          let key = el.getAttribute("b-model");
          if (this.data[key] != null) {
            el.value = this.data[key];
          }
        });
        return true;
      },
    });
    this.initModel(this.data);
  }
  initModel(data) {
    let modelElements = document.querySelectorAll("[b-model]");
    modelElements.forEach((el) => {
      let key = el.getAttribute("b-model");
      el.addEventListener("input", function (e) {
        data[key] = e.target.value;
      });
    });
  }
}
