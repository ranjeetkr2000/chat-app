const map = new Map();

const a = {
    hi: 'ranjeet'
}

function addf (a, b) {
    return a + b;
}

const add = addf.bind(a);

function memoizeOne(fn) {
    function f (...args) {
        const key = args.join(',');
        if (map[key]) {
            console.log(map);
            return map[key];

        } else {
            map[key] = fn.apply(this, args);
        }
    }
    const newf = f.bind(fn);
    return newf;
}

const memoizeAdd = memoizeOne(add);

memoizeAdd(1, 2);
memoizeAdd(1, 2);