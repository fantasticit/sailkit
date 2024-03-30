<script setup>
import { ref, onMounted } from "vue";
import { Editor } from "@sailkit/core";
import { Document } from "@sailkit/document";
import { TextKit } from "@sailkit/text-kit";

const container = ref(null);

onMounted(() => {
  const editor = new Editor({
    element: container.value,
    extensions: [Document, TextKit],
  });
});
</script>

<template>
  <div class="container" ref="container"></div>
</template>

<style scoped>
.container {
  height: 400px;
  border: 1px solid #ddd;
}
</style>

<style>
.ProseMirror {
  font-family: "Chinese Quote", "Segoe UI", Roboto, RobotoNum, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.74;
  letter-spacing: 0.008em;
  word-break: break-word;
  word-wrap: break-word;
  white-space: break-spaces;
  outline: none !important;
  height: 100%;
  outline: none;
}
.ProseMirror.is-editable {
  padding: 0 10px;
}
.ProseMirror:focus-visible {
  outline: none;
}
.ProseMirror summary {
  display: list-item;
}
.ProseMirror blockquote,
.ProseMirror dd,
.ProseMirror dl,
.ProseMirror figure,
.ProseMirror h1,
.ProseMirror h2,
.ProseMirror h3,
.ProseMirror h4,
.ProseMirror h5,
.ProseMirror h6,
.ProseMirror hr,
.ProseMirror p,
.ProseMirror pre {
  margin: 0;
}
.ProseMirror a {
  text-decoration: underline;
}
.ProseMirror sub,
.ProseMirror sup {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}
.ProseMirror sub {
  bottom: -0.25em;
}
.ProseMirror sup {
  top: -0.5em;
}
.ProseMirror p {
  margin-top: 0.75rem;
  margin-bottom: 0;
  font-size: 1em;
  font-weight: normal;
  line-height: 1.714;
  letter-spacing: -0.005em;
}
.ProseMirror blockquote {
  box-sizing: border-box;
  padding-left: 10px;
  margin: 0.75rem 0;
}
</style>
