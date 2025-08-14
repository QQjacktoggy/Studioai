class Player {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.xp = 0;
        this.xp_to_next_level = 100;

        this.hp = 100;
        this.max_hp = 100;
        this.mp = 50;
        this.max_mp = 50;
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

            // Increase stats on level up
            this.max_hp += 20;
            this.hp = this.max_hp;
            this.max_mp += 10;
            this.mp = this.max_mp;

            leveled_up = true;
        }
        return leveled_up;
    }

    take_damage(damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }

    is_defeated() {
        return this.hp === 0;
    }

    can_use_skill(cost) {
        return this.mp >= cost;
    }

    use_mp(cost) {
        this.mp -= cost;
    }

    heal(amount) {
        this.hp += amount;
        if (this.hp > this.max_hp) {
            this.hp = this.max_hp;
        }
    }
}
