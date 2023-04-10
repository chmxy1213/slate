<!-- 歌曲表组件 -->
<template>
    <div class="table-container">
        <div class="table-title">
            <div class="title-one">
                <span class="idx">{{ header[0] }}</span>
                <span>{{ header[1] }}</span>
            </div>
            <div class="title-two">
                <span>{{ header[2] }}</span>
            </div>
            <div class="title-three">
                <span>{{ header[3] }}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="table-body">
            <div class="table-item" v-for="(item, index) in data">
                <TableItem :id="index + 1" :data="item" :key="index" :event="event" />
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
    event: { type: Function, required: true },
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
        margin-top: 3px;
        margin-bottom: 3px;

        .title-one {
            grid-area: 1 / 1 / 2 / 3;
            margin-left: 20px;

            .idx {
                display: inline-block;
                margin-right: 38px;
            }
        }

        .title-two {
            grid-area: 1 / 3 / 2 / 4;
        }

        .title-three {
            display: flex;
            justify-content: flex-end;
            grid-area: 1 / 4 / 2 / 5;
        }
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #30383d;
        margin-bottom: 10px;
    }
}
</style>