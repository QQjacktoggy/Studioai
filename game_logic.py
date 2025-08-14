import random
from player import Player
from monster import Monster

def generate_question(level):
    """Generates a multiplication question based on the player's level."""
    a = random.randint(1, level * 5)
    b = random.randint(1, 10)
    return a, b, a * b

# The battle and main loop logic will be moved to the Flask application
# and handled via web requests and responses.
