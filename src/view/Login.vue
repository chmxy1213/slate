<template>
    <div class="login-container">
        <div class="register card">
            <div class="card-title">
                <h1>注册</h1>
            </div>
            <div class="card-form">
                <div class="form-item">
                    <label for="register-username">昵称</label>
                    <input type="text" id="register-username" v-model="registerForm.nickName" />
                </div>
                <div class="form-item">
                    <label for="register-email">电子邮箱</label>
                    <input type="email" id="register-email" v-model="registerForm.email" />
                </div>
                <div class="form-item">
                    <label for="register-password">密码</label>
                    <input type="password" id="register-password" v-model="registerForm.password" />
                </div>
                <div class="form-item">
                    <label for="confirm-password">确认密码</label>
                    <input type="password" id="confirm-password" v-model="registerForm.confirmPassword" />
                </div>
                <div class="form-item">
                    <button @click="registerEvent">注册并登录</button>
                </div>
            </div>
        </div>
        <div class="login card">
            <div class="card-title">
                <h1>登录</h1>
            </div>
            <div class="card-form">
                <div class="form-item">
                    <label for="login-username">电子邮箱或昵称</label>
                    <input type="text" id="login-username" placeholder="Email address or NickName"
                        v-model="loginForm.username" />
                </div>
                <div class="form-item">
                    <label for="login-password">密码</label>
                    <input type="password" id="login-password" placeholder="Password" v-model="loginForm.password" />
                </div>
                <div class="form-item">
                    <button @click="loginEvent">登录</button>
                </div>
            </div>
        </div>
        <div class="line">
            <div class="item item-1"></div>
            <div class="icon" @click="selectEvent(0)">
                <svg t="1679983285068" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8115"
                    width="32" height="32">
                    <path
                        d="M521.7 82c-152.5-0.4-286.7 78.5-363.4 197.7-3.4 5.3 0.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8 7-8.5 14.5-16.7 22.4-24.5 32.6-32.5 70.5-58.1 112.7-75.9 43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9c-43.6 18.4-90 27.8-137.9 27.8-47.9 0-94.3-9.4-137.9-27.8-42.2-17.8-80.1-43.4-112.7-75.9-7.9-7.9-15.3-16.1-22.4-24.5-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.025 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112c4.1 3.2 4.1 9.4 0 12.6l-141.9 112c-5.2 4.1-13 0.4-13-6.3z"
                        p-id="8116" fill="#7970ba"></path>
                </svg>
            </div>
            <div class="item item-2"></div>
            <div class="icon" @click="selectEvent(1)">
                <svg t="1679983364957" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9378"
                    width="32" height="32">
                    <path
                        d="M632.555 583.662a334.724 334.724 0 0 1 34.43 15.764c13.844 7.312 19.14 24.463 11.828 38.308-7.312 13.845-24.463 19.14-38.308 11.829-39.825-21.033-84.256-32.18-130.354-32.18-134.46 0-249.156 95.628-274.315 225.944-2.968 15.373-17.837 25.43-33.21 22.462-15.374-2.968-25.43-17.837-22.462-33.21 22.237-115.181 102.51-207.796 207.629-248.892-76.518-42.868-128.233-124.698-128.233-218.602 0-138.316 112.198-250.435 250.592-250.435 138.392 0 250.59 112.12 250.59 250.435 0 93.886-51.695 175.702-128.187 218.577z m71.487-218.577c0-106.992-86.804-193.735-193.89-193.735-107.088 0-193.892 86.742-193.892 193.735 0 106.992 86.804 193.734 193.892 193.734 107.086 0 193.89-86.743 193.89-193.734z m12.694 346.77V626.83a28.26 28.26 0 0 1 3.87-14.324 28.468 28.468 0 0 1 10.175-10.174 28.26 28.26 0 0 1 14.324-3.87 28.26 28.26 0 0 1 14.324 3.87 28.468 28.468 0 0 1 10.174 10.174 28.26 28.26 0 0 1 3.87 14.324v85.025h84.179c15.656 0 28.348 12.692 28.348 28.349 0 15.656-12.692 28.348-28.348 28.348h-84.18v84.08a28.26 28.26 0 0 1-3.87 14.324 28.468 28.468 0 0 1-10.173 10.174 28.26 28.26 0 0 1-14.324 3.87 28.26 28.26 0 0 1-14.324-3.87 28.468 28.468 0 0 1-10.175-10.174 28.26 28.26 0 0 1-3.87-14.324v-84.08h-85.124c-15.656 0-28.348-12.692-28.348-28.348 0-15.657 12.692-28.349 28.348-28.349h85.124z"
                        fill="#248739" p-id="9379"></path>
                </svg>
            </div>
            <div class="item item-3"></div>
            <div class="select">
                <span>登录</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { message } from "@tauri-apps/api/dialog";
import { useUserStore } from "../stores/user";

const { user, save } = useUserStore();
const router = useRouter();

const loginForm = ref({
    username: "",
    password: "",
});

const registerForm = ref({
    nickName: "",
    email: "",
    password: "",
    confirmPassword: "",
});

