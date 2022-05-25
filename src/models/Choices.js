// Opted not to use typescript, but this is an enum in vanilla JS:
export const ChoiceId = {
	ROCK: 1,
	1: 'ROCK',
	PAPER: 2,
	2: 'PAPER',
	SCISSORS: 3,
	3: 'SCISSORS',

	// This might be extended in the future as such:
// 	LIZARD: 4,
// 	4: 'LIZARD',
// 	SPOCK: 5,
// 	5: 'SPOCK',
}

export class Choice {
	constructor(id, label, icon, strengths) {
		this.id = id;
		this.label = label;
		this.icon = icon;

		this.strengths = strengths;
	}
}

export const choices = [
	new Choice(ChoiceId.ROCK, 'Rock', '/img/icons/rock.png', [ChoiceId.SCISSORS]),
	new Choice(ChoiceId.PAPER, 'Paper', '/img/icons/paper.png', [ChoiceId.ROCK]),
	new Choice(ChoiceId.SCISSORS, 'Scissors', '/img/icons/scissors.png', [ChoiceId.PAPER]),

	// This might be replaced in the future to add more rules, such as with Rock Paper Scissors Lizard Spock:
	// new Choice(ChoiceId.ROCK, 'Rock', '/img/icons/rock.png', [ChoiceId.LIZARD, ChoiceId.SCISSORS]),
	// new Choice(ChoiceId.PAPER, 'Paper', '/img/icons/paper.png', [ChoiceId.ROCK, ChoiceId.SPOCK]),
	// new Choice(ChoiceId.SCISSORS, 'Scissors', '/img/icons/scissors.png', [ChoiceId.PAPER, ChoiceId.LIZARD]),
	// new Choice(ChoiceId.LIZARD, 'Lizard', '/img/icons/lizard.png', [ChoiceId.SPOCK, ChoiceId.PAPER]),
	// new Choice(ChoiceId.SPOCK, 'Spock', '/img/icons/spock.png', [ChoiceId.SCISSORS, ChoiceId.ROCK]),
]
