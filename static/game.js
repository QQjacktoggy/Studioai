const monster_types = [
    { name: "Slime", hp: 50 },
    { name: "Goblin", hp: 75 },
    { name: "Orc", hp: 100 },
    { name: "Dragon", hp: 200 }
];

const Game = {
    player: null,
    monster: null,
    current_question: {
        text: "",
        answer: null
    },

    start_game(player_name) {
        this.player = new Player(player_name);
        this.new_battle();
        return this.get_state();
    },

    new_battle() {
        const monster_data = monster_types[Math.floor(Math.random() * monster_types.length)];
        this.monster = new Monster(monster_data.name, monster_data.hp);
        this.generate_new_question();
        return this.get_state();
    },

    generate_new_question() {
        const a = Math.floor(Math.random() * (this.player.level * 5)) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        this.current_question.text = `What is ${a} x ${b}?`;
        this.current_question.answer = a * b;
    },

    submit_answer(player_answer) {
        const correct = parseInt(player_answer, 10) === this.current_question.answer;
        let message = "";
        let leveled_up = false;

        if (correct) {
            const damage = Math.floor(Math.random() * 10 + 10) * this.player.level;
            this.monster.take_damage(damage);
            leveled_up = this.player.gain_xp(10);
            message = `Correct! You dealt ${damage} damage.`;
            if (leveled_up) {
                message += " You leveled up!";
            }
        } else {
            message = `Wrong! The correct answer was ${this.current_question.answer}.`;
            // Could add player damage here in the future
        }

        let monster_defeated = this.monster.is_defeated();
        if (monster_defeated) {
            leveled_up = this.player.gain_xp(50) || leveled_up; // gain bonus xp
            message = `You defeated the ${this.monster.name}! You gain a bonus of 50 XP.`;
            if (leveled_up) {
                message += " You leveled up!";
            }
        } else {
            this.generate_new_question();
        }

        return {
            correct: correct,
            message: message,
            monster_defeated: monster_defeated,
            game_state: this.get_state()
        };
    },

    get_state() {
        return {
            player_stats: { ...this.player },
            monster_stats: { ...this.monster },
            question_text: this.current_question.text
        };
    }
};