// 0: login, 1: register
const selectState = ref(0);

function selectEvent(code) {
    selectState.value = code;
}

// TODO
// login function
async function loginEvent() {
    let res = await invoke("login", {
        reqData: {
            username: loginForm.value.username,
            password: loginForm.value.password,
        },
        t: "nickname"
    });
    if (res.code !== 200) {
        await message("登录失败", { title: "Login", type: "error" });
        return;
    }

    user.token = "Bearer " + res.data.token;
    save();
    router.push({ name: "main" });
}

// register function
async function registerEvent() {
    // Check form itme whether it is empty
    if (registerForm.value.nickName === "" || 
            registerForm.value.email === "" || 
            registerForm.value.password === "" || 
            registerForm.value.confirmPassword === "") {
        await message("Please fill in all the form items", { title: "Register", type: "error" });
        return;
    }
    // Check the email format
    if (!registerForm.value.email.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
        await message("Please enter the correct email address", { title: "Register", type: "error" });
        return;
    }

    // Check password and confirm password whether they are the same
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        // TODO: 后期加入弹框
        await message("The confirm password is not the same", { title: "Register", type: "error" });
        return;
    }
    let res = await invoke("register", {
        reqData: {
            nickname: registerForm.value.nickName,
            email: registerForm.value.email,
            password: registerForm.value.password,
        }
    });
    if (res.code !== 201) {
        await message("注册失败", { title: "Register", type: "error" });
        return;
    }
    await message("注册成功", { title: "Register", type: "info" });
    user.token = "Bearer " + res.data.token;
    user.email = registerForm.value.email;
    user.name = registerForm.value.nickName;
    save();
}

watch(selectState, (val) => {
    if (val === 0) {
        // 移动指标
        document.querySelector(".select").style.top = "30" + "%";;
        document.querySelector(".select span").innerText = "登录";
        // 切换表单
        document.querySelector(".login").style.display = "flex";
        document.querySelector(".register").style.display = "none";
    } else if (val === 1) {
        // 移动指标
        document.querySelector(".select").style.top = "65" + "%";;
        document.querySelector(".select span").innerText = "注册";
        // 切换表单
        document.querySelector(".login").style.display = "none";
        document.querySelector(".register").style.display = "flex";
    }
});

onBeforeMount(async () => {
    if (user.token) {
        let res = await invoke("check", {
            token: user.token
        });
    }

});
</script>

<style lang="less" scoped>
.login-container {
    width: 100%;
    height: 100vh;
    background-color: #0d1116;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .card {
        transition: .5s ease-in-out;
        border: 1px solid #30363d;
        border-radius: 10px;
        background-color: #161b22;
        position: absolute;
        width: 450px;
        height: 450px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .card-title {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            transition: 0.2s ease;

            h1 {
                color: #fff;
                padding: 10px;
                margin-bottom: 20px;
            }
        }

        .card-form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;

            .form-item {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                flex-direction: column;
                margin-bottom: 20px;

                label {
                    font-size: 20px;
                    padding: 5px;
                }

                input {
                    border: none;
                    outline: none;
                    border-radius: 10px;
                    padding: 10px;
                    width: 100%;
                    background-color: #fff;
                    color: #000;
                    font-size: 15px;
                }

                button {
                    border: none;
                    outline: none;
                    padding: 5px;
                    border-radius: 3px;
                    background-color: #fff;
                    color: #000;
                }

                button:hover {
                    background-color: #9074bc;
                    transition: .2s ease;
                }
            }
        }
    }

    .line {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 90vh;
        width: 50px;
        right: 15%;
        top: 50%;
        transform: translate(-50%, -50%);

        .item {
            width: 4px;
            height: 40%;
            border-radius: 5px;
        }

        .item-1 {
            // background: linear-gradient(#d2a8ff, #a371f7 10%, #196c2e 70%, #2ea043 80%, #56d364);
            background: linear-gradient(#d2a8ff, #9370df 50%, #756fb4);
        }

        .item-2 {
            background: linear-gradient(#7470b3, #546e84 50%, #2e6d4d);
        }

        .item-3 {
            background: linear-gradient(#2e6d4d, #2d9d42 50%, #56d364);
        }

        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3px;
            margin: 3px;
            border-radius: 5px;
            filter: drop-shadow(0 0 10px #9074bc);
            cursor: pointer;
        }

        .select {
            position: absolute;
            top: 30%;
            left: 60px;
            border-radius: 5px;
            background-color: #9074bc;
            width: 60px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275);
        }

        // 再select元素左边用before伪元素添加一个箭头
        .select::before {
            position: absolute;
            content: '';
            top: 50%;
            left: -9px;
            width: 0;
            height: 0;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-right: 10px solid #9074bc;
            transform: translateY(-50%);
        }
    }
}

.login {
    animation: up 0.5s;
    display: flex;
}

.register {
    animation: down 0.5s;
    display: none;
}

// 过渡动画
@keyframes down {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(50px);
    }
}

@keyframes up {
    0% {
        opacity: 1;
        transform: translateY(0);

    }

    100% {
        opacity: 0;
        transform: translateY(-50px);
    }
}
</style>