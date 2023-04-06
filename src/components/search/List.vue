<template>
    <div class="box-list">
        <Card v-for="item in props.data" :key="item.id" :data="item" />
    </div>
</template>

<script setup>
import Card from "../Card.vue";

const props = defineProps({
    data: {
        type: Array,
        default: [],
        required: true,
    },
});
</script>

<style scoped lang="less">
</style>