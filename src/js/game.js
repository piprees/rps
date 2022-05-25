import { choices } from '../models/Choices';
import { ResultId } from '../models/Results';
import { State } from '../models/State'

export function newGame(playerIsHuman = false) {
	return new State(playerIsHuman);
}

export function getPlayer(state, playerId) {
	return state.players.find((item) => item.id === playerId) || null;
}

export function getChoice(choiceId) {
	return choices.find((item) => item.id === choiceId) || null;
}

export function makeChoice(state, playerId, choiceId) {
	const player = getPlayer(state, playerId);
	const choice = getChoice(choiceId);

	if (!player) throw new Error('No player with that id')
	if (!choice) throw new Error('No choice with that id')

	player.choice = choice;
}

export function makeRandomChoice(state, playerId) {
	const player = getPlayer(state, playerId);

	const max = choices.length
	const pseudorandom =	Math.floor(Math.random() * max);
	const choice = choices[pseudorandom];

	if (!player) throw new Error('No player with that id')
	if (!choice) throw new Error('No choice with that id')

	player.choice = choice;
}

export function calculateResults(state) {
	const results = state.players.map((player) => state.players.map((comparePlayer) => {
		// Ignore the players' own choice
		if (player.id === comparePlayer.id) {
			return null;
		}

		const playerChoice = player.choice;
		const comparePlayerChoice = comparePlayer.choice;

		if (playerChoice.strengths.indexOf(comparePlayerChoice.id) > -1) {
			// Winner
			return true;
		}

		// Loser or Draw
		return false;
	}))

	const isDraw = results.every((item) => item.indexOf(true) > -1) || results.every((item) => item.indexOf(true) === -1);

	if (isDraw) {
		state.players.forEach((item) => item.result = ResultId.DRAW)
	} else {
		state.players.forEach((player, index) => {
			const result = results[index];
			if (result.some((item) => item === true)) {
				player.score = player.score + 1;
				player.result = ResultId.WIN;
			} else {
				player.result = ResultId.LOSE;
			}
		})
	}
}

export function setCPUChoices(state) {
	state.players.forEach((player) => {
		if (!player.isCPU) return;

		makeRandomChoice(state, player?.id);
	})
}

function render(state) {
	const element = document.querySelectorAll('#game');
	if (!element || (element && element.length === 0)) {
		throw new Error('Element could not be found')
	}

	const $ = (selector) => element[0].querySelectorAll(selector)[0];

	if (!state.initialized) {
		state.initialized = true;
		_hideLoaderElement($);
		_showGameElement($, state);
	}

	_setupButtons($, state);
	_togglePlayer1Buttons($, state);
	_updatePlayerElements($, state);
}

function _hideLoaderElement($) {
	const element = $('[data-game-loader]');
	element.setAttribute('hidden', true);
	element.setAttribute('aria-hidden', true);
}

function _showGameElement($) {
	const element = $('[data-game-stage]');
	element.removeAttribute('hidden');
	element.setAttribute('aria-hidden', false);
}

function _setupButtons($, state) {
	const element = $('[data-game-player-1-buttons-row]');
	const buttons = choices.map((item) => `
		<button type="button" onClick="window.game.makeHumanChoice(${state.players[0].id}, ${item.id})" class="border border-slate-600 rounded-md px-3 py-2 hover:border-pink-600 focus:border-pink-600 hover:bg-pink-700 focus:bg-pink-700 hover:text-white focus:text-white transition-colors duration-150">
			${item.label}
		</button>
	`)
	element.innerHTML = buttons.join('')
}


function _togglePlayer1Buttons($, state) {
	const playerButtonsElement = $('[data-game-player-1-buttons]');
	const cpuButtonsElement = $('[data-game-cpu-buttons]');

	const isHuman = !state.players[0].isCPU

	if (isHuman) {
		playerButtonsElement.removeAttribute('hidden');
		playerButtonsElement.setAttribute('aria-hidden', false);
		cpuButtonsElement.setAttribute('hidden', true);
		cpuButtonsElement.setAttribute('aria-hidden', true);
	} else {
		cpuButtonsElement.removeAttribute('hidden');
		cpuButtonsElement.setAttribute('aria-hidden', false);
		playerButtonsElement.setAttribute('hidden', true);
		playerButtonsElement.setAttribute('aria-hidden', true);
	}
}

function _updatePlayerElements($, state) {
	state.players.forEach((player, index) => {
		const scoreElement = $(`[data-game-player-${player.id}-score-number]`);
		const choiceIconElement = $(`[data-game-player-${player.id}-choice-icon]`);
		const resultElement = $(`[data-game-player-${player.id}-result]`);
		const resultTextElement = $(`[data-game-player-${player.id}-result-text]`);

		scoreElement.innerText = player.score;

		if (player.choice) {
			const choice = player.choice
			choiceIconElement.setAttribute('src', choice.icon);
			choiceIconElement.setAttribute('alt', choice.label);
		} else {
			choiceIconElement.setAttribute('src', '/img/icons/empty.png');
			choiceIconElement.setAttribute('alt', 'No choice');
		}

		if (player.result !== ResultId.NONE) {
			resultTextElement.innerText = ResultId[player.result].toLowerCase();
			resultElement.removeAttribute('hidden');
			resultElement.setAttribute('aria-hidden', false);
		} else {
			resultTextElement.innerText = 'No results yet...';
			resultElement.setAttribute('hidden', true);
			resultElement.setAttribute('aria-hidden', true);
		}

		if (index === 0) {
			if (player.result !== ResultId.NONE) {
				if (player.isCPU) {
						const buttonLabelElement = $('[data-game-cpu-buttons-label]');
						buttonLabelElement.innerText =  'Rematch?'
				}	else {
					const buttonLabelElement = $('[data-game-player-1-buttons-label]');
					buttonLabelElement.innerText = 'Choose again?';
				}
			} else {
				if (player.isCPU) {
					const buttonLabelElement = $('[data-game-cpu-buttons-label]');
					buttonLabelElement.innerText =  'Make computers fight?'
				}	else {
					const buttonLabelElement = $('[data-game-player-1-buttons-label]');
					buttonLabelElement.innerText = 'Which hand will you choose?';
				}
			}
		}
	})
}

export function createGame(playerIsHuman = false) {
	const state = newGame(playerIsHuman)
	render(state);

	self.game = {
		replayCPUs: () => {
			setCPUChoices(state);
			calculateResults(state);
			render(state);
		},
		newGameAsHuman: () => {
			createGame(true);
		},
		newGameAsCPU: () => {
			createGame(false);
		},
		makeHumanChoice: (playerId, choiceId) => {
			makeChoice(state, playerId, choiceId);
			setCPUChoices(state);
			calculateResults(state);
			render(state);
		}
	}
}
