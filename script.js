// variáveis globais
let deck_id
let cards = []
let score = 0, btn, p

// obtém um novo deck de cartas
async function getDeck() {
	// recebe uma promise
	const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')

	// converte a promise para json
	const json = await res.json()

	if (json.success === true) {
		deck_id = json.deck_id
	} else {
		alert('Falha na requisição do deck')
	}
}

// obtém n cartas de um deck
async function getCards(amount) {
	// recebe uma promise
	const res = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${amount}`)

	// converte a promise em json
	const json = await res.json()

	if (json.success === true) {
		cards = [...cards, ...json.cards]
		console.log('cards: ', cards)
		render()
	} else {
		alert('Falha na requisição dos cards')
	}
}

// faz a inicialização do deck
async function initialtDeck() {
	cards = []
	if (deck_id === undefined) {
		await getDeck()
		await getCards(2)
	} else {
		await getCards(2)
	}
}

// renderiza os dados no front-end
function render() {
	let ul = document.getElementById('card-list')
	p = document.getElementById('score')

	let htmlCards = ''
	score = 0
	for (card of cards) {
		htmlCards += `<li><img src="${card.image}"></li>`

		let value = card.value

		if ((value === 'KING') || (value === 'QUEEN') || (value === 'JACK')) {
			score += 10
		} else if (value === 'ACE') {
			score += 11
		} else {
			score += Number(card.value)
		}
	}

	ul.innerHTML = htmlCards
	p.innerHTML = `${score} pontos`
	isChampion(score)
}

// verifica se player já ganhou ou perdeu a rodada
function isChampion(score) {
	if (score > 21) {
		p.innerHTML = `Você perdeu!\nScore ${score}`
		setTimeout(function () { window.location.reload() }, 1500)
		btn = document.getElementById('btn-action')
		btn.innerHTML = 'Jogar novamente!'
	}

	if (score === 21) {
		p.innerHTML = `Você ganhou!\nScore ${score}`
		setTimeout(function () { window.location.reload() }, 1500)
		btn = document.getElementById('btn-action')
		btn.innerHTML = 'Jogar novamente!'
	}
}

// inicializa todo o game
async function start() {
	await initialtDeck()
}

start()