const API_ENDPOINT =
  location.hostname === "tools.simboonlong.com"
    ? "https://api.simboonlong.com/.netlify/functions/remote-image"
    : "http://localhost:9999/.netlify/functions/remote-image";

const initialState = () => {
  return {
    isCopySuccess: false,
    imageUrl: "",
    base64: "",
    text: "",
    status: "",
    progress: 0,
    worker: null,
  };
};

new Vue({
  el: "#app",
  data() {
    return initialState();
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
    resetData() {
      Object.assign(this.$data, initialState());
    },
    cancel() {
      if (this.worker) this.worker.terminate();
      this.resetData();
    },
    clearImageUrl() {
      this.imageUrl = "";
    },
    clearFile() {
      document.getElementById("file").value = "";
    },
    loadImageUrl() {
      this.clearFile();

      const self = this;
      axios
        .get(`${API_ENDPOINT}/${self.imageUrl}`)
        .then((response) => {
          const { mimeType, data } = response.data;
          const image = new Image();
          const base64 = `data:${mimeType};base64,${data}`;
          image.src = base64;
          image.onload = () => {
            self.ocr(self, image);
          };

          self.base64 = base64;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loadFile() {
      this.clearImageUrl();

      const file = document.getElementById("file").files[0];
      const reader = new FileReader();
      reader.onloadend = (e) => {
        this.base64 = reader.result;
      };
      if (file) {
        reader.readAsDataURL(file);
      }

      this.ocr(this, URL.createObjectURL(file)); // https://github.com/naptha/tesseract.js/blob/master/docs/image-format.md
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
    isOcred() {
      return this.status === "recognizing text" && this.progress === 1;
    },
    isOcring() {
      return this.status === "recognizing text" && this.progress < 1;
    },
  },
});
