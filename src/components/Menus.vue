<template>
    <div class="box-nav">
        <div class="nav">
            <ul>
                <li class="list" :class="{ 'active': navFocus[0] }" @click="navClick(0)">
                    <span class="icon">
                        <img src="/svg/home.svg">
                    </span>
                    <span class="text">主页</span>
                </li>
                <li class="list" :class="{ 'active': navFocus[1] }" @click="navClick(1)">
                    <span class="icon">
                        <img src="../assets/icon/search.svg">
                    </span>
                    <span class="text">搜索</span>
                </li>
                <li class="list" :class="{ 'active': navFocus[2] }" @click="navClick(2)">
                    <span class="icon">
                        <img src="../assets/icon/lib.svg">
                    </span>
                    <span class="text">音乐库</span>
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
const navRouteName = [
    "home", "search", "like"
];

const navClick = function (i) {
    console.log(`点击 ${i}`);
    for (let j = 0; j < 3; j++) {
        navFocus.value[j] = false;
    }
    navFocus.value[i] = true
    router.push({ name: navRouteName[i] })
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
                cursor: pointer;
                border: 1px solid white;
                list-style: none;
                margin-bottom: 20px;
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
                    }
                }

                .text {
                    font-weight: 600;
                    font-size: 18px;
                    // color: #b1b2b3;
                    color: #fff;
                }
            }

            li:hover {
                transition: .5s;
                opacity: 1;
            }

            li.active {
                opacity: 1;
            }
        }
    }
}</style>