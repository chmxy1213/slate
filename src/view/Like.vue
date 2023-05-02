<!-- 在此页面展示点赞的歌曲、 -->
<template>
    <div class="like-container">
        <div class="menu">
            <div class="menu-item" :class="{ 'menu-item-active': menuSelect === index }" v-for="(item, index) in menus"
                :key="index" @click="menuSelect = index">
                <span>{{ item }}</span>
            </div>
        </div>
        <div class="like-box">
            <!-- 我的 -->
            <div v-show="menuSelect == 0" class="inner-box mine-box">
                <div class="mine-like-card" @click="$router.push({ name: 'playlist', query: { type: 'custom', id: playlists.like.id }})">
                    <span>喜欢的音乐</span>
                </div>
                <div class="mine-playlist-card" v-for="(item, index) in mineCreatePlaylist" :key="index"
                    @click="$router.push({ name: 'playlist', query: { type: 'custom', id: item.id }})">
                    <!-- <img :src="item.coverImg"> -->
                    <img src="/cover/我的名字.jpg">
                    <div class="row">
                        <div class="playlist-name">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="label">
                            <span>歌单</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 歌手 -->
            <div v-show="menuSelect == 1" class="inner-box artist-box">
                <div class="artist-card" v-for="(item, index) in artists" :key="index">
                    <img :src="item.coverImg">
                    <div class="row">
                        <div class="artist-name">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="label">
                            <span>歌手</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 专辑 -->
            <div v-show="menuSelect == 2" class="inner-box album-box">
                <div class="album-card" v-for="(item, index) in albums" :key="index">
                    <img :src="item.coverImg">
                    <div class="album-name">
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="row">
                        <div class="album-artist">
                            <span>{{ item.artist }}</span>
                        </div>
                        <div class="label">
                            <span>专辑</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 歌单 -->
            <div v-show="menuSelect == 3" class="inner-box playlist-box">
                <div class="playlist-card" v-for="(item, index) in playlist" :key="index">
                    <img :src="item.coverImg">
                    <div class="playlist-name">
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="creator">
                        <span>创建者：{{ item.creator }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { invoke } from "@tauri-apps/api";
import { useUserStore } from "../stores/user";

const { user, playlists } = useUserStore();
const menus = ["我的", "歌手", "专辑", "歌单"];
const menuSelect = ref(0);
const mineCreatePlaylist = ref([{ id: 0, name: "", coverImg: "" }]);
const artists = ref([
    {
        name: "歌手1", coverImg: "/cover/我的名字.jpg"
    },
    {
        name: "歌手2", coverImg: "/cover/我的名字.jpg"
    },
    {
        name: "歌手3", coverImg: "/cover/我的名字.jpg"
    },
]);
const albums = ref([
    {
        name: "专辑1", artist: "歌手1", coverImg: "/cover/我的名字.jpg"
    },
    {
        name: "专辑2", artist: "歌手2", coverImg: "/cover/我的名字.jpg"
    },
    {
        name: "专辑3", artist: "歌手3", coverImg: "/cover/我的名字.jpg"
    },
]);
const playlist = ref([
    {
        name: "歌单1", creator: "创作者1", coverImg: "/cover/我的名字.jpg"
    },
    {
        name: "歌单2", creator: "创作者2", coverImg: "/cover/我的名字.jpg"
    },
    {
        name: "歌单3", creator: "创作者3", coverImg: "/cover/我的名字.jpg"
    },
]);

onBeforeMount(async () => {
    // 用户歌单赋值
    mineCreatePlaylist.value = playlists.custom;
});
</script>

<style scoped lang="less">
.like-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;

    .menu {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-top: 20px;

        .menu-item {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 5px 10px;
            border-radius: 10px;
            margin-left: 20px;
            cursor: pointer;
            color: #fff;
            font-size: 14px;
            font-weight: bolder;
        }

        .menu-item:hover {
            background-color: #333333;
        }

        .menu-item-active {
            background-color: #333333;
        }
    }

    .like-box {
        display: flex;
        flex-grow: 1;
        justify-self: center;
        align-items: center;
        margin-top: 20px;
        width: 100%;
        height: 100%;

        .inner-box {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            height: 100%;
            padding-left: 20px;
            padding-right: 20px;
        }

        .mine-box {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .mine-like-card {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 250px;
                height: 200px;
                background: linear-gradient(to bottom, #3f13b8, #7b9088);
                border-radius: 10px;
                font-size: 30px;
                font-weight: bolder;
                margin: 10px;
            }

            .mine-like-card:hover {
                filter: drop-shadow(0px 0px 5px #b3b3b3);
            }

            .mine-playlist-card {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                // width: 200px;
                // height: 200px;
                margin: 10px;
                padding: 20px;
                border-radius: 10px;
                // background: linear-gradient(to bottom, #3f13b8, #7b9088);
                background: #333333;

                img {
                    width: 120px;
                    height: 120px;
                    border-radius: 5px;
                }

                .row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin-top: 10px;

                    .playlist-name {
                        font-size: 14px;
                        font-weight: bolder;
                        color: #fff;
                    }

                    .label {
                        font-size: 12px;
                        font-weight: bold;
                        color: #fff;
                    }
                }
            }

            .mine-playlist-card:hover {
                filter: drop-shadow(0px 0px 5px #b3b3b3);
            }
        }

        .artist-box {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;

            .artist-card {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                background-color: #2a2a2a;
                border-radius: 5px;
                padding: 20px;
                margin-right: 20px;

                img {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                }

                .row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin-top: 10px;

                    .artist-name {
                        font-size: 14px;
                        font-weight: bolder;
                        color: #fff;
                    }

                    .label {
                        font-size: 12px;
                        font-weight: bold;
                        color: #fff;

                    }
                }
            }

            .artist-card:hover {
                filter: drop-shadow(0px 0px 5px #b3b3b3);
            }
        }

        .album-box {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;

            .album-card {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                background-color: #2a2a2a;
                border-radius: 5px;
                padding: 20px;
                margin-right: 20px;

                img {
                    width: 120px;
                    height: 120px;
                    border-radius: 5px;
                }

                .album-name {
                    width: 100%;
                    margin-top: 10px;
                    font-size: 18px;
                    font-weight: bolder;
                    color: #fff;
                }

                .row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin-top: 10px;

                    .album-artist {
                        font-size: 14px;
                        font-weight: 400;
                        color: #a7a7a7;
                    }

                    .label {
                        font-size: 12px;
                        font-weight: bold;
                        color: #a7a7a7;
                    }
                }
            }

            .album-card:hover {
                filter: drop-shadow(0px 0px 5px #b3b3b3);
            }
        }

        .playlist-box {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;

            .playlist-card {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                background-color: #2a2a2a;
                border-radius: 5px;
                padding: 20px;
                margin-right: 20px;

                img {
                    width: 120px;
                    height: 120px;
                    border-radius: 5px;
                }

                .playlist-name {
                    width: 100%;
                    margin-top: 10px;
                    font-size: 18px;
                    font-weight: bolder;
                    color: #fff;
                }

                .creator {
                    width: 100%;
                    font-size: 14px;
                    font-weight: bold;
                    color: #a7a7a7;
                }
            }

            .playlist-card:hover {
                filter: drop-shadow(0px 0px 5px #b3b3b3);
            }
        }
    }
}
</style>