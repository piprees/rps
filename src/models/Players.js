import { ResultId } from "./Results";

// Opted not to use typescript, but this is an enum in vanilla JS:
export const PlayerId = {
	PLAYER_1: 1,
	1: 'PLAYER_1',
	PLAYER_2: 2,
	2: 'PLAYER_2',
}

export class Player {
	constructor(id, isCPU) {
		this.id = id;
		this.isCPU = isCPU;
		this.score = 0;

		this.color = '#000000';

		this.choice = null;
		this.result = ResultId.NONE;
	}
}
