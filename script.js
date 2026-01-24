const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

let balls = []

class Ball {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.vx = 0
    this.vy = 0
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

balls.push(new Ball(canvas.width / 2, canvas.height / 2, 20, '#ff0000'))

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  balls.forEach((ball) => {
    ball.draw()
  })

  requestAnimationFrame(loop)
}

loop()
