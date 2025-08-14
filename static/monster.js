class Monster {
    constructor(name, hp) {
        this.name = name;
        this.hp = hp;
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
}
