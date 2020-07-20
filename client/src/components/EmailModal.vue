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
              <input v-model="name" type="text" required maxlength="50" />
            </div>
            <div>
              <label for="email" class="label">Email:</label>
              <!-- eslint-disable-next-line -->
              <input v-model="email" type="email" required maxlength="50" />
            </div>
            <div>
              <label for="subject" class="label">Subject:</label>
              <!-- eslint-disable-next-line -->
              <input v-model="subject" type="text" required maxlength="50" />
            </div>
            <div>
              <label for="name" class="label">Message:</label>
              <textarea
                v-model="message"
                type="textarea"
                placeholder="Your Message Here"
                maxlength="6000"
                rows="7"
              ></textarea>
            </div>
            <button type="submit" @click="sendMail">Send</button>
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
  data() {
    return {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
  },
  methods: {
    sendMail() {
      var body = {
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message
      };
      store.dispatch("sendEmail", body);
      this.close();
    },
    close() {
      store.commit("closeEmailModal");
      this.$emit("input", !this.value);
      this.name = "";
      this.email = "";
      this.subject = "";
      this.message = "";
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
