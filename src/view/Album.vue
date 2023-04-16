<!-- 专辑详情 -->
<template>
    <div class="album-container">
        <canvas id="canvas" style="display: none;"></canvas>
        <!-- 页面头 -->
        <div class="album-header">
            <div class="cover">
                <img id="cover" crossorigin="anonymous" :src="data.album.picUrl">
            </div>
            <div class="section-two">
                <div class="album-name">
                    <p>{{ data.album.name }}</p>
                </div>
                <div class="album-description">
                    <span v-if="data.album.description.length > 100">{{ data.album.description.slice(0, 100) + '...' }}</span>
                    <span v-else>{{ data.album.description }}</span>
                </div>
                <div class="album-publishtime">
                    <p>发布时间&nbsp;{{ data.album.publishTime }}</p>
                </div>
            </div>
        </div>
        <!-- 页面体 -->
        <div class="album-body">
            <div class="btns">
                <div class="btn-play">
                    <i class="fa fa fa-play"></i>
                </div>
            </div>
            <div class="table-container">
                <div class="table-title">
                    <div class="title-one">
                        <span class="idx">{{ header[0] }}</span>
                        <span>{{ header[1] }}</span>
                    </div>
                    <div class="title-two">
                        <span>{{ header[2] }}</span>
                    </div>
                </div>
                <div class="line"></div>
                <div class="table-body">
                    <div class="table-item" v-for="(item, index) in songs" :key="index">
                        <div class="table-item-container" @dblclick="dbPlayEvent(item.id)">
                            <div class="block-one">
                                <div class="index">
                                    <span class="id">{{ index + 1 }}</span>
                                    <span class="index-icon" @click="dbPlayEvent(imte.id)">
                                        <i class="fa fa-play fa-play" />
                                    </span>
                                </div>
                                <div class="info">
                                    <div class="name">
                                        <!-- Check length -->
                                        <p v-if="item.name.length > 20">{{ data.name.slice(0, 20) + "..." }}</p>
                                        <p v-else>{{ item.name }}</p>
                                    </div>
                                    <div class="artists">
                                        <!-- Check length -->
                                        <p v-if="item.artists.length > 20">{{ data.artists.slice(0, 20) + "..." }}</p>
                                        <p v-else>{{ item.artists }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="block-two">
                                <p>{{ item.time }}</p>
                            </div>
                            <!-- hover icons -->
                            <div class="hover-icons">
                                <div class="icon" @click="likeEvent(item.id)">
                                    <font-awesome-icon :icon="['fas', 'heart']" style="color: #fff;" />
                                </div>
                                <div class="icon" @click="addToQueueEvent(item.id)">
                                    <font-awesome-icon :icon="['fas', 'plus']" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { usePlayQueueStore } from "../stores/playQueue";
import { useRoute } from "vue-router";
import { invoke } from "@tauri-apps/api";

const route = useRoute();
const { add, playThis } = usePlayQueueStore();

const header = ["#", "标题", "时长"];
const data = ref({
    songs: [],
    album: {
        id: 0,
        name: "",
        picUrl: "",
        artists: [],
        description: "",
        publishTime: 0,
    },
});
const songs = ref([]);

// double click play event
async function dbPlayEvent(id) {
    await add(id, 0);
    await playThis(0);
}

// like event
function likeEvent(id) {
    // TODO
    console.log(`like ${id}`);
}

// add to queue event
async function addToQueueEvent(id) {
    // TODO
    console.log(`add to queue ${id}`);
    await add(id, -1);
}

// request album data
async function get(id) {
    let res = await invoke("get_album_detail", { id });
    if (res.code === 200) {
        data.value.album = res.album;
        data.value.songs = res.songs;
    }
}

// TODO: this fucntion is some same with `req.js`.
// process the request's data
// Require: id, name, picUrl, artists, album, time
function processData(_data) {
    let count = 0;
    _data.forEach((value) => {
        count++;
        // Process artists
        let ars = "";  // Artist String
        value.ar.forEach((value) => {
            ars += `, ${value.name}`;
        });
        ars = ars.replace(/^(\s|,)+|(\s|,)+$/g, '');
        // Process duration
        let dt_s = Math.floor(value.dt / 1000);
        let time_min = Math.floor(dt_s / 60);
        let time_s = Math.floor(dt_s - (time_min * 60));
        let time_string = time_min + ':' + time_s;
        // push to songs state
        songs.value.push({
            id: value.id,
            name: value.name,
            artists: ars,
            time: time_string,
        });
    });
    console.log(`Processed ${count} songs`);
}

onBeforeMount(async () => {
    let id = route.query.id;
    console.log(id);
    if (id != "") {
        await get(id * 1);
        console.log(data.value);
    }
    console.log(data.value.songs);
    processData(data.value.songs);
    console.log(songs.value);
});
</script>

<style lang="less" scoped>
.album-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin-top: 60px;
    // overflow-y: scroll;

    .album-header {
        display: flex;
        flex-direction: row;
        background-color: #457394;

        .cover {
            img {
                width: 200px;
                height: 200px;
            }

            padding: 20px;
        }

        .section-two {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 22px;

            .album-name {
                margin-bottom: 10px;

                p {
                    font-size: 35px;
                    font-weight: 900;
                }
            }

            .album-description {
                margin-top: 10px;
                margin-bottom: 10px;

                span {
                    display: inline-block;
                    font-size: 14px;
                    color: #b3b3b3;
                }
            }
        }
    }

    .album-body {
        display: flex;
        flex-direction: column;
        // background: linear-gradient(#213646, #121212);
        padding-left: 20px;
        padding-right: 20px;

        .btns {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 20px;

            .btn-play {
                width: 50px;
                height: 50px;
                background-color: #1fdf64;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                i {
                    color: #000;
                    font-size: 20px;
                }
            }
        }

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
                    grid-area: 1 / 1 / 2 / 4;
                    margin-left: 20px;

                    .idx {
                        display: inline-block;
                        margin-right: 38px;
                    }
                }

                .title-two {
                    grid-area: 1 / 4 / 2 / 5;
                }
            }

            .line {
                width: 100%;
                height: 1px;
                background-color: #30383d;
                margin-bottom: 10px;
            }

            .table-body {
                .table-item {
                    .table-item-container {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        grid-template-rows: 1fr;
                        grid-column-gap: 0px;
                        grid-row-gap: 0px;
                        padding: 5px;
                        color: #b3b3b3;

                        .block-one {
                            grid-area: 1 / 1 / 2 / 4;
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
                            grid-area: 1 / 4 / 2 / 5;
                            display: flex;
                            align-items: center;
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
                }
            }
        }
    }
}
</style>