new Vue({
  el: "#app",
  data: {
    isCopySuccess: false,
    rawHtml:
      '<div class="item"><p>text 1</p></div><div class="item"><p>text 2</p></div><div class="item"><p>text 3</p> </div>',
    selector: "",
    fields: [
      {
        selector: "",
        attribute: "",
      },
    ],
    json: [],
  },
  methods: {
    removeField(index) {
      this.fields = this.fields.filter((field, i) => i !== index);
    },
    addField() {
      this.fields.push({
        selector: "",
        attribute: "",
      });
    },
    update() {
      const self = this;
      const json = [];
      const wrapper = document.createElement("div");
      let items;
      wrapper.innerHTML = this.rawHtml;

      try {
        items = wrapper.querySelectorAll(this.selector);
      } catch (e) {
        return null; // intentionally swallow error
      }

      items.forEach((item) => {
        let obj = {};

        self.$nextTick(() => {
          self.fields.map((field) => {
            let str;

            try {
              str = item.querySelector(field.selector).textContent;
            } catch (e) {
              str = ""; // intentionally swallow error
            }

            obj[field.attribute] = str;
          });
        });

        json.push(obj);
      });

      this.json = json;
    },
    copyJson() {
      const self = this;
      let copySuccessHandler;

      navigator.clipboard
        .writeText(JSON.stringify(this.json))
        .then(() => {
          self.isCopySuccess = true;
          clearTimeout(copySuccessHandler);
          copySuccessHandler = setTimeout(() => {
            self.isCopySuccess = false;
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
