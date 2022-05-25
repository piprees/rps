import { newGame, getChoice, getPlayer, makeChoice, makeRandomChoice, calculateResults, setCPUChoices } from '../src/js/game';
import { Choice, ChoiceId } from '../src/models/Choices';
import {  PlayerId } from '../src/models/Players';
import { ResultId } from '../src/models/Results';

describe('newGame()', () => {
	it('should return a new game state with no human players', () => {
		const result = newGame();

		expect(result.players[0].isCPU).toBe(true);
	})

	it('should return a new game state with a human player', () => {
		const result = newGame(true);

		expect(result.players[0].isCPU).toBe(false);
	})
})

describe('getPlayer()', () => {
	let state = null;

	beforeEach(() => {
		state = newGame();
	})

	afterEach(() => {
		state = null;
	})

	it('should return a player', () => {
		const result = getPlayer(state, PlayerId.PLAYER_1)
		expect(result.id).toBe(PlayerId.PLAYER_1)
	})

	it('should return other players', () => {
		const result = getPlayer(state, PlayerId.PLAYER_2)
		expect(result.id).toBe(PlayerId.PLAYER_2)
	})

	it('should return null if no player is found', () => {
		const result = getPlayer(state, 0);
		expect(result).toBe(null)
	})
})

describe('getChoice()', () => {
	it('should return a choice', () => {
		const result = getChoice(ChoiceId.ROCK)
		expect(result.id).toBe(ChoiceId.ROCK)
	})

	it('should return other players', () => {
		const result = getChoice(ChoiceId.PAPER)
		expect(result.id).toBe(ChoiceId.PAPER)
	})

	it('should return null if no choice is found', () => {
		const result = getChoice(0);
		expect(result).toBe(null)
	})
})

describe('makeChoice()', () => {
	let state = null;

	beforeEach(() => {
		state = newGame();
	});

	afterEach(() => {
		state = null;
	});

	it('should not already have a choice', () => {
		const result = state.players[0].choice;
		expect(result).toBe(null);
	});

	it('should set the choice on the player', () => {
		makeChoice(state, PlayerId.PLAYER_1, ChoiceId.PAPER)

		const result = state.players[0].choice;
		expect(result.id).toBe(ChoiceId.PAPER);
	});

	it('should set the choice on another player', () => {
		makeChoice(state, PlayerId.PLAYER_2, ChoiceId.ROCK)

		const result = state.players[1].choice;
		expect(result.id).toBe(ChoiceId.ROCK);
	});


	it('should throw an error when the player is not found', () => {
		const result = () => {
			makeChoice(state, 0, ChoiceId.ROCK)
		};
		expect(result).toThrow();
	});

	it('should throw an error when the choice is not found', () => {
		const result = () => {
			makeChoice(state, PlayerId.PLAYER_1, -1)
		}
		expect(result).toThrow();
	});

});

describe('makeRandomChoice()', () => {
	let state = null;

	beforeEach(() => {
		state = newGame();
	})

	afterEach(() => {
		state = null;
	})

	it('should not already have a choice', () => {
		const result = state.players[1].choice;
		expect(result).toBe(null);
	})

	it('should set a random choice on the player', () => {
		const initialResult = state.players[0].choice;
		expect(initialResult).not.toBeInstanceOf(Choice);

		makeRandomChoice(state, PlayerId.PLAYER_1)

		const result = state.players[0].choice;
		expect(result).toBeInstanceOf(Choice)
	})

	it('should set a random choice on another player', () => {
		const initialResult = state.players[1].choice;
		expect(initialResult).not.toBeInstanceOf(Choice);

		makeRandomChoice(state, PlayerId.PLAYER_2)

		const result = state.players[1].choice;
		expect(result).toBeInstanceOf(Choice)
	})

	it('should throw an error when the player is not found', () => {
		const result = () => {
			makeRandomChoice(state, 0)
		};
		expect(result).toThrow();
	});
});

describe('calculateResults()', () => {
	let state = null;

	beforeEach(() => {
		state = newGame();
		makeChoice(state, PlayerId.PLAYER_1, ChoiceId.ROCK);
		makeChoice(state, PlayerId.PLAYER_2, ChoiceId.PAPER);
	})

	afterEach(() => {
		state = null;
	})

	it('should not already have a result', () => {
		const resultP1 = state.players[0].result;
		const resultP2 = state.players[1].result;
		expect(resultP1).toBe(0);
		expect(resultP2).toBe(0);
	})

	it('should not already have a score', () => {
		const resultP1 = state.players[0].score;
		const resultP2 = state.players[1].score;
		expect(resultP1).toBe(0);
		expect(resultP2).toBe(0);
	})

	it('should set the result status on the players', () => {
		calculateResults(state);

		const resultP1 = state.players[0].result;
		const resultP2 = state.players[1].result;
		expect(resultP1).toBe(ResultId.LOSE);
		expect(resultP2).toBe(ResultId.WIN);
	})

	it('should set the score on the players', () => {
		calculateResults(state);

		const expectedP1Score = 0;
		const expectedP2Score = 1;

		const resultP1 = state.players[0].score;
		const resultP2 = state.players[1].score;

		expect(resultP1).toBe(expectedP1Score);
		expect(resultP2).toBe(expectedP2Score);
	})
});

describe('setCPUChoices()', () => {
	let state = null;

	beforeEach(() => {
		state = newGame();
	})

	afterEach(() => {
		state = null;
	})


	it('should not already have a choice', () => {
		const resultP1 = state.players[0].choice;
		const resultP2 = state.players[1].choice;
		expect(resultP1).toBe(null);
		expect(resultP2).toBe(null);
	})


	it('should set a choice for each cpu player', () => {
		setCPUChoices(state);

		const resultP1 = state.players[0].choice;
		const resultP2 = state.players[1].choice;

		expect(resultP1).toBeInstanceOf(Choice);
		expect(resultP2).toBeInstanceOf(Choice);
	})
})
