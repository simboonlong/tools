const API_ENDPOINT =
  location.hostname === "tools.simboonlong.com"
    ? "https://api.simboonlong.com/.netlify/functions/url-shortener"
    : "http://localhost:9999/.netlify/functions/url-shortener";

const isUrl = (string) => {
  try {
    return Boolean(new URL(string));
  } catch (e) {
    console.warn(e);
    return false;
  }
};

new Vue({
  el: "#app",
  data: {
    isShow: false,
    statusGenerate: "initial",
    isCopySuccess: false,
    urlLong: "",
    urlShort: "",
    errorMessage: "",
  },
  mounted() {
    if (location.hash) {
      location = `${API_ENDPOINT}/${location.hash.substring(1)}`;
    } else {
      this.isShow = true;
    }
  },
  methods: {
    copyShortUrl() {
      const self = this;
      let copySuccessHandler;

      navigator.clipboard
        .writeText(this.urlShort)
        .then(() => {
          self.isCopySuccess = true;
          clearTimeout(copySuccessHandler);
          copySuccessHandler = setTimeout(() => {
            self.isCopySuccess = false;
          }, 2000);

          self.statusGenerate = "initial";
          self.urlShort = "";
          self.urlLong = "";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    generateShortUrl() {
      const self = this;

      if (isUrl(this.urlLong)) {
        self.errorMessage = "";
        self.statusGenerate = "pending";
        axios({
          method: "POST",
          url: API_ENDPOINT,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          data: {
            urlOriginal: this.urlLong,
          },
        })
          .then((response) => {
            const { urlShort } = response.data;
            self.urlShort = `${location.href}#${urlShort}`;
            self.statusGenerate = "done";
          })
          .catch((error) => {
            console.error(error);
            this.statusGenerate = "initial";
          });
      } else {
        self.errorMessage = "Invalid URL provided.";
      }
    },
  },
});
