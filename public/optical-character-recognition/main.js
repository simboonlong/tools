const initialState = {
  isCopySuccess: false,
  base64: "",
  text: "",
  status: "",
  progress: 0,
  worker: null,
};

new Vue({
  el: "#app",
  data() {
    return {
      ...initialState,
    };
  },
  methods: {
    ocr: async (vueRef, image) => {
      const self = vueRef;
      self.text = "";
      self.worker = Tesseract.createWorker({
        logger: (m) => {
          const { status, progress } = m;
          self.status = status;
          self.progress = progress;
        },
      });
      await self.worker.load();
      await self.worker.loadLanguage("eng");
      await self.worker.initialize("eng");
      const {
        data: { text },
      } = await self.worker.recognize(image);
      self.text = text;
    },
    clearData() {
      if (this.worker) this.worker.terminate();
      this.data = {
        ...this.data,
        ...initialState,
      };
    },
    clearFile() {
      document.getElementById("file").value = "";
    },
    setText(file) {
      this.ocr(this, URL.createObjectURL(file));
    },
    setImage(file) {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.base64 = reader.result;
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    loadImage() {
      const file = document.getElementById("file").files[0];
      this.clearData();
      this.setImage(file);
      this.setText(file);
    },
    copyText() {
      const self = this;
      let copySuccessHandler;

      navigator.clipboard
        .writeText(this.text)
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
  computed: {
    isOcr() {
      return this.status === "recognizing text" && this.progress === 1;
    },
  },
});
