<!-- 表行 -->
<template>
    <div class="table-item-container">
        <div class="block-one">
            <div class="index">
                <span class="id">{{ id }}</span>
                <span class="index-icon">
                    <i class="fa fa-play fa-play" />
                </span>
            </div>
            <div class="cover">
                <img :src="data.picUrl">
            </div>
            <div class="info">
                <div class="name">
                    <p>{{ data.name }}</p>
                </div>
                <div class="artists">
                    <p>{{ data.artists }}</p>
                </div>
            </div>
        </div>
        <div class="block-two">
            <p>{{ data.album }}</p>
        </div>
        <div class="block-three">
            <p>{{ data.time }}</p>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';

// data: [id, picUrl, name, artists, album, time]
const props = defineProps({
    id: { type: Number, required: true },
    data: { type: Object, required: true },
});

onBeforeMount(() => {
});
</script>

<style scoped lang="less">
.table-item-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    padding: 5px;

    .block-one {
        grid-area: 1 / 1 / 2 / 3;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        margin-left: 10px;

        .index {
            display: flex;
            align-items: center;
            margin: 2px;
            width: 32px;
            height: 32px;

            .index-icon {
                display: none;
            }
        }

        .cover {
            display: flex;
            align-items: center;
            margin: 2px;
            margin-left: 20px;

            img {
                width: 50px;
                height: 50px;
            }
        }

        .info {
            display: flex;
            align-items: flex-start;
            margin: 2px;
            flex-direction: column;
            margin-left: 20px;

            .name {
                display: flex;

            }

            .artists {
                display: flex;
            }
        }
    }

    .block-two {
        grid-area: 1 / 3 / 2 / 4;
        display: flex;
        align-items: center;
        margin: 2px;
    }

    .block-three {
        grid-area: 1 / 4 / 2 / 5;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 2px;
    }
}

.table-item-container:hover {
    border-radius: 10px;
    background-color: #2a2a2a;
    cursor: pointer;
    opacity: 1;

    .block-one {
        .index {
            .id {
                display: none !important;
            }

            .index-icon {
                display: inline !important;
            }
        }
    }
}
</style>