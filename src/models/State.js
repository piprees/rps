import { Player, PlayerId } from './Players';

export class State {
	constructor(playerIsHuman = false) {
		this.initialized = false;

		this.players = [
			new Player(PlayerId.PLAYER_1, !playerIsHuman),
			new Player(PlayerId.PLAYER_2, true),
		]
	}
}
