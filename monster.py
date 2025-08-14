class Monster:
    """Represents a monster in the game."""

    def __init__(self, name, hp):
        """Initializes a new Monster."""
        self.name = name
        self.hp = hp

    def __str__(self):
        """Returns a string representation of the monster."""
        return f"{self.name} (HP: {self.hp})"

    def take_damage(self, damage):
        """Reduces the monster's HP."""
        self.hp -= damage
        if self.hp < 0:
            self.hp = 0

    def is_defeated(self):
        """Checks if the monster's HP is 0."""
        return self.hp == 0
