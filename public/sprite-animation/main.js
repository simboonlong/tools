// keep to this weird indentation so copy is nice
const getStyles = (name, duration, step) => {
  return `.sprite {
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-image: url("./images/sprite.png");
  animation: ${name} ${duration}s steps(${step});
}

@keyframes sprite-x {
  from {
    background-position: 0% 0;
  }
  to {
    background-position: 100% 0;
  }
}

@keyframes sprite-y {
  from {
    background-position: 0 0%;
  }
  to {
    background-position: 0 100%;
  }
}`;
};

new Vue({
  el: "#app",
  data() {
    return {
      isCopySuccess: false,
      animationName: "sprite-y",
      aspectRatioW: 1,
      aspectRatioH: 1,
      animationDuration: 0.5,
      step: 6,
      backgroundImage: `url("./ryu.png")`,
    };
  },
  computed: {
    getAspectRatio() {
      return `padding-bottom: ${
        (this.aspectRatioH / this.aspectRatioW) * 100
      }%;`;
    },
    getAnimation() {
      return {
        animationName: this.animationName,
        animationDuration: `${this.animationDuration}s`,
        animationTimingFunction: `steps(${this.step})`,
      };
    },
    getBackground() {
      return {
        backgroundImage: this.backgroundImage,
      };
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
    updateBackgroundPosition(isY) {
      if (isY) {
        this.animationName = "sprite-y";
      } else {
        this.animationName = "sprite-x";
      }
    },
    updateAspectRatioW(event) {
      this.aspectRatioW = event.target.value;
    },
    updateAspectRatioH(event) {
      this.aspectRatioH = event.target.value;
    },
    updateAnimationDuration(event) {
      this.animationDuration = event.target.value;
    },
    updateStep(event) {
      this.step = event.target.value;
    },
    setBackgroundImage() {
      const file = document.getElementById("file").files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        this.backgroundImage = `url("${reader.result}")`;
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    copyStyles() {
      const self = this;
      let copySuccessHandler;

      navigator.clipboard
        .writeText(
          getStyles(this.animationName, this.animationDuration, this.step),
        )
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
