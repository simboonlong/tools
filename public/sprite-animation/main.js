new Vue({
  el: "#app",
  data() {
    return {
      isY: true,
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
        animationName: this.isY ? "sprite-y" : "sprite-x",
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
    updateIsY(isY) {
      this.isY = isY;
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
  },
});
