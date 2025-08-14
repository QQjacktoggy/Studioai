class Player {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.xp = 0;
        this.xp_to_next_level = 100;
    }

    gain_xp(amount) {
        this.xp += amount;
        return this.check_level_up();
    }

    check_level_up() {
        let leveled_up = false;
        if (this.xp >= this.xp_to_next_level) {
            this.level += 1;
            this.xp -= this.xp_to_next_level;
            this.xp_to_next_level = Math.floor(this.xp_to_next_level * 1.5);
            leveled_up = true;
        }
        return leveled_up;
    }
}
