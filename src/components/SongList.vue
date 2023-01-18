<template>
    <div class="song-list">
        <ul>
            <li v-for="item in songLists">
                <a href="#">{{ item.name }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup>
const songLists = ref([
    { name: "歌单1", slid: "111" },
    { name: "歌单2", slid: "222" },
]);
</script>

<style scoped lang="less">
.song-list {
    margin-top: 10px;

    ul {
        list-style: none;

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
</style>