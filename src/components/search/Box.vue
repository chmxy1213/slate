<!-- 搜索结果 -->
<template>
    <div class="res-box">
        <!-- 单曲 -->
        <div class="box-inner" v-show="props.searchType == 1">
            <div class="inner-table-container">
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
                    <div class="table-item" v-for="(item, index) in props.data.songs" :key="index"  @contextmenu="showMenu($event, item.id)">
                        <div class="table-item-container" @dblclick="doubleClkEvent(item.id)">
                            <div class="block-one">
                                <div class="index">
                                    <span class="id">{{ index + 1 }}</span>
                                    <span class="index-icon">
                                        <i class="fa fa-play fa-play" />
                                    </span>
                                </div>
                                <div class="cover">
                                    <img :src="item.picUrl">
                                </div>
                                <div class="info">
                                    <div class="name">
                                        <p v-if="item.name.length > 20">{{ item.name.slice(0, 20) + '...' }}</p>
                                        <p v-else>{{ item.name }}</p>
                                    </div>
                                    <div class="artists">
                                        <p v-if="item.artists.length > 20">{{ item.artists.slice(0, 20) + '...' }}</p>
                                        <p v-else>{{ item.artists }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="block-two">
                                <p>{{ item.album }}</p>
                            </div>
                            <div class="block-three">
                                <p>{{ item.time }}</p>
                            </div>
                            <!-- hover icons -->
                            <div class="hover-icons">
                                <div class="icon" @click="like(item.id, checkLikeMusic(item.id))">
                                    <font-awesome-icon v-if="checkLikeMusic(item.id)" :icon="['fas', 'heart']"
                                        style="color: #1fdf64;" />
                                    <font-awesome-icon v-else :icon="['fas', 'heart']" style="color: #fff;" />
                                </div>
                                <div class="icon" @click="addToQueue(item.id)">
                                    <font-awesome-icon :icon="['fas', 'plus']" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 专辑 -->
        <div class="box-inner" v-show="props.searchType == 10">
            <div class="inner-albums-container">
                <div class="album-card" v-for="item in props.data.albums" :key="item.id"
                    @click="router.push({ name: 'album', query: { id: item.id } })">
                    <div class="cover">
                        <img :src="item.picUrl">
                    </div>
                    <div class="info">
                        <div class="name">
                            <span v-if="item.name.length >= 10">{{ item.name.slice(0, 9) + '...' }}</span>
                            <span v-else>{{ item.name }}</span>
                        </div>
                        <div class="artist">
                            <span>{{ item.artist.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 歌手 -->
        <div class="box-inner" v-show="props.searchType == 100">
            <div class="inner-artist-container">
                <div class="artist-card" v-for="item in props.data.artists" :key="item.id"
                    @click="router.push({ name: 'artist', query: { id: item.id } })">
                    <div class="cover">
                        <img :src="item.picUrl">
                    </div>
                    <div class="info">
                        <div class="name">
                            <!-- <span v-if="item.name.length >= 10">{{ item.name.slice(0, 9) + '...' }}</span> -->
                            <!-- <span v-else>{{ item.name }}</span> -->
                            <span>{{ item.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 歌单 -->
        <div class="box-inner" v-show="props.searchType == 1000">
            <div class="inner-playlist-container">
                <div class="playlist-card" v-for="item in props.data.playlists" :key="item.id"
                    @click="router.push({ name: 'playlist', query: { id: item.id, type: 'normal' } })">
                    <div class="cover">
                        <img :src="item.coverImgUrl">
                    </div>
                    <div class="info">
                        <div class="name">
                            <span v-if="item.name.length >= 10">{{ item.name.slice(0, 9) + '...' }}</span>
                            <span v-else>{{ item.name }}</span>
                        </div>
                        <div class="playcount">
                            <span>播放&nbsp;</span>
                            <span>{{ item.playCount }}</span>
                            <span>&nbsp;次</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音 -->
        <!-- 不支持 -->
    </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUpdate } from "vue";
import { usePlayQueueStore } from "../../stores/playQueue";
import { useRouter } from "vue-router";
import { checkLikeMusic, likeMusicOrNot } from "../../tools/user";
import { useSysStore } from "../../stores/sys";
import { useUserStore } from "../../stores/user";
import { invoke } from "@tauri-apps/api";

const router = useRouter();
const { playQueueState, add, remove, previous, next, playThis } = usePlayQueueStore();
const { contextMenu } = useSysStore();
const { user, playlists } = useUserStore();

const header = ["#", "标题", "专辑", "时长"];
const props = defineProps({
    searchType: {
        type: Number,
        default: 1,
        required: true,
    },
    data: {
        type: Object,
        default: {},
        required: true,
    },
});

// 双击歌曲播放
async function doubleClkEvent(id) {
    await add(id, 0);
    await playThis(0);
}

// 添加到播放队列
async function addToQueue(id) {
    console.log("addToQueue");
    console.log(id);
    await add(id, -1);
}

// TODO: 标记为喜欢的音乐
async function like(id, flag) {
    await likeMusicOrNot(id, flag);
}


// 右键菜单
function showMenu(e, sid) {
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
                if (playlists.custom[i].songs.includes(sid)) {
                    console.log("already in playlist");
                    return;
                }
            }
        }
        let res = await invoke("update_song_to_playlist", {
            token: user.token,
            pid,
            sid: sid,
            tp: "add",
        });
        for (let i = 0; i < playlists.custom.length; i++) {
            if (playlists.custom[i].head.id == pid) {
                playlists.custom[i].songs.push(sid);
            }
        }
        contextMenu.show = false;
        console.log(res);
    };
}
</script>

<style scoped lang="less">
.res-box {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .box-inner {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        padding: 40px 10px 0px 10px;

        .inner-table-container {
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

            .table-item-container {
                position: relative;
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
                        color: #fff;
                        width: 25px;
                        height: 25px;
                        margin: 0px 5px 0px 5px;
                    }
                }
            }
        }

        .inner-albums-container {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            flex-wrap: wrap;
            align-content: flex-start;
            width: 100%;
            height: 100%;

            .album-card {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-direction: column;
                margin: 10px;
                background-color: #2a2a2a;
                border-radius: 5px;
                padding: 10px;

                .cover {
                    img {
                        width: 150px;
                        height: 150px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        margin-top: 10px;
                    }
                }

                .info {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;
                    width: 150px;

                    .name {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #fff;
                        font-size: 15px;
                        margin-bottom: 10px;
                        font-weight: bolder;
                    }

                    .artists {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #b3b3b3;
                        font-size: 12px;
                    }
                }
            }

            .album-card:hover {
                cursor: pointer;
                background-color: #434242;
                transition: .5s;
                filter: drop-shadow(0px 0px 5px #b3b3b3);

                .cover {
                    animation: swing .2s;
                }
            }
        }

        .inner-artist-container {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;
            align-content: flex-start;

            .artist-card {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-direction: column;
                margin: 10px;
                background-color: #2a2a2a;
                border-radius: 5px;
                padding: 10px;

                .cover {
                    img {
                        width: 150px;
                        height: 150px;
                        border-radius: 50%;
                        margin-bottom: 20px;
                    }
                }

                .info {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;
                    width: 150px;

                    .name {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #fff;
                        font-size: 15px;
                        margin-bottom: 10px;
                        font-weight: bolder;
                    }
                }
            }

            .artist-card:hover {
                cursor: pointer;
                background-color: #434242;
                transition: .5s;
                filter: drop-shadow(0px 0px 5px #b3b3b3);

                .cover {
                    animation: swing .2s;
                }
            }
        }

        .inner-playlist-container {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            flex-wrap: wrap;
            align-content: flex-start;

            .playlist-card {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-direction: column;
                margin: 10px;
                background-color: #2a2a2a;
                border-radius: 5px;
                padding: 10px;

                .cover {
                    img {
                        width: 150px;
                        height: 150px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                }

                .info {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;
                    width: 100%;

                    .name {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #fff;
                        font-size: 15px;
                        margin-bottom: 10px;
                        font-weight: bolder;
                    }

                    .playcount {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #b3b3b3;
                        font-size: 12px;
                    }
                }
            }

            .playlist-card:hover {
                cursor: pointer;
                background-color: #434242;
                transition: .5s;
                filter: drop-shadow(0px 0px 5px #b3b3b3);

                .cover {
                    animation: swing .2s;
                }
            }
        }
    }
}

@keyframes swing {
    0% {
        transform: rotate(0deg);
    }

    10% {
        transform: rotate(3deg);
    }

    25% {
        transform: rotate(5deg);
    }

    35% {
        transform: rotate(3deg);
    }

    50% {
        transform: rotate(0deg);
    }

    60% {
        transform: rotate(-3deg);
    }

    75% {
        transform: rotate(-5deg);
    }

    85% {
        transform: rotate(-3deg);
    }

    100% {
        transform: rotate(0deg);
    }
}
</style>