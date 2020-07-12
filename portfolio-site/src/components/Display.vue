<template>
  <div class="display">
    <p>Hello, my name is Shaural, welcome to my website...</p>
    <div v-for="line in displayText" :key="line">{{ line }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Display",
  computed: mapState(["displayText"])
};
</script>
