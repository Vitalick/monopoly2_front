<template>
  <span>
    <button
      class="btn"
      :class="{
        [`btn-${color}`]: true,
        active: node.value === value,
      }"
      v-for="node in options"
      :key="node.value"
      v-text="node.title"
      @click="$emit('input', node.value)"
    ></button>
  </span>
</template>

<script lang="ts">
interface Options {
  title: string;
  value: any;
}

export default {
  name: "RadioButtons",
  props: {
    options: {
      type: Array as () => Options[],
    },
    value: {},
    color: {
      type: String,
      default: () => "black",
    },
  },
};
</script>
