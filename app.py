from flask import Flask, render_template, request, jsonify
import random

from player import Player
from monster import Monster
from game_logic import generate_question

app = Flask(__name__)

# NOTE: For a real application, storing state in global variables is not ideal,
# especially with multiple users. A session-based or database approach
# would be more robust. For this single-player prototype, it's sufficient.
game_state = {
    "player": None,
    "monster": None,
    "current_question": None,
    "correct_answer": None
}

monster_types = [
    ("Slime", 50),
    ("Goblin", 75),
    ("Orc", 100),
    ("Dragon", 200)
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start', methods=['POST'])
def start_game():
    """Starts a new game, creating a player and the first monster."""
    player_name = request.json.get('name', 'Hero')
    player = Player(player_name)
    game_state['player'] = player

    return new_battle()

@app.route('/api/submit', methods=['POST'])
def submit_answer():
    """Processes the player's answer and returns the result."""
    player = game_state['player']
    monster = game_state['monster']

    if not player or not monster or monster.is_defeated():
        return jsonify({"error": "Game not in a valid state for answering."}), 400

    try:
        user_answer = int(request.json.get('answer'))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid answer format."}), 400

    correct = user_answer == game_state['correct_answer']
    message = ""
    damage = 0

    if correct:
        damage = random.randint(10, 20) * player.level
        monster.take_damage(damage)
        player.gain_xp(10)
        message = f"Correct! You dealt {damage} damage."
    else:
        message = f"Wrong! The correct answer was {game_state['correct_answer']}."
        # Player taking damage can be implemented here

    # Check for level up is handled within player.gain_xp

    response = {
        "correct": correct,
        "message": message,
        "player_stats": player.__dict__,
        "monster_stats": monster.__dict__
    }

    if monster.is_defeated():
        player.gain_xp(50) # Bonus XP
        response['monster_defeated'] = True
        response['message'] = f"You defeated the {monster.name}! You gain a bonus of 50 XP."
        response['player_stats'] = player.__dict__ # Re-send player stats after bonus XP
    else:
        # Generate a new question for the next turn
        num1, num2, answer = generate_question(player.level)
        game_state['current_question'] = f"What is {num1} x {num2}?"
        game_state['correct_answer'] = answer
        response['new_question'] = game_state['current_question']

    return jsonify(response)

@app.route('/api/new_battle', methods=['POST'])
def new_battle():
    """Starts a new battle with a new monster."""
    player = game_state['player']
    if not player:
        return jsonify({"error": "Player not found."}), 400

    monster_name, monster_hp = random.choice(monster_types)
    monster = Monster(monster_name, monster_hp)
    game_state['monster'] = monster

    num1, num2, answer = generate_question(player.level)
    game_state['current_question'] = f"What is {num1} x {num2}?"
    game_state['correct_answer'] = answer

    return jsonify({
        "message": f"A wild {monster.name} appears!",
        "player_stats": player.__dict__,
        "monster_stats": monster.__dict__,
        "new_question": game_state['current_question']
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
