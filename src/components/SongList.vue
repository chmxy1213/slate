<template>
    <div class="song-list">
        <div class="create-label" @click="createEvent">
            <font-awesome-icon class="icon" :icon="['fas', 'square-plus']" />
            <span>创建歌单</span>
        </div>
        <ul class="items">
            <li v-for="item in list">
                <a @click="jump(item.head.id)">{{ item.head.name }}</a>
            </li>
        </ul>
    </div>
    <div class="dialog" v-show="visible">
        <div class="dialog-box">
            <div class="row-1">
                <h3>创建歌单</h3>
                <div class="close" @click="dialogClose">
                    <font-awesome-icon class="close-icon" :icon="['fas', 'xmark']" />
                </div>
            </div>
            <div class="row-2">
                <div class="input-img"></div>
                <div class="col-2">
                    <input type="text" placeholder="歌单名字" v-model="name">
                    <div v-if="createState == 0" class="submit" @click="submit">创建</div>
                    <div v-else>
                        <font-awesome-icon class="sending" :icon="['fas', 'spinner']" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const list = ref([]);
const visible = ref(false);
const name = ref("");
const createState = ref(0);  // 0: 未创建 1: 创建中 2: 创建成功 3: 创建失败
const { user, playlists } = useUserStore();

list.value = playlists.custom;

function jump(id) {
    console.log("jump");
    router.push({
        name: "playlist",
        query: {
            id,
            type: "custom",
        },
    });
}

function createEvent() {
    console.log("create Event");
    visible.value = true;
}

function dialogClose() {
    visible.value = false;
}

async function submit() {
    // set load is true
    createState.value = 1;
    console.log("submit");
    console.log(name.value);
    console.log(user.token);
    let [res, err] = await invoke("create_playlist", { token: user.token, name: name.value })
        .then(res => [res, null])
        .catch(err => [null, err]);
    if (err) {
        console.log(err);
        createState.value = 3;
        return;
    } else {
        console.log(res);
        createState.value = 2;
        // update playlist
        let [data, err] = await invoke("get_all_playlist_header", {
            token: user.token,
            id: user.id,
        }).then(data => [data, null]).catch(err => [null, err]);
        if (data) {
            playlists.custom.length = 0;
            data.data.forEach((value) => {
                if (value.name === "__LIKE__") {
                    playlists.like = value;
                } else {
                    playlists.custom.push(value);
                }
            });
        } else {
            console.log("获取用户歌单失败");
            console.log(err);
        }

        // close dialog and reset state
        setTimeout(() => {
            visible.value = false;
            createState.value = 0;
        }, 1000);
    }
}
</script>

<style scoped lang="less">
.song-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;

    .create-label {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        opacity: 0.8;
        cursor: pointer;

        .icon {
            width: 28px;
            height: 28px;
        }

        span {
            margin-left: 10px;
            font-size: 15px;
            font-weight: bold;
        }
    }

    .create-label:hover {
        opacity: 1;
        transition: 0.2s;
    }

    .items {
        list-style: none;
        margin-top: 10px;

        li {
            padding-bottom: 5px;

            a {
                color: #fff;
                opacity: 0.7;
            }

            a:hover {
                opacity: 1;
                color: #f2f2f2;
            }
        }
    }
}

.dialog {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;

    .dialog-box {
        display: flex;
        flex-direction: column;
        margin: 20px;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #3f3f3f;
        // background-color: rgba(14, 14, 14, 0.1);
        // backdrop-filter: saturate(50%) blur(6px);
        background-color: #272727;

        .row-1 {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            h3 {
                color: #fcfcfc;
            }

            .close {
                border-radius: 50%;
                color: #c5c5c5;
                padding: 5px 10px;
            }

            .close:hover {
                background-color: #3e3e3e;
            }
        }

        .row-2 {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: stretch;

            .input-img {
                width: 100px;
                height: 100px;
                background-color: #f2f2f2;
            }

            .col-2 {
                display: flex;
                flex-direction: column;
                margin-left: 20px;
                justify-content: space-around;
                align-items: center;
                flex-grow: 1;

                input {
                    display: flex;
                    top: 0;
                    border: none;
                    outline-style: none;
                    padding: 15px;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: bolder;
                }

                .submit {
                    display: flex;
                    padding: 5px;
                    background-color: #f2f2f2;
                    border-radius: 10px;
                    color: #000;
                    font-weight: bolder;
                    cursor: pointer;
                }

                .submit:hover {
                    background-color: #e2e2e2;
                }

                .sending {
                    width: 20px;
                    height: 20px;
                    padding: 6px;
                    color: #1fdf64;
                    background-color: #f2f2f2;
                    border-radius: 10px;
                    animation: load 1s infinite linear;
                }
            }
        }
    }

    .dialog-box:hover {
        transition: .5s;
        filter: drop-shadow(0px 0px 5px #b3b3b3);
    }
}

// load animation
@keyframes load {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>