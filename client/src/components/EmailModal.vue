<template>
  <div class="modal" v-show="value">
    <div class="container">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Contact Me</h4>
        </div>
        <div class="modal-body">
          <form role="form" method="post" id="reused_form">
            <p>
              Send your message in the form below and I will get back to you as
              early as possible.
            </p>
            <div>
              <label for="name" class="label">Name:</label>
              <!-- eslint-disable-next-line -->
              <input type="text" id="name" name="name" required maxlength="50" />
            </div>
            <div>
              <label for="email" class="label">Email:</label>
              <!-- eslint-disable-next-line -->
              <input type="email" id="email" name="email" required maxlength="50" />
            </div>
            <div>
              <label for="name" class="label">Message:</label>
              <textarea
                type="textarea"
                name="message"
                id="message"
                placeholder="Your Message Here"
                maxlength="6000"
                rows="7"
              ></textarea>
            </div>
            <button type="submit" id="btnContactUs">Send</button>
          </form>
        </div>
      </div>
      <button id="close" @click.prevent="close">X</button>
    </div>
  </div>
</template>

<script>
import store from "../store";

export default {
  name: "EmailModal",
  props: {
    value: {
      required: true
    }
  },
  methods: {
    close() {
      store.commit("closeEmailModal");
      this.$emit("input", !this.value);
    }
  }
};
</script>

<style lang="css" scoped>
.modal {
  position: absolute;
  left: 50%;
  width: 500px;
  margin-left: -250px;
  top: 50%;
  margin-top: -250px;
  background-color: rgba(61, 61, 61, 0.253);
  padding: 20px;
  line-height: 200%;
}
#close {
  position: absolute;
  top: 10px;
  right: 10px;
}
.label {
  padding-right: 20px;
}
</style>
