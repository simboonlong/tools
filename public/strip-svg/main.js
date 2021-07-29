import { optimize, extendDefaultPlugins } from "./svgo.browser.js";
import path from "./path-browserify.js";

new Vue({
  el: "#app",
  data() {
    return {
      isCopySuccess: false,
      isClassName: false,
      filename: "",
      svg: `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         width="400px" height="400px" viewBox="0 0 400 400" enable-background="new 0 0 400 400" xml:space="preserve">
      <path fill="#F9D700" stroke="#1D1D1B" stroke-width="4" stroke-miterlimit="10" d="M218.31,58.83l33.62,67.83
        c2.97,6,8.72,10.16,15.37,11.12l75.19,10.88c16.75,2.42,23.43,22.91,11.32,34.68l-54.41,52.8c-4.81,4.67-7.01,11.4-5.87,17.99
        l12.84,74.56c2.86,16.61-14.65,29.27-29.63,21.43l-67.25-35.2c-5.95-3.11-13.05-3.11-19,0l-67.25,35.2
        c-14.98,7.84-32.49-4.82-29.63-21.43l12.84-74.56c1.14-6.59-1.06-13.32-5.87-17.99l-54.41-52.8c-12.12-11.76-5.43-32.25,11.32-34.68
        l75.19-10.88c6.65-0.96,12.4-5.12,15.37-11.12l33.62-67.83C189.18,43.72,210.82,43.72,218.31,58.83z"/>
      </svg>
      `,
    };
  },
  computed: {
    getOptimizedSvgStr() {
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
            fn: (node) => {
              if (this.isClassName) {
                const filename = path.basename(
                  this.filename,
                  path.extname(this.filename),
                );
                if (node.name === "svg") {
                  node.attributes["class"] = filename;
                }
              }
            },
          },
          "convertStyleToAttrs",
          "removeDimensions",
        ]),
      };

      return optimize(this.svg, option).data;
    },
  },
  watch: {},
  created() {},
  updated() {},
  mounted() {},
  methods: {
    clearFile() {
      document.getElementById("file").value = "";
    },
    setSvg() {
      const file = document.getElementById("file").files[0];
      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.svg = reader.result;
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
        .writeText(this.getOptimizedSvgStr)
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
