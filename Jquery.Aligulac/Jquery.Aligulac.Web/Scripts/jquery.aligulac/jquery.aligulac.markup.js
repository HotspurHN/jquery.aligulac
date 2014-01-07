var aligulacMarkup =
{
	playerLink: "{flag-image}{race-image}{team-link}<a href='{aligulac-player-link}' class='aligulac-player-link'>{aligulac-player-name}</a>",
	playerFlag: "<img src='{aligulac-player-flag-image}' alt='{aligulac-player-flag-name}' />",
	playerRace: "<img src='{aligulac-player-race-image}' alt='{aligulac-player-race-name}' />",
	teamLink: "<a href='{aligulact-team-url}' class='aligulac-team-link'>{aligulac-team-name}</a>.",
	playerPopup:"<div class='aligulac-popup-content'>" +
		"<ul><li class='aligulac-popup-header'>{aligulac-player-name}</li>" +
		"<li><strong>Race:</strong> {race-image} {aligulac-player-race-name}</li>" +
		"<li><strong>Country:</strong> {flag-image} {aligulac-player-flag-name}</li>" +
		"<li><strong>Full name:</strong>{aligulac-player-full-name}</li>" +
		"<li><strong>Aka:</strong>{aligulac-player-akas}</li>" +
		"<li><strong>Birthday:</strong>{aligulac-player-birthday}</li>" +
		"<li><strong>Team:</strong>{aligulac-team-name}</li>" +
		"</ul></div>",
	predictMatch: "<div class='predict-match-score'><div class='col1 player1'></div>" +
		"<div class='col2 player2'></div>{score-predictions}" +
		"<div class='col1 score-summary'>{aligulac-score-summary-prediction1}%</div>" +
		"<div class='col2 score-summary'>{aligulac-score-summary-prediction2}%</div></div>",
	scorePredictionLine: "<div class='col1'>{aligulac-percent1}% {aligulac-score1}</div><div class='col2'>{aligulac-score2} {aligulac-percent2}%</div>"
}