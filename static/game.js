const monster_types = [
    { name: "Slime", hp: 50, image: "https://placehold.co/150x150/a9a9a9/ffffff?text=Slime" },
    { name: "Goblin", hp: 75, image: "https://placehold.co/150x150/a9a9a9/ffffff?text=Goblin" },
    { name: "Orc", hp: 100, image: "https://placehold.co/150x150/a9a9a9/ffffff?text=Orc" },
    { name: "Dragon", hp: 200, image: "https://placehold.co/150x150/a9a9a9/ffffff?text=Dragon" }
];

const SKILLS = {
    "Fireball": { name: "Fireball", cost: 10, damage: 30, type: "damage" },
    "Heal": { name: "Heal", cost: 15, heal: 50, type: "heal" }
};

const Game = {
    player: null,
    monster: null,
    game_over: false,
    current_question: {
        text: "",
        answer: null
    },

    start_game(player_name) {
        this.game_over = false;
        this.player = new Player(player_name);
        this.player.image = "https://placehold.co/150x150/a9a9a9/ffffff?text=Player";
        this.player.skills = [SKILLS.Fireball, SKILLS.Heal]; // Give player default skills
        this.new_battle();
        return this.get_state();
    },

    new_battle() {
        const monster_data = monster_types[Math.floor(Math.random() * monster_types.length)];
        this.monster = new Monster(monster_data.name, monster_data.hp);
        this.monster.image = monster_data.image; // Assign image to monster instance
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
        if (this.game_over) {
            return {
                game_over: true,
                message: "The game is over. Please start a new game.",
                game_state: this.get_state()
            };
        }

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
            const damage_taken = 10;
            this.player.take_damage(damage_taken);
            message = `Wrong! The correct answer was ${this.current_question.answer}. You take ${damage_taken} damage.`;

            if (this.player.is_defeated()) {
                this.game_over = true;
                return {
                    player_defeated: true,
                    message: "You have been defeated... Game Over.",
                    game_state: this.get_state()
                };
            }
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
            player_defeated: false,
            game_state: this.get_state()
        };
    },

    get_state() {
        return {
            player_stats: { ...this.player },
            monster_stats: { ...this.monster },
            question_text: this.current_question.text
        };
    },

    use_skill(skill_name) {
        if (this.game_over) {
            return { message: "The game is over." };
        }

        const skill = SKILLS[skill_name];
        if (!skill) {
            return { message: "Skill not found." };
        }

        if (!this.player.can_use_skill(skill.cost)) {
            return { message: "Not enough MP!" };
        }

        this.player.use_mp(skill.cost);
        let message = "";

        if (skill.type === "damage") {
            this.monster.take_damage(skill.damage);
            message = `You used ${skill.name} and dealt ${skill.damage} damage!`;
        } else if (skill.type === "heal") {
            this.player.heal(skill.heal);
            message = `You used ${skill.name} and healed for ${skill.heal} HP.`;
        }

        const monster_defeated = this.monster.is_defeated();
        if (monster_defeated) {
            this.player.gain_xp(50); // gain bonus xp
            message += ` You defeated the ${this.monster.name}!`;
        }

        return {
            message: message,
            monster_defeated: monster_defeated,
            game_state: this.get_state()
        };
    }
};
