(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            if (document.querySelector("body")) setTimeout((function() {
                document.querySelector("body").classList.add("_loaded");
            }), 200);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("money")) {
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    } else {
        sessionStorage.setItem("money", 850);
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    }
    if (document.querySelector(".game")) if (+sessionStorage.getItem("money") >= 1) {
        document.querySelector(".block-bet__coins").textContent = 1;
        sessionStorage.setItem("current-bet", 1);
    } else {
        document.querySelector(".block-bet__coins").textContent = 0;
        sessionStorage.setItem("current-bet", 0);
    }
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    function delete_money(count, block) {
        let money = +sessionStorage.getItem("money");
        let new_money = (money - count).toFixed(2);
        sessionStorage.setItem("money", new_money);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.add("_delete-money")));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
        }), 500);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_delete-money")));
        }), 1500);
    }
    function no_money(block) {
        document.querySelectorAll(block).forEach((el => el.classList.add("_no-money")));
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_no-money")));
        }), 1e3);
    }
    function get_random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function add_money(count, block, delay, delay_off) {
        let money = +sessionStorage.getItem("money") + count;
        setTimeout((() => {
            sessionStorage.setItem("money", money.toFixed(1));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
            document.querySelectorAll(block).forEach((el => el.classList.add("_anim-add-money")));
        }), delay);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_anim-add-money")));
        }), delay_off);
    }
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [ array[j], array[i] ];
        }
        return array;
    }
    if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) {
        document.querySelector(".main").classList.add("_active");
        write_start_bonuses_store();
    }
    function write_start_bonuses_store() {
        if (!sessionStorage.getItem("bonus-1")) sessionStorage.setItem("bonus-1", 0);
        if (!sessionStorage.getItem("bonus-2")) sessionStorage.setItem("bonus-2", 0);
        if (!sessionStorage.getItem("bonus-3")) sessionStorage.setItem("bonus-3", 0);
    }
    if (document.querySelector(".shop") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".shop").classList.add("_active");
    const config = {
        field: document.querySelector(".field__items"),
        squares: [],
        program: 1,
        count_win: 0,
        start_count_tanks: 20,
        remains_move: 25
    };
    if (document.querySelector(".game") && document.querySelector(".preloader").classList.contains("_hide")) {
        document.querySelector(".game").classList.add("_active");
        check_bonuses();
        let field = create_field(20);
        draw_field(field);
        if (!sessionStorage.getItem("army-tanks")) {
            sessionStorage.setItem("army-tanks", 20);
            document.querySelector(".objective__button-count").textContent = sessionStorage.getItem("army-tanks");
        } else document.querySelector(".objective__button-count").textContent = sessionStorage.getItem("army-tanks");
    }
    function draw_field(array) {
        if (document.querySelector(".field__item")) document.querySelectorAll(".field__item").forEach((el => el.remove()));
        array.forEach(((el, i) => {
            let square;
            if (0 == el) square = create_item_empty(i); else square = create_item_tank(i);
            config.field.appendChild(square);
            config.squares.push(square);
        }));
    }
    function start_game() {
        let field = create_field(+sessionStorage.getItem("army-tanks"));
        draw_field(field);
        config.start_count_tanks = +sessionStorage.getItem("army-tanks");
        check_write_tanks();
        check_write_chance_to_win();
        document.querySelectorAll(".bonuses__button").forEach((el => el.classList.remove("_hold")));
    }
    function create_field(number) {
        let field = [];
        for (let i = 0; i < number; i++) field.push(1);
        let length = 25 - field.length;
        for (let i = 0; i < length; i++) field.push(0);
        field = shuffle(field);
        return field;
    }
    function create_item_tank(index) {
        let item = document.createElement("div");
        item.classList.add("field__item");
        item.classList.add("item-field");
        item.dataset.number = index + 1;
        let item_body = document.createElement("div");
        item_body.classList.add("item-field__body");
        let item_image = document.createElement("div");
        item_image.classList.add("item-field__image");
        let random_num = get_random(1, 3);
        let image = document.createElement("img");
        image.setAttribute("src", `img/main/tank-${random_num}.svg`);
        item_image.append(image);
        item.dataset.object = random_num;
        let item_circle = document.createElement("div");
        item_circle.classList.add("item-field__circle");
        let item_cap = document.createElement("div");
        item_cap.classList.add("item-field__cap");
        item_body.append(item_image, item_circle, item_cap);
        let target = create_target();
        item.append(item_body, target);
        return item;
    }
    function create_item_empty(index) {
        let item = document.createElement("div");
        item.classList.add("field__item");
        item.classList.add("item-field");
        item.dataset.number = index + 1;
        item.dataset.object = "0";
        let item_body = document.createElement("div");
        item_body.classList.add("item-field__body");
        let item_cap = document.createElement("div");
        item_cap.classList.add("item-field__cap");
        let text = document.createElement("div");
        text.classList.add("item-field__text");
        text.textContent = "miss";
        item_body.append(text, item_cap);
        let target = create_target();
        item.append(item_body, target);
        return item;
    }
    function create_target() {
        let target = document.createElement("div");
        target.classList.add("item-field__target");
        target.classList.add("target");
        let target_body = document.createElement("div");
        target_body.classList.add("target__body");
        let span_1 = document.createElement("span");
        let span_2 = document.createElement("span");
        let span_3 = document.createElement("span");
        let span_4 = document.createElement("span");
        let span_5 = document.createElement("span");
        target_body.append(span_1, span_2, span_3, span_4, span_5);
        target.append(target_body);
        return target;
    }
    function check_bonuses() {
        document.querySelectorAll(".button-bonus__count").forEach((el => {
            if (1 == el.dataset.bonus) el.textContent = `x${sessionStorage.getItem("bonus-1")}`;
            if (2 == el.dataset.bonus) el.textContent = `x${sessionStorage.getItem("bonus-2")}`;
            if (3 == el.dataset.bonus) el.textContent = `x${sessionStorage.getItem("bonus-3")}`;
        }));
    }
    function hold_button_bonus(block) {
        block.classList.add("_hold");
        setTimeout((() => {
            block.classList.remove("_hold");
        }), 2e3);
    }
    function check_game_over(block) {
        console.log(block);
        let dataset = block.dataset.object;
        if (0 == dataset) if (+sessionStorage.getItem("bonus-1") > 0) {
            setTimeout((() => {
                sessionStorage.setItem("bonus-1", +sessionStorage.getItem("bonus-1") - 1);
                check_bonuses();
                document.querySelectorAll(".bonuses__button").forEach((el => {
                    if (1 == el.dataset.bonus) el.classList.add("_anim");
                }));
            }), 2e3);
            setTimeout((() => {
                document.querySelectorAll(".bonuses__button").forEach((el => {
                    if (1 == el.dataset.bonus) el.classList.remove("_anim");
                }));
            }), 3e3);
        } else {
            setTimeout((() => {
                config.program = 3;
                change_start_button();
                document.querySelectorAll(".bonuses__button").forEach((el => el.classList.add("_hold")));
            }), 2e3);
            setTimeout((() => {
                document.querySelectorAll(".item-field__cap").forEach((el => el.classList.add("_hide")));
            }), 2500);
            document.querySelector(".field__items").classList.add("_hold");
            setTimeout((() => {
                config.program = 2;
                change_start_button();
                reset_game();
            }), 5e3);
        } else {
            sessionStorage.setItem("army-tanks", +sessionStorage.getItem("army-tanks") - 1);
            setTimeout((() => {
                check_write_tanks();
                check_write_chance_to_win();
                write_win();
            }), 2500);
        }
        if (+sessionStorage.getItem("army-tanks") <= 0) setTimeout((() => {
            document.querySelectorAll(".item-field__cap").forEach((el => el.classList.add("_hide")));
            document.querySelectorAll(".bonuses__bottom").forEach((el => el.classList.add("_hold")));
            setTimeout((() => {
                get_money_and_restart_game();
            }), 3e3);
        }), 4e3);
    }
    function get_money_and_restart_game() {
        change_start_button();
        document.querySelector(".field__items").classList.add("_hold");
        console.log(`config.count_win - ${config.count_win}`);
        add_money(+config.count_win, ".check", 1e3, 2e3);
        setTimeout((() => {
            config.count_win = 0;
            config.start_count_tanks = 20;
            config.remains_move = 25;
            reset_game();
        }), 2e3);
    }
    function change_start_button() {
        if (1 == config.program) {
            console.log(`config.program - ${config.program}`);
            document.querySelector(".actions-game__button-start p").textContent = "cash out";
            document.querySelector(".actions-game__button-start img").remove();
            document.querySelector(".actions-game__button-start").classList.add("button_cash");
            let count = document.createElement("div");
            count.classList.add("actions-game__button-start_cash");
            count.textContent = "0";
            document.querySelector(".actions-game__button-start").append(count);
        } else if (2 == config.program) {
            if (document.querySelector(".actions-game__button-start").classList.contains("button_cash")) document.querySelector(".actions-game__button-start").classList.remove("button_cash");
            if (document.querySelector(".actions-game__button-start_cash")) document.querySelector(".actions-game__button-start_cash").remove();
            document.querySelector(".actions-game__button-start p").textContent = "start game";
            let image = document.createElement("img");
            image.setAttribute("src", "img/icons/icon-airpalne.svg");
            image.setAttribute("alt", "Icon");
            document.querySelector(".actions-game__button-start").append(image);
            config.program = 1;
        } else if (3 == config.program) if (document.querySelector(".actions-game__button-start_cash")) document.querySelector(".actions-game__button-start_cash").remove();
    }
    function check_write_tanks() {
        document.querySelector(".information__number_1").textContent = sessionStorage.getItem("army-tanks");
    }
    function check_write_chance_to_win() {
        let empty = 25 - config.start_count_tanks;
        console.log(`config.start_count_tanks - ${config.start_count_tanks}`);
        let percent_die = (empty / config.remains_move * 100).toFixed(1);
        document.querySelector(".information__number_2").textContent = `${percent_die}%`;
    }
    function get_current_count_tanks() {
        return +sessionStorage.getItem("army-tanks");
    }
    function check_write_coins_win(count) {
        let bet = +sessionStorage.getItem("current-bet");
        let current_win = 0;
        if (22 == count) current_win = 1 * bet; else if (21 == count) current_win = 1.01 * bet; else if (20 == count) current_win = 1.05 * bet; else if (19 == count) current_win = 1.1 * bet; else if (18 == count) current_win = 1.2 * bet; else if (17 == count) current_win = 1.5 * bet; else if (16 == count) current_win = 1.8 * bet; else if (15 == count) current_win = 2 * bet; else if (14 == count) current_win = 2.5 * bet; else if (13 == count) current_win = 3 * bet; else if (12 == count) current_win = 3.5 * bet; else if (11 == count) current_win = 4 * bet; else if (10 == count) current_win = 5 * bet; else if (9 == count) current_win = 7 * bet; else if (8 == count) current_win = 9 * bet; else if (7 == count) current_win = 11 * bet; else if (6 == count) current_win = 13 * bet; else if (5 == count) current_win = 15 * bet; else if (4 == count) current_win = 20 * bet; else if (3 == count) current_win = 25 * bet; else if (2 == count) current_win = 30 * bet; else if (1 == count) current_win = 50 * bet; else if (0 == count) current_win = 100 * bet;
        let win_count = current_win.toFixed(1);
        return win_count;
    }
    function write_win() {
        let tank = get_current_count_tanks();
        let count_tank_win = check_write_coins_win(tank);
        let next_count_tank_win = check_write_coins_win(tank - 1);
        document.querySelector(".information__number_3").textContent = next_count_tank_win;
        if (document.querySelector(".actions-game__button-start_cash")) document.querySelector(".actions-game__button-start_cash").textContent = count_tank_win;
        config.count_win = count_tank_win;
        console.log(config.count_win);
    }
    function reset_game() {
        document.querySelector(".field__items").classList.add("_hold");
        document.querySelector(".block-bet").classList.remove("_hold");
        document.querySelector(".objective").classList.remove("_hold");
        document.querySelectorAll(".information__number").forEach((el => el.textContent = 0));
        sessionStorage.setItem("army-tanks", 20);
        document.querySelector(".objective__button-count").textContent = sessionStorage.getItem("army-tanks");
        document.querySelectorAll(".item-field__cap").forEach((el => {
            if (el.classList.contains("_hide")) el.classList.remove("_hide");
        }));
    }
    function open_item_and_check(block1, block2) {
        setTimeout((() => {
            block1.classList.add("_hide");
        }), 1800);
        check_game_over(block2);
        config.remains_move--;
        document.querySelector(".field__items").classList.add("_hold");
        setTimeout((() => {
            document.querySelector(".field__items").classList.remove("_hold");
        }), 2e3);
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        let current_bet = +sessionStorage.getItem("current-bet");
        let current_bank = +sessionStorage.getItem("money");
        if (targetElement.closest(".preloader__button")) {
            sessionStorage.setItem("preloader", true);
            preloader.classList.add("_hide");
            wrapper.classList.add("_visible");
            if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) {
                document.querySelector(".main").classList.add("_active");
                write_start_bonuses_store();
            }
        }
        if (targetElement.closest(".block-bet__minus")) if (current_bet > 1) {
            sessionStorage.setItem("current-bet", current_bet - 1);
            document.querySelector(".block-bet__coins_bet").textContent = sessionStorage.getItem("current-bet");
        }
        if (targetElement.closest(".block-bet__plus")) if (current_bank - 1 > current_bet) {
            sessionStorage.setItem("current-bet", current_bet + 1);
            document.querySelector(".block-bet__coins_bet").textContent = sessionStorage.getItem("current-bet");
        } else no_money(".check");
        if (targetElement.closest(".block-bet__min")) if (+sessionStorage.getItem("money") >= 1) {
            sessionStorage.setItem("current-bet", 1);
            document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
        } else no_money(".check");
        if (targetElement.closest(".block-bet__max")) if (+sessionStorage.getItem("money") >= 1) {
            sessionStorage.setItem("current-bet", +sessionStorage.getItem("money"));
            document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
        } else no_money(".check");
        if (targetElement.closest(".button-bonus__btn-buy") && 1 == targetElement.closest(".button-bonus__btn-buy").dataset.shop) if (+sessionStorage.getItem("money") >= 4.99) {
            sessionStorage.setItem("bonus-1", +sessionStorage.getItem("bonus-1") + 1);
            delete_money(4.99, ".check");
        } else no_money(".check");
        if (targetElement.closest(".button-bonus__btn-buy") && 2 == targetElement.closest(".button-bonus__btn-buy").dataset.shop) if (+sessionStorage.getItem("money") >= 2.99) {
            sessionStorage.setItem("bonus-2", +sessionStorage.getItem("bonus-2") + 1);
            delete_money(2.99, ".check");
        } else no_money(".check");
        if (targetElement.closest(".button-bonus__btn-buy") && 3 == targetElement.closest(".button-bonus__btn-buy").dataset.shop) if (+sessionStorage.getItem("money") >= 8.99) {
            sessionStorage.setItem("bonus-3", +sessionStorage.getItem("bonus-3") + 1);
            delete_money(8.99, ".check");
        } else no_money(".check");
        if (targetElement.closest(".objective__button_1")) {
            document.querySelector(".objective__button-count").textContent = 22;
            sessionStorage.setItem("army-tanks", 22);
        }
        if (targetElement.closest(".objective__button_2")) {
            document.querySelector(".objective__button-count").textContent = 20;
            sessionStorage.setItem("army-tanks", 20);
        }
        if (targetElement.closest(".objective__button_3") && +sessionStorage.getItem("army-tanks") > 1) {
            sessionStorage.setItem("army-tanks", +sessionStorage.getItem("army-tanks") - 1);
            document.querySelector(".objective__button-count").textContent = sessionStorage.getItem("army-tanks");
        }
        if (targetElement.closest(".objective__button_5") && +sessionStorage.getItem("army-tanks") < 22) {
            sessionStorage.setItem("army-tanks", +sessionStorage.getItem("army-tanks") + 1);
            document.querySelector(".objective__button-count").textContent = sessionStorage.getItem("army-tanks");
        }
        if (targetElement.closest(".objective__button_6")) {
            document.querySelector(".objective__button-count").textContent = 15;
            sessionStorage.setItem("army-tanks", 15);
        }
        if (targetElement.closest(".objective__button_7")) {
            document.querySelector(".objective__button-count").textContent = 5;
            sessionStorage.setItem("army-tanks", 5);
        }
        if (targetElement.closest(".bonuses__button") && 2 == targetElement.closest(".bonuses__button").dataset.bonus) if (+sessionStorage.getItem("bonus-2") > 0) {
            sessionStorage.setItem("bonus-2", +sessionStorage.getItem("bonus-2") - 1);
            check_bonuses();
            hold_button_bonus(targetElement.closest(".bonuses__button"));
            document.querySelectorAll(".bonuses__button").forEach((el => {
                if (2 == el.dataset.bonus) el.classList.add("_anim-2");
            }));
            document.querySelector(".field__items").classList.add("_locator");
        }
        if (targetElement.closest(".bonuses__button") && 3 == targetElement.closest(".bonuses__button").dataset.bonus) if (+sessionStorage.getItem("bonus-3") > 0) {
            sessionStorage.setItem("bonus-3", +sessionStorage.getItem("bonus-3") - 1);
            check_bonuses();
            hold_button_bonus(targetElement.closest(".bonuses__button"));
            let array_closed_tanks = [];
            document.querySelectorAll(".field__item").forEach((el => {
                if (!el.classList.contains("_active") && 0 != el.dataset.object) array_closed_tanks.push(el.dataset.number - 1);
            }));
            setTimeout((() => {
                document.querySelectorAll(".bonuses__button").forEach((el => {
                    if (3 == el.dataset.bonus) el.classList.add("_anim");
                }));
            }), 2e3);
            let random = get_random(0, array_closed_tanks.length);
            let num = array_closed_tanks[random];
            document.querySelectorAll(".field__item")[num].classList.add("_active");
            open_item_and_check(document.querySelectorAll(".item-field__cap")[num], document.querySelectorAll(".field__item")[num]);
        }
        if (targetElement.closest(".actions-game__button-start") && 1 == config.program) {
            change_start_button();
            document.querySelector(".block-bet").classList.add("_hold");
            document.querySelector(".objective").classList.add("_hold");
            start_game();
            delete_money(+sessionStorage.getItem("current-bet"), ".check");
            if (document.querySelector(".field__items").classList.contains("_hold")) document.querySelector(".field__items").classList.remove("_hold");
            setTimeout((() => {
                config.program = 2;
            }), 1e3);
        }
        if (targetElement.closest(".actions-game__button-start") && 2 == config.program) get_money_and_restart_game();
        if (targetElement.closest(".field__item")) if (document.querySelector(".field__items").classList.contains("_locator")) {
            document.querySelector(".field__items").classList.remove("_locator");
            document.querySelectorAll(".bonuses__button").forEach((el => {
                if (2 == el.dataset.bonus && el.classList.contains("_anim-2")) el.classList.remove("_anim-2");
            }));
            let number = targetElement.closest(".field__item").dataset.number - 1;
            console.log(`Locator, number - ${number}`);
            if (number - 6 >= 0 && 0 != number && 5 != number && 10 != number && 15 != number && 20 != number) {
                document.querySelectorAll(".item-field__cap")[number - 6].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number - 6].classList.remove("_locator");
                }), 1500);
            }
            if (number - 5 >= 0) {
                document.querySelectorAll(".item-field__cap")[number - 5].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number - 5].classList.remove("_locator");
                }), 1500);
            }
            if (number - 4 >= 0 && 4 != number && 9 != number && 14 != number && 19 != number && 24 != number) {
                document.querySelectorAll(".item-field__cap")[number - 4].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number - 4].classList.remove("_locator");
                }), 1500);
            }
            if (number - 1 >= 0 && 0 != number && 5 != number && 10 != number && 15 != number && 20 != number) {
                document.querySelectorAll(".item-field__cap")[number - 1].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number - 1].classList.remove("_locator");
                }), 1500);
            }
            document.querySelectorAll(".item-field__cap")[number].classList.add("_locator");
            setTimeout((() => {
                document.querySelectorAll(".item-field__cap")[number].classList.remove("_locator");
            }), 1500);
            if (number + 1 <= 24 && 4 != number && 9 != number && 14 != number && 19 != number && 24 != number) {
                document.querySelectorAll(".item-field__cap")[number + 1].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number + 1].classList.remove("_locator");
                }), 1500);
            }
            if (number + 4 <= 24 && 0 != number && 5 != number && 10 != number && 15 != number && 20 != number) {
                document.querySelectorAll(".item-field__cap")[number + 4].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number + 4].classList.remove("_locator");
                }), 1500);
            }
            if (number + 5 <= 24) {
                document.querySelectorAll(".item-field__cap")[number + 5].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number + 5].classList.remove("_locator");
                }), 1500);
            }
            if (number + 6 <= 24 && 4 != number && 9 != number && 14 != number && 19 != number && 24 != number) {
                document.querySelectorAll(".item-field__cap")[number + 6].classList.add("_locator");
                setTimeout((() => {
                    document.querySelectorAll(".item-field__cap")[number + 6].classList.remove("_locator");
                }), 1500);
            }
        } else {
            targetElement.closest(".field__item").classList.add("_active");
            open_item_and_check(targetElement.closest(".item-field__cap"), targetElement.closest(".field__item"));
        }
    }));
    window["FLS"] = true;
    isWebp();
    addLoadedClass();
})();