let YesNo_template = (floor) => ` <h2>Итак,</h2>
                        <p>бросаем с ${toLocaleString(floor)} этажа.</p>
                        <p>Разбился?</p>
                        <div class="bottom_container">
                            <div class="btn yes_btn">Да</div>
                            <div class="btn no_btn">Нет</div>
                        </div>`;
let finish_template = (curr_floor, count_attempts) => ` <h2>Узнали!</h2>
                        <p>Шарик разбился с ${toLocaleString(curr_floor)} этажа.</p>
                        <p>Нам понадобилось ${count_attempts} попыток.</p>
                        <div class="bottom_container">
                            <div class="btn repeat_btn">Начать заново!</div>
                            <a href="about.html" class="btn">О проекте</a>
                        </div>`;
let finish_err_template = `<h2>Узнали!</h2>
                        <p>Вот это прочный шарик, его не разбить с этого здания.</p>
                        <div class="bottom_container">
                            <div class="btn repeat_btn">Начать заново!</div>
                            <a href="about.html" class="btn">О проекте</a>
                        </div>`;
let update_progress = function (total_floors, total_marbles, marbles, attempts) {
    let container = $('.progress_container')
    container.css('opacity', 1);
    $('.total_floors', container).html(toLocaleString(total_floors));
    $('.total_marbles', container).html(toLocaleString(total_marbles));
    $('.marbles', container).html(toLocaleString(marbles));
    $('.total_attempts', container).html(attempts);
};
let update_progress_1 = function (marbles, attempts) {
    let container = $('.progress_container');
    $('.marbles', container).html(toLocaleString(marbles));
    $('.attempts', container).html(attempts);
};

let count_attempts = 0n;
let count_marbles = 0n;
let count_floors = 0n;
let count_response = 0n;

let curr_floor = 0n;
let start_floor = 1n;
let end_floor = 0n;
let crash_floor = 0n;
let total_floor = 0n;

function debug(str, response) {
    console.log('case: ', str,
        'curr_floor = ', curr_floor,
        'start_floor = ', start_floor,
        'end_floor = ', end_floor,
        'crash_floor = ', crash_floor,
        'total_floor = ', total_floor,
        'response = ', response);
}

$('.form').submit(function (e) {
    e.preventDefault();
    let flag = $('input[name="flag"]');
    switch (flag.val()) {
        case '0':
            $(this).html(`
                        <input type="hidden" name="flag" value="1">
                        <h2>Узнаем сколько бросков понадобится сделать.</h2>
                        <p>Сколько шариков?</p>
                        <input type="number" name="count_marbles" value="3">
                        <p>Сколько этажей?</p>
                        <input type="number" name="count_floors" value="8">
                        <button type="submit" class="btn btn_jq">Посчитать!</button>`)
            setImage('man2');
            break;
        case '1':
            count_marbles = BigInt($('input[name="count_marbles"]').val());
            count_floors = BigInt($('input[name="count_floors"]').val());
            end_floor = count_floors;
            total_floor = count_floors;
            crash_floor = end_floor;
            count_response = counting_throws(count_marbles, count_floors);
            debug('case 1', count_response);
            update_progress(count_floors, count_marbles, count_marbles, count_response.casts);
            setImage('man3');
            $(this).html(`
                        <input type="hidden" name="flag" value="2">
                        <h2>Итак,</h2>
                        <p>нам понадобится до ${count_response.casts} бросков</p>
                        <button type="submit" class="btn">Проверим это!</button>`)
            break;
        case '2':
            setImage('man4');
            debug('case 2', count_response);
            curr_floor = count_marbles === 1n || count_floors === 1n ? 1n : count_response.table[count_response.casts - 2n][count_marbles - 2n] + 1n;
            $(this).html(YesNo_template(curr_floor));
            break;
    }
});

$(document).on('click', '.yes_btn', function (e) {
    let response = '';
    let name_animation = '';
    setImage('crash');
    count_attempts++;
    crash_floor = curr_floor;
    //TODO: тут если разбился
    count_marbles--;
    end_floor = curr_floor - 1n;
    curr_floor_response = get_floor(start_floor, end_floor, count_marbles);
    if (curr_floor_response.isFinish) {
        debug('yes_btn finish', curr_floor_response);
        response = finish_template(curr_floor, count_attempts);
        name_animation = 'final';
    } else {
        debug('yes_btn nofinish', curr_floor_response);
        curr_floor = curr_floor_response.curr_floor;
        response = YesNo_template(curr_floor);
        name_animation = 'man4';
    }
    update_progress_1(count_marbles, count_attempts);
    setTimeout(setImage, 900, name_animation);
    $('.form').html(response);
});

$(document).on('click', '.no_btn', function (e) {
    //TODO: тут если не разбился
    let response = '';
    let name_animation = '';
    setImage('nocrash');
    count_attempts++;
    start_floor = curr_floor + 1n;
    curr_floor_response = get_floor(start_floor, end_floor, count_marbles, curr_floor);
    curr_floor = curr_floor_response.curr_floor;
    curr_floor = curr_floor >= total_floor ? total_floor : curr_floor;
    if (curr_floor_response.isFinish) {
        debug('no_btn finish', curr_floor_response);
        response = finish_template(crash_floor, count_attempts);
        if (curr_floor === total_floor) {
            debug('no_btn finish if crash_floor === total_floor', curr_floor_response);
            response = finish_err_template;
        } else {
            response = finish_template(crash_floor, count_attempts);
        }
        name_animation = 'final';
    } else {
        debug('no_btn nofinish', curr_floor_response);
        response = YesNo_template(curr_floor);
        name_animation = 'man4';
    }
    $('.form').html(response);
    setTimeout(setImage, 1600, name_animation);
    update_progress_1(count_marbles, count_attempts);
});

$(document).on('click', '.repeat_btn', function (e) {
    location.reload();
});

$(document).on('click', 'input[name="count_floors"]',  function (e){
    let count = $('input[name="count_marbles"]').val().length;
    $('input[name="count_floors"]').attr('max', Math.pow(10, 3 * count));
});

$(document).on('click', '.btn_jq',  function (e){
    let count = $('input[name="count_marbles"]').val().length;
    $('input[name="count_floors"]').attr('max', Math.pow(10, 4 * count));
});


