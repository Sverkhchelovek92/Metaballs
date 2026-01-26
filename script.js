const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

let balls = []

let mouseDown = false
let draggedBall = null

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
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    const angle = Math.atan2(this.vy, this.vx)
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(angle)
    ctx.scale(1 + speed * 0.1, 1 - speed * 0.05)
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }

  update() {
    balls.forEach((other) => {
      if (other !== this) {
        const dx = other.x - this.x
        const dy = other.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < this.radius + other.radius) {
          if (this.radius > other.radius) {
            this.radius = Math.sqrt(
              this.radius * this.radius + other.radius * other.radius,
            )
            balls = balls.filter((b) => b !== other)
          }
          return
        }

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
    ball.update()
    ball.draw()
  })

  requestAnimationFrame(loop)
}

loop()

canvas.addEventListener('mousedown', (e) => {
  mouseDown = true
  const mx = e.clientX
  const my = e.clientY

  for (let ball of balls) {
    const dx = mx - ball.x
    const dy = my - ball.y
    if (Math.sqrt(dx * dx + dy * dy) < ball.radius) {
      draggedBall = ball
      return
    }
  }
  balls.push(
    new Ball(
      mx,
      my,
      Math.random() * 10 + 10,
      `hsl(${Math.random() * 360}, 80%, 50%)`,
    ),
  )
})

canvas.addEventListener('mousemove', (e) => {
  if (draggedBall) {
    draggedBall.x = e.clientX
    draggedBall.y = e.clientY
    draggedBall.vx = e.movementX
    draggedBall.vy = e.movementY
  }
})

canvas.addEventListener('mouseup', () => {
  mouseDown = false
  draggedBall = null
})
