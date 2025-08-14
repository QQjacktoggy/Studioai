class Player:
    """Represents the player in the game."""

    def __init__(self, name):
        """Initializes a new Player."""
        self.name = name
        self.level = 1
        self.xp = 0
        self.xp_to_next_level = 100

    def __str__(self):
        """Returns a string representation of the player."""
        return f"{self.name} (Level {self.level})"

    def gain_xp(self, amount):
        """Adds experience points to the player."""
        self.xp += amount
        print(f"{self.name} gained {amount} XP!")
        self.check_level_up()

    def check_level_up(self):
        """Checks if the player has enough XP to level up."""
        if self.xp >= self.xp_to_next_level:
            self.level += 1
            self.xp -= self.xp_to_next_level
            self.xp_to_next_level = int(self.xp_to_next_level * 1.5)
            print(f"Congratulations! {self.name} leveled up to Level {self.level}!")
