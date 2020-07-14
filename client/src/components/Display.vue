<template>
  <div ref="display" class="display">
    <p>Hello, my name is Shaural, welcome to my website...</p>
    <div
      v-for="(line, index) in displayText"
      :key="line + index"
      v-html="line"
    ></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Display",
  computed: {
    ...mapState(["displayText"]),
    displayTextLength: function() {
      return this.displayText.length;
    }
  },
  methods: {
    // TODO: Not scrolling all the way till the end, fix this
    scrollToEnd: function() {
      this.$refs.display.scrollTop = this.$refs.display.scrollHeight;
    }
  },
  watch: {
    displayTextLength: function() {
      this.scrollToEnd();
    }
  }
};
</script>

<style scoped>
.display {
  overflow-y: auto;
  word-wrap: break-word;
  max-height: 95%;
  -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
  scrollbar-width: none; /* Hide scrollbar for Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.display::-webkit-scrollbar {
  display: none;
}
</style>
