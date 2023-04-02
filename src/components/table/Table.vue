<!-- 歌曲表组件 -->
<template>
    <div class="table-container">
        <div class="table-title">
            <div class="title-one">{{ header[0] }}</div>
            <div class="title-two">{{ header[1] }}</div>
            <div class="title-three">{{ header[2] }}</div>
            <div class="title-four">{{ header[3] }}</div>
        </div>
        <div class="table-body">
            <div class="table-item" v-for="(item, index) in data">
                <TableItem :id="index+1" :data="item" :key="index"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import TableItem from "./TableItem.vue";

// 表数据：第一行是表头，之后是数据
const props = defineProps({
    header: { type: Array, required: true },
    data: { type: Array, required: true },
});
</script>

<style scoped lang="less">
.table-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .table-title {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;

        .title-one {
            grid-area: 1 / 1 / 2 / 2;
        }

        .title-two {
            grid-area: 1 / 2 / 2 / 3;
        }

        .title-three {
            grid-area: 1 / 3 / 2 / 4;
        }

        .title-four {
            grid-area: 1 / 4 / 2 / 5;
        }
    }
}
</style>