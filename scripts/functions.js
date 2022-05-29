let counting_throws = function (count_marbles, count_floors) {
    //Здесь реализация первого алгоритма на подсчет
    let response = {
        table: [],
        casts: 0n
    }
    let table_floors = [];
    let i = 0n;
    let sum = 0n;
    while (sum < count_floors) {
        let max_floors = [];
        for (let j = 0n; j < count_marbles; j++) {
            if (i === 0n) {
                max_floors.push(i + 1n);
            } else if (i !== 0n && j === 0n) {
                max_floors.push(i + 1n);
            } else {
                max_floors.push(table_floors[i - 1n][j - 1n] + table_floors[i - 1n][j] + 1n);
            }
            if (max_floors[j] >= count_floors && sum < count_floors) {
                sum = max_floors[j];
            }
        }
        table_floors.push(max_floors)
        i++;
    }
    response.table = table_floors;
    response.casts = count_marbles === 1 || count_floors === 1 ? count_floors : i;
    return response;
}

let get_floor = function (start_floor, end_floor, count_marbles, curr_floor) {
    function debug_inner(str) {
        console.log('inner case: ', str,
            'start_floor=', start_floor,
            'end_floor=', end_floor,
            'count_marbles=', count_marbles,
            'count_floor', count_floor);
    }

    let count_floor = end_floor - start_floor + 1n;
    let response = {
        curr_floor: curr_floor,
        isFinish: true
    }

    if (count_floor !== 0n && count_marbles !== 0n) {
        response.isFinish = false;
        if (count_floor < 3n || count_marbles < 2n) {
            response.curr_floor = start_floor;
        } else {
            debug_inner('else');
            console.log('counting_throws=', counting_throws(count_marbles, count_floor));
            let count_response = counting_throws(count_marbles, count_floor);
            response.curr_floor = start_floor + count_response.table[count_response.casts - 2n][count_marbles - 2n];
        }
    }
    return response;
}

function toLocaleString(number) {
    return number.toLocaleString('fullwide', {useGrouping: true});
}

function setImage(src) {
    $('.animation_img').attr('src', 'img/' + src + '.gif');
}

function ilog2_pe(value, base = 2n) {
    // example: ilog2_pe(255n) returns { p: 128n, e: 7n }
    if (base <= value) {
        let i = ilog2_pe(value, base ** 2n);
        let t = i.p * base
        console.log(t);
        return (t <= value) ? {p: t, e: i.e * 2n + 1n} : {p: i.p, e: i.e * 2n}
    }
    return {p: 1n, e: 0n};
}

function ilog2(n) {  // n is a positive non-zero BigInt
    const C1 = 1n;
    const C2 = 2n;
    let responce = 0n;
    for (let count = 0n; n > C1; count++) {
        n /= C2;
        responce = count;
    }
    return responce + 1n;
}