const readline = require('readline')

let health = 3;
let points = 0;
let spawnSpeed = 3000;
let fallSpeed = 300;

const map = {
	width: 16,
	height: 32
}

const basket = [
	{ x: 4, y: 30 },
	{ x: 5, y: 30 },
	{ x: 6, y: 30 },
	{ x: 7, y: 30 },
	{ x: 8, y: 30 }
]

const fruits = []
const availableFruits = [
	{
		fruit: '🍎',
		points: 10,
	},
	{
		fruit: '🍓',
		points: 15,
	},
	{
		fruit: '🍌',
		points: 20,
	},
	{
		fruit: '💎',
		points: 100,
	}
]

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const draw = () => {
	for(let y = 0; y <= map.height; y++) {
		let line = ""
		for(let x = 0; x <= map.width; x++) {
			let fruit = ''
			fruits.forEach(f => {
				if(f.x == x && f.y == y && !f.eaten) {
					fruit = f.fruit
				}
			})

			if(fruit != '') {
				line += fruit
			}
			else if(basket.find(b => b.x == x && b.y == y)) {
				line += '🟥'
			} else {
				line += '⬛'
			}
		}
		console.log(line)
	}
	console.log('❤️  ' + health)
	console.log('➕ ' + points)
}

const spawnFruit = () => {
	let newFruit = availableFruits[random(0, availableFruits.length - 1)]

	fruits.push({
		x: random(0, map.width),
		y: 0,
		points: newFruit.points,
		fruit: newFruit.fruit,
		eaten: false
	})

	if(spawnSpeed > 333) {
		spawnSpeed -= 5
	}
	setTimeout(spawnFruit, spawnSpeed)
}

const fall = () => {
	fruits.forEach(f => {
		f.y++
	})

	if(fallSpeed > 100) {
		fallSpeed -= 5
	}
	setTimeout(fall, fallSpeed)
}

const die = () => {
	console.clear()
	console.log('☠️ YOU DIED ☠️')
	console.log('POINTS: ' + points)

	process.exit()
}

const update = () => {
	console.clear()
	fruits.forEach(f => {
		if(f.y > map.height && !f.eaten) {
			health--
			f.eaten = true
		}

		basket.forEach(b => {
			if(!f.eaten && b.x == f.x && b.y == f.y) {
				points += f.points
				f.eaten = true
			}
		})
	})

	if(health <= 0) {
		die()
	}
	draw()
}

const moveRight = () => {
	if(basket.find(b => b.x == map.width))
		return;

	basket.forEach(b => {
		b.x++
	})
}

const moveLeft = () => {
	if(basket.find(b => b.x == 0))
		return;

	basket.forEach(b => {
		b.x--
	})
}

const main = () => {
	readline.emitKeypressEvents(process.stdin);

	if (process.stdin.isTTY)
			process.stdin.setRawMode(true);

	process.stdin.on('keypress', (chunk, key) => {
		if(key.name == 'q') {
			process.exit()
		}
		else if(key.name == 'right') {
			moveRight()
		}
		else if(key.name == 'left') {
			moveLeft()
		}
		
	});

	setInterval(update, 50)
	spawnFruit()
	fall()
}

main()