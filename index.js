class Bframe {
  constructor(options) {
    this.$options = options;
    this.$el = document.querySelector(options.el);
    this.$data = new Proxy(options.data, this.getHandler());
    this.$methods = this.bindMethods(options.methods, this);
    this.$mounted = options.mounted;
    this.$nextTickQueue = [];
    this.initializeDOM();
    this.runMounted();
  }

  getHandler() {
    return {
      get: (target, key, receiver) => Reflect.get(target, key, receiver),
      set: (target, key, value, receiver) => {
        const result = Reflect.set(target, key, value, receiver);
        this.updateDOM(key);
        return result;
      }
    };
  }

  bindMethods(methods, context) {
    let boundMethods = {};
    for (let key in methods) {
      boundMethods[key] = methods[key].bind(context);
    }
    return boundMethods;
  }

  runMounted() {
    if (this.$mounted) {
      this.$mounted.call(this);
    }
  }

  nextTick(callback) {
    this.$nextTickQueue.push(callback);
    Promise.resolve().then(() => {
      while (this.$nextTickQueue.length > 0) {
        const nextTickCallback = this.$nextTickQueue.shift();
        nextTickCallback.call(this);
      }
    });
  }

  initializeDOM() {
    const bindings = Array.from(this.$el.querySelectorAll('[b-model]'));
    bindings.forEach(element => {
      const key = element.getAttribute('b-model');
      this.updateElement(element, this.$data[key]);
      element.addEventListener('input', e => {
        this.$data[key] = e.target.value;
      });
    });
  }

  updateDOM(key) {
    const bindings = Array.from(this.$el.querySelectorAll(`[b-model=${key}]`));
    bindings.forEach(element => {
      this.updateElement(element, this.$data[key]);
    });
  }

  updateElement(element, value) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }
}