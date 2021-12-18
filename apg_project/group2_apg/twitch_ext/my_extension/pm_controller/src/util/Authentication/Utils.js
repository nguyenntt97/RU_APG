export const API_BASE = 'https://apg-api-g2.herokuapp.com'
export const DEFAULT_CLIENT_ID = 'qwi88ymktf1qqjpnupb95egrhmj0um'
export const API_CLIENT_ID = 'qwi88ymktf1qqjpnupb95egrhmj0um'
export const DEFAULT_OPAQUE_ID = 'U730567156'

export const cloneIt = (obj) => JSON.parse(JSON.stringify(obj))
export const notiErr = (msg, onShow, onHide) => {
    onShow(msg)
    const timer = setTimeout(() => {
        onHide()
        clearTimeout(timer)
    }, 5000)
}
export const fetchApi = (url) => fetch(url)
    .then(res => {
        if (res.ok) return res.json();
        throw res;
    })
    .then(rs => rs)
    .catch(error => error
        .text()
        .then(err_msg => Promise.reject(`[${error.status}:${error.statusText}] ${err_msg}`)))