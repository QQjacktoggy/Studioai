document.addEventListener('DOMContentLoaded', () => {
    const playerNameSpan = document.getElementById('player-name');
    const playerLevelSpan = document.getElementById('player-level');
    const playerXpSpan = document.getElementById('player-xp');
    const playerXpNextSpan = document.getElementById('player-xp-next');

    const monsterNameSpan = document.getElementById('monster-name');
    const monsterHpSpan = document.getElementById('monster-hp');

    const questionP = document.getElementById('question');
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('answer-input');
    const messageP = document.getElementById('message');

    let gameActive = false;

    const updateUI = (state) => {
        // Player Stats
        if (state.player_stats) {
            playerNameSpan.textContent = state.player_stats.name;
            playerLevelSpan.textContent = state.player_stats.level;
            playerXpSpan.textContent = state.player_stats.xp;
            playerXpNextSpan.textContent = state.player_stats.xp_to_next_level;
        }

        // Monster Stats
        if (state.monster_stats) {
            monsterNameSpan.textContent = state.monster_stats.name;
            monsterHpSpan.textContent = state.monster_stats.hp;
        }

        // Question
        if (state.question_text) {
            questionP.textContent = state.question_text;
        }

        // Message is handled separately in the event handlers
    };

    const startGame = () => {
        const name = prompt("Enter your hero's name:", "Hero");
        if (!name) return;

        const initialState = Game.start_game(name);
        updateUI(initialState);
        messageP.textContent = `A wild ${initialState.monster_stats.name} appears!`;
        answerInput.focus();
        gameActive = true;
    };

    const handleAnswerSubmit = (e) => {
        e.preventDefault();
        if (!gameActive) return;

        const answer = answerInput.value;
        if (answer === '') return;

        const result = Game.submit_answer(answer);

        answerInput.value = '';
        updateUI(result.game_state);
        messageP.textContent = result.message;

        if (result.monster_defeated) {
            gameActive = false;
            questionP.textContent = "You won the battle!";
            // Create a "Next Battle" button
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next Battle';
            answerForm.replaceWith(nextButton); // Replace form with button
            nextButton.addEventListener('click', () => {
                nextBattle(nextButton);
            });
        } else {
             answerInput.focus();
        }
    };

    const nextBattle = (button) => {
        const newState = Game.new_battle();
        updateUI(newState);
        messageP.textContent = `A wild ${newState.monster_stats.name} appears!`;

        // Restore the form
        button.replaceWith(answerForm);
        answerInput.focus();
        gameActive = true;
    };

    answerForm.addEventListener('submit', handleAnswerSubmit);

    startGame();
});
