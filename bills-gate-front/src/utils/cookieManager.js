export function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    });
    switch (name) {
        case 'user':
            return cookie[name] ? JSON.parse(cookie[name]) : null;
        default:
            return cookie[name];
    }
}

export function setCookie(cookie) {
    document.cookie = cookie;
}

export function deleteCookie(name) {
    document.cookie = `${name}=`;
}