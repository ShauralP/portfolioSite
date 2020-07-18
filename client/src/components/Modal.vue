<template>
  <div class="modal" v-show="value">
    <div class="container">
      <img id="image" :src="image" />
      <button id="close" @click.prevent="close">X</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    value: {
      required: true
    },
    image: {
      required: true
    }
  },
  methods: {
    close() {
      this.$emit("input", !this.value);
    }
  }
};
</script>

<style lang="css" scoped>
.modal {
  margin: auto;
  position: absolute;
  top: 50px;
  left: 50px;
  bottom: 50px;
  right: 50px;
  background-color: #000;
  color: #fff;
  z-index: 5;
  background-color: rgba(61, 61, 61, 0.253);
}

#image {
  max-width: 100%;
  max-height: 100%;
  display: inline-block; /* Instead of display: block; */
  margin: 0 auto;
  vertical-align: middle;
  height: -webkit-fill-available;
}

#close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
