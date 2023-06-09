class Bframe {
  constructor(state) {
    this.syncDom = this.syncDom.bind(this);
    this.data = new Proxy(state.data, {
      set: (target, key, value) => {
        target[key] = value;
        this.syncDom();
        return true;
      },
    });
    this.initModel(this.data);
  }

  syncDom() {
    let model = document.querySelectorAll("[b-model]");
    model.forEach((el) => {
      let key = el.getAttribute("b-model");
      if (this.data[key] != null) {
        el.value = this.data[key];
      }
    });
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
