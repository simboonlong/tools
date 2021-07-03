new Vue({
  el: "#app",
  data: {
    isSuccess: false,
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
      const copy = document.createElement("input");
      copy.setAttribute("id", "copy");
      copy.value = JSON.stringify(this.json);
      document.body.appendChild(copy);
      document.getElementById("copy").select();

      try {
        document.execCommand("copy");
        this.isSuccess = true;
        copy.remove();

        setTimeout(() => {
          self.isSuccess = false;
        }, 2000);
      } catch (e) {
        console.log("Unable to copy", e);
      }
    },
  },
});
