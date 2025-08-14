document.addEventListener('DOMContentLoaded', () => {
    // Player UI Elements
    const playerImage = document.getElementById('player-image');
    const playerNameSpan = document.getElementById('player-name');
    const playerLevelSpan = document.getElementById('player-level');
    const playerHpSpan = document.getElementById('player-hp');
    const playerMaxHpSpan = document.getElementById('player-max-hp');
    const playerMpSpan = document.getElementById('player-mp');
    const playerMaxMpSpan = document.getElementById('player-max-mp');
    const playerXpSpan = document.getElementById('player-xp');
    const playerXpNextSpan = document.getElementById('player-xp-next');

    // Monster UI Elements
    const monsterImage = document.getElementById('monster-image');
    const monsterNameSpan = document.getElementById('monster-name');
    const monsterHpSpan = document.getElementById('monster-hp');

    // Game Area UI Elements
    const questionP = document.getElementById('question');
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('answer-input');
    const messageP = document.getElementById('message');
    const skillsArea = document.getElementById('skills-area');

    let gameActive = false;

    const updateUI = (state) => {
        // Player Stats
        if (state.player_stats) {
            const stats = state.player_stats;
            playerImage.src = stats.image;
            playerNameSpan.textContent = stats.name;
            playerLevelSpan.textContent = stats.level;
            playerHpSpan.textContent = stats.hp;
            playerMaxHpSpan.textContent = stats.max_hp;
            playerMpSpan.textContent = stats.mp;
            playerMaxMpSpan.textContent = stats.max_mp;
            playerXpSpan.textContent = stats.xp;
            playerXpNextSpan.textContent = stats.xp_to_next_level;

            // Update skill buttons based on MP
            document.querySelectorAll('.skill-button').forEach(button => {
                const skillName = button.id.replace('skill-', '');
                const skill = SKILLS[skillName];
                if (skill) {
                    button.disabled = !Game.player.can_use_skill(skill.cost);
                }
            });
        }

        // Monster Stats
        if (state.monster_stats) {
            monsterImage.src = state.monster_stats.image;
            monsterNameSpan.textContent = state.monster_stats.name;
            monsterHpSpan.textContent = state.monster_stats.hp;
        }

        // Question
        if (state.question_text) {
            questionP.textContent = state.question_text;
        }
    };

    const startGame = () => {
        const name = prompt("Enter your hero's name:", "Hero");
        if (!name) return;

        const gameContainer = document.getElementById('action-area');
        if (!gameContainer.contains(answerForm)) {
            const button = gameContainer.querySelector('button');
            if (button) {
                button.replaceWith(answerForm);
            }
        }

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

        handlePostActionState(result);
    };

    const handleSkillUse = (skillName) => {
        if (!gameActive) return;

        const result = Game.use_skill(skillName);
        updateUI(result.game_state);
        messageP.textContent = result.message;

        handlePostActionState(result);
    };

    const handlePostActionState = (result) => {
        if (result.player_defeated) {
            gameActive = false;
            questionP.textContent = "GAME OVER";
            skillsArea.style.display = 'none';
            const restartButton = document.createElement('button');
            restartButton.textContent = 'Restart Game';
            answerForm.replaceWith(restartButton);
            restartButton.addEventListener('click', () => {
                skillsArea.style.display = 'block';
                startGame();
            });
        } else if (result.monster_defeated) {
            gameActive = false;
            questionP.textContent = "You won the battle!";
            skillsArea.style.display = 'none';
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next Battle';
            answerForm.replaceWith(nextButton);
            nextButton.addEventListener('click', () => {
                skillsArea.style.display = 'block';
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

        button.replaceWith(answerForm);
        answerInput.focus();
        gameActive = true;
    };

    answerForm.addEventListener('submit', handleAnswerSubmit);
    document.getElementById('skill-Fireball').addEventListener('click', () => handleSkillUse('Fireball'));
    document.getElementById('skill-Heal').addEventListener('click', () => handleSkillUse('Heal'));

    startGame();
});
