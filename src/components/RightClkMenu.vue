<!-- 右键菜单：右键歌曲添加到歌单 -->
<template>
    <div class="container-right-menu" :class="{ 'active': contextMenu.show }"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }" @click="(e) => e.stopPropagation()">
        <div class="menu">
            <div class="title">添加到歌单</div>
            <div class="list">
                <div class="item" v-for="(item, index) in playlists.custom" :key="index"
                    @click="contextMenu.event(item.head.id)">
                    <span>
                        {{ item.head.name }}
                    </span>
                </div>
            </div>
        </div>
        <div class="menu">
            <div class="title">删除</div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useSysStore } from "../stores/sys";
import { storeToRefs } from "pinia";

const { playlists } = useUserStore();
const { contextMenu } = storeToRefs(useSysStore());
</script>

<style scoped lang="less">
.container-right-menu {
    display: flex;
    flex-direction: column;
    visibility: hidden;
    position: absolute;
    background-color: #282828;
    border-radius: 5px;

    .menu {
        padding: 10px;
        border-radius: 3px;
        margin: 5px;

        .list {
            position: absolute;
            top: 0px;
            left: 100% - 5px;
            background-color: #282828;
            visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px;
            border-radius: 5px;
            z-index: 1;
            box-shadow: #3e3e3e 0px 0px 5px 0px;

            .item {
                padding: 10px;
                padding-right: 50px;
                border-radius: 3px;
            }

            .item:hover {
                background-color: #3e3e3e;
            }
        }
    }

    .menu:hover {
        background-color: #3e3e3e;

        .list {
            visibility: visible;
        }
    }
}

.active {
    visibility: visible;
}
</style>