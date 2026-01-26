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

  update() {
    balls.forEach((other) => {
      if (other !== this) {
        const dx = other.x - this.x
        const dy = other.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0) {
          const force = (0.01 * (this.radius * other.radius)) / (dist * dist)
          this.vx += force * (dx / dist)
          this.vy += force * (dy / dist)
        }
      }
    })

    this.x += this.vx
    this.y += this.vy

    this.vx *= 0.99
    this.vy *= 0.99
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
