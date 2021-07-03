new Vue({
  el: "#app",
  data() {
    return {
      isRepeatX: true,
      isRepeatY: true,
      backgroundImage: `url("./bg-tile.jpg")`,
      backgroundPositionX: 0,
      backgroundPositionY: 0,
      backgroundSizeW: "auto",
      backgroundSizeH: "auto",
    };
  },
  computed: {
    setBackground() {
      const backgroundSizeW = Number.isInteger(parseInt(this.backgroundSizeW))
        ? `${this.backgroundSizeW}px`
        : this.backgroundSizeW;
      const backgroundSizeH = Number.isInteger(parseInt(this.backgroundSizeH))
        ? `${this.backgroundSizeH}px`
        : this.backgroundSizeH;

      return {
        backgroundImage: this.backgroundImage,
        backgroundRepeat: this.setBackgroundRepeat(),
        backgroundPositionX: `${this.backgroundPositionX}%`,
        backgroundPositionY: `${this.backgroundPositionY}%`,
        backgroundSize: `${backgroundSizeW} ${backgroundSizeH}`,
      };
    },
  },
  watch: {},
  created() {},
  updated() {},
  mounted() {},
  methods: {
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
    setBackgroundRepeat() {
      switch (true) {
        case this.isRepeatX && this.isRepeatY:
          return "repeat";
        case !this.isRepeatX && !this.isRepeatY:
          return "no-repeat";
        case this.isRepeatX:
          return "repeat-x";
        case this.isRepeatY:
          return "repeat-y";
        default:
          return "initial";
      }
    },
    updateBackgroundPositionX(event) {
      this.backgroundPositionX = event.target.value;
    },
    updateBackgroundPositionY(event) {
      this.backgroundPositionY = event.target.value;
    },
  },
});
