<template>
    <div class="song-list">
        <ul>
            <li v-for="item in list">
                <RouterLink v-if="item.name !== '__LIKE__'" :to="{ name: 'playlist', query: { id: item.id, type: 'custom' } }">{{ item.name }}</RouterLink>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { RouterLink } from "vue-router";

const list = ref([]);
const { playlists } = useUserStore();

list.value = playlists.custom;
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