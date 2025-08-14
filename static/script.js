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

    const updateUI = (data) => {
        // Player Stats
        if (data.player_stats) {
            playerNameSpan.textContent = data.player_stats.name;
            playerLevelSpan.textContent = data.player_stats.level;
            playerXpSpan.textContent = data.player_stats.xp;
            playerXpNextSpan.textContent = data.player_stats.xp_to_next_level;
        }

        // Monster Stats
        if (data.monster_stats) {
            monsterNameSpan.textContent = data.monster_stats.name;
            monsterHpSpan.textContent = data.monster_stats.hp;
        }

        // Question
        if (data.new_question) {
            questionP.textContent = data.new_question;
        }

        // Message
        if (data.message) {
            messageP.textContent = data.message;
        }
    };

    const startGame = async () => {
        const name = prompt("Enter your hero's name:", "Hero");
        if (!name) return;

        const response = await fetch('/api/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });
        const data = await response.json();
        updateUI(data);
        answerInput.focus();
        gameActive = true;
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!gameActive) return;

        const answer = answerInput.value;
        if (answer === '') return;

        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer: answer })
        });

        answerInput.value = '';
        const data = await response.json();
        updateUI(data);

        if (data.monster_defeated) {
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

    const nextBattle = async (button) => {
        const response = await fetch('/api/new_battle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        updateUI(data);

        // Restore the form
        button.replaceWith(answerForm);
        answerInput.focus();
        gameActive = true;
    };

    answerForm.addEventListener('submit', handleAnswerSubmit);

    startGame();
});
