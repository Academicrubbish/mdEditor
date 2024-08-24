<template>
  <view class="content">
    <md-editor :textareaDataProp="textareaData" @submit="submit" />
  </view>
</template>

<script>
import mdEditor from "../../components/md-editor.vue";
export default {
  components: {
    mdEditor,
  },
  data() {
    return {
      textareaData: "# 标题",
    };
  },
  methods: {
    submit(e) {
      console.log("e", e);
    },
  },
};
</script>
<style>
.content {
  height: 100vh;
}
</style>
