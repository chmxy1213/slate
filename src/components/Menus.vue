<template>
    <div class="box-nav">
        <div class="nav">
            <ul>
                <li class="list" :class="{ 'active': navFocus[0] }">
                    <a href="#" @click="navClick(0)">
                        <span class="icon">
                            <!-- <img src="../assets/icon/home.svg"> -->
                            <img src="/svg/home.svg">
                        </span>
                        <span class="text">主页</span>
                    </a>
                </li>
                <li class="list" :class="{ 'active': navFocus[1] }">
                    <a href="#" @click="navClick(1)">
                        <span class="icon">
                            <img src="../assets/icon/search.svg">
                        </span>
                        <span class="text">搜索</span>
                    </a>
                </li>
                <li class="list" :class="{ 'active': navFocus[2] }">
                    <a href="#" @click="navClick(2)">
                        <span class="icon">
                            <img src="../assets/icon/lib.svg">
                        </span>
                        <span class="text">音乐库</span>
                    </a>
                </li>
            </ul>
        </div>
        <hr>
        <SongList />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SongList from './SongList.vue';

const router = useRouter();
const navFocus = ref([true, false, false]);
const navRouteName = new Map([
    [0, "home"],
    [1, "search"],
    [2, "like"],
]);
const navClick = function (i) {
    for (let i = 0; i < 3; i++) {
        navFocus.value[i] = false;
    }
    navFocus.value[i] = true
    router.push({ name: navRouteName.get(i) })
}
</script>

<style scoped lang="less">
.box-nav {
    display: flex;
    flex-direction: column;
    padding: 20px;

    .nav {
        display: flex;
        padding-bottom: 20px;

        ul {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;

            li {
                list-style: none;
                margin-bottom: 20px;

                a {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    opacity: 0.7;

                    .icon {
                        margin-right: 10px;
                        width: 20px;
                        height: 20px;
                        overflow: hidden;

                        img {
                            transition: .5s;
                            width: 20px;
                            height: 20px;
                            // transform: translateX(20px);
                            // filter: drop-shadow(#f2f2f2 -20px 0px 0px);
                        }
                    }

                    .text {
                        font-weight: 600;
                        font-size: 18px;
                        // color: #b1b2b3;
                        color: #fff;
                    }
                }

                a:hover {
                    transition: .5s;
                    opacity: 1;
                }
            }

            li.active {
                a {
                    opacity: 1;
                }

                .icon {
                    overflow: hidden;

                    img {
                        // transform: translateX(32px);
                        // filter: drop-shadow(skyblue -32px 0px 0px);
                    }
                }
            }
        }
    }
}
</style>