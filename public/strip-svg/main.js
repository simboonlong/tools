import { optimize, extendDefaultPlugins } from "./svgo.browser.js";
import path from "./path-browserify.js";

new Vue({
  el: "#app",
  data() {
    return {
      isCopySuccess: false,
      className: "",
      prefix: "",
      filename: "",
      svg: "",
      optimizedSvgStr: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  updated() {},
  mounted() {},
  methods: {
    setSvg() {
      const file = document.getElementById("file").files[0];
      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.svg = reader.result;

        const option = {
          js2svg: {
            indent: 2,
            pretty: true,
          },
          path: true,
          plugins: extendDefaultPlugins([
            {
              name: "addClassesToSVGElementByFilename",
              type: "perItem",
              params: {
                prefix: this.prefix,
              },
              fn: (node, params) => {
                const prefix = params.prefix ? `${params.prefix}-` : ``;
                const filename = path.basename(
                  this.filename,
                  path.extname(this.filename),
                );
                if (node.name === "svg") {
                  node.attributes["class"] = `${prefix}${filename}`;
                }
              },
            },
            "convertStyleToAttrs",
            "removeDimensions",
          ]),
        };
        const result = optimize(reader.result, option);
        this.optimizedSvgStr = result.data;
        console.log(this.optimizedSvgStr);
      };

      if (file) {
        this.filename = file.name;
        reader.readAsBinaryString(file);
      }
    },
    copySvg() {
      const self = this;
      let copySuccessHandler;

      navigator.clipboard
        .writeText(this.optimizedSvgStr)
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
