<!-- 表行 -->
<template>
    <div class="table-item-container" 
        @dblclick="events[0]((data.id))"
        @contextmenu="showMenu"
    >
        <div class="block-one">
            <div class="index">
                <span class="id">{{ id }}</span>
                <span class="index-icon" @click="events[0](data.id)">
                    <i class="fa fa-play fa-play" />
                </span>
            </div>
            <div class="cover">
                <img :src="data.picUrl">
            </div>
            <div class="info">
                <div class="name">
                    <!-- Check length -->
                    <p v-if="data.name.length > 20">{{ data.name.slice(0, 20) + "..." }}</p>
                    <p v-else>{{ data.name }}</p>
                </div>
                <div class="artists">
                    <!-- Check length -->
                    <p v-if="data.artists.length > 20">{{ data.artists.slice(0, 20) + "..." }}</p>
                    <p v-else>{{ data.artists }}</p>
                </div>
            </div>
        </div>
        <div class="block-two">
            <p>{{ data.album }}</p>
        </div>
        <div class="block-three">
            <p>{{ data.time }}</p>
        </div>
        <!-- hover icons -->
        <div class="hover-icons">
            <div class="icon" @click="events[1](data.id, checkLikeMusic(data.id))">
                <font-awesome-icon v-if="checkLikeMusic(data.id)" :icon="['fas', 'heart']" style="color: #1fdf64;" />
                <font-awesome-icon v-else :icon="['fas', 'heart']" style="color: #fff;" />
            </div>
            <div class="icon" @click="events[2](data.id)">
                <font-awesome-icon :icon="['fas', 'plus']" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { checkLikeMusic } from "../../tools/user";
import { useSysStore } from "../../stores/sys";
import { invoke } from "@tauri-apps/api";
import { useUserStore } from "../../stores/user";

const { user, playlists } = useUserStore();
const { contextMenu } = useSysStore();
// data: [id, picUrl, name, artists, album, time]
const props = defineProps({
    id: { type: Number, required: true },
    data: { type: Object, required: true },
    events: { type: Array, required: true },
});

function showMenu(e) {
    console.log("showMenu");
    e.preventDefault();
    contextMenu.x = e.clientX;
    contextMenu.y = e.clientY;
    contextMenu.show = true;
    // 为菜单设置点击事件
    contextMenu.event = async function(pid) {
        console.log(`add ${props.data.id} to ${pid}`);
        for (let i = 0; i < playlists.custom.length; i++) {
            if (playlists.custom[i].head.id == pid) {
                if (playlists.custom[i].songs.includes(props.data.id)) {
                    console.log("already in playlist");
                    return;
                }
            }
        }
        let res = await invoke("update_song_to_playlist", {
            token: user.token,
            pid,
            sid: props.data.id,
            tp: "add",
        });
        for (let i = 0; i < playlists.custom.length; i++) {
            if (playlists.custom[i].head.id == pid) {
                playlists.custom[i].songs.push(props.data.id);
            }
        }
        contextMenu.show = false;
        console.log(res);
    };
}
</script>

<style scoped lang="less">
.table-item-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    padding: 5px;
    color: #b3b3b3;

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
                color: #fff;
                font-size: 15px;
            }

            .artists {
                display: flex;
                // color: #b3b3b3;
                font-size: 12px;
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

    .hover-icons {
        display: none;

        .icon {
            display: none;
        }
    }
}

.table-item-container:hover {
    position: relative;
    border-radius: 10px;
    background-color: #2a2a2a;
    cursor: pointer;
    opacity: 1;
    color: #fff;

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

    .hover-icons {
        position: absolute;
        right: 50px;
        top: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            width: 25px;
            height: 25px;
            margin: 0px 5px 0px 5px;
        }
    }
}
</style>