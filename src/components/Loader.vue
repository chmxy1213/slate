<template>
    <div class="loader" :style="dsp ? '' : 'display:none;'">
        <div class="loader-inner">
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    dsp: { type: Boolean, default: false }
});
</script>

<style scoped lang="less">
.loader {
    position: relative;

    .loader-inner {
        bottom: 0;
        height: 60px;
        margin: auto;
        right: 0;

        .loader-line-wrap {
            animation: spin 2s cubic-bezier(.175, .885, .32, 1.275) infinite;
            box-sizing: border-box;
            height: 50px;
            overflow: hidden;
            transform-origin: 50% 100%;

            .loader-line {
                border: 4px solid transparent;
                border-radius: 100%;
                box-sizing: border-box;
                height: 100px;
                left: 0;
                margin: 0 auto;
                position: absolute;
                right: 0;
                top: 0;
                width: 100px;
            }
        }

        .loader-line-wrap:first-child {
            animation-delay: -50ms;
        }

        .loader-line-wrap:nth-child(2) {
            animation-delay: -.1s;
        }

        .loader-line-wrap:nth-child(3) {
            animation-delay: -.15s;
        }

        .loader-line-wrap:nth-child(4) {
            animation-delay: -.2s;
        }

        .loader-line-wrap:nth-child(5) {
            animation-delay: -.25s;
        }

        .loader-line-wrap:first-child .loader-line {
            border-color: #eb4747;
            height: 90px;
            width: 90px;
            top: 7px;
        }

        .loader-line-wrap:nth-child(2) .loader-line {
            border-color: #ebeb47;
            height: 76px;
            width: 76px;
            top: 14px;
        }

        .loader-line-wrap:nth-child(3) .loader-line {
            border-color: #47eb47;
            height: 62px;
            width: 62px;
            top: 21px;
        }

        .loader-line-wrap:nth-child(4) .loader-line {
            border-color: #47ebeb;
            height: 48px;
            width: 48px;
            top: 28px;
        }

        .loader-line-wrap:nth-child(5) .loader-line {
            border-color: #4747eb;
            height: 34px;
            width: 34px;
            top: 35px;
        }
    }

    .loader-inner,
    .loader-line-wrap {
        left: 0;
        position: absolute;
        top: 0;
        width: 100px;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(1turn);
    }
}
</style>