import random
import time
from player import Player
from monster import Monster

def generate_question(level):
    """Generates a multiplication question based on the player's level."""
    a = random.randint(1, level * 5)
    b = random.randint(1, 10)
    return a, b, a * b

def battle(player, monster):
    """Handles the battle sequence between a player and a monster."""
    print(f"A wild {monster.name} appears!")
    while not monster.is_defeated():
        print("\n" + "="*20)
        print(player)
        print(monster)
        print("="*20)

        num1, num2, correct_answer = generate_question(player.level)

        try:
            answer = int(input(f"What is {num1} x {num2}? "))
            if answer == correct_answer:
                print("Correct!")
                damage = random.randint(10, 20) * player.level
                monster.take_damage(damage)
                print(f"You dealt {damage} damage to the {monster.name}.")
                player.gain_xp(10)
            else:
                print(f"Wrong! The correct answer is {correct_answer}.")
                print("You take 5 damage.")
                # In a real game, the player would have HP and take damage.
                # For now, we'll just print a message.
        except ValueError:
            print("Invalid input. Please enter a number.")

    print(f"\nYou defeated the {monster.name}!")
    player.gain_xp(50) # Bonus XP for defeating the monster

def main():
    """Main function for the game."""
    player_name = input("Enter your name: ")
    player = Player(player_name)
    print(f"Welcome, {player.name}!")

    monster_types = [
        ("Slime", 50),
        ("Goblin", 75),
        ("Orc", 100),
        ("Dragon", 200)
    ]

    while True:
        # Create a monster
        monster_name, monster_hp = random.choice(monster_types)
        monster = Monster(monster_name, monster_hp)

        # Start a battle
        battle(player, monster)

        # Ask to continue
        while True:
            again = input("\nContinue to the next battle? (y/n): ").lower()
            if again in ["y", "n"]:
                break
            print("Invalid input. Please enter 'y' or 'n'.")

        if again == "n":
            break

    print("\nThanks for playing!")


if __name__ == "__main__":
    main()
