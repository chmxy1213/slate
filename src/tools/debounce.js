// 节流工具函数

// sync debounce
export function debounce(fn, delay) {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

// async debounce
export function debounceAsync(fn, delay) {
    let timer = null
    return async function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(async () => {
            await fn.apply(this, args)
        }, delay)
    }
}