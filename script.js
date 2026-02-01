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

let mouseX = canvas.width / 2
let mouseY = canvas.height / 2

let attraction = 0.002
let friction = 0.99

class Ball {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.vx = 0
    this.vy = 0
    this.alive = true
  }

  draw() {
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    const angle = Math.atan2(this.vy, this.vx)

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(angle)
    ctx.scale(1 + speed * 0.1, 1 - speed * 0.05)

    // Shadow
    ctx.shadowBlur = this.radius * 0.1 + 10
    ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.6)`
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
    ctx.fill()
    ctx.restore()
  }

  update() {
    const dxm = mouseX - this.x
    const dym = mouseY - this.y
    const distm = Math.sqrt(dxm * dxm + dym * dym)

    if (distm > 1) {
      const force = (attraction * this.radius * this.radius) / (distm * distm)
      this.vx += force * (dxm / distm)
      this.vy += force * (dym / distm)
    }

    balls.forEach((other) => {
      if (other !== this) {
        const dx = other.x - this.x
        const dy = other.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < this.radius + other.radius) {
          if (this.radius > other.radius && other.alive) {
            const r1 = this.radius
            const r2 = other.radius

            const a1 = r1 * r1
            const a2 = r2 * r2

            this.color = mixColors(this.color, other.color, a1, a2)
            this.radius = Math.sqrt(a1 + a2)

            other.alive = false
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

    if (this.x < this.radius) {
      this.x = this.radius
      this.vx = -this.vx * 0.8
    } else if (this.x > canvas.width - this.radius) {
      this.x = canvas.width - this.radius
      this.vx = -this.vx * 0.8
    }

    if (this.y < this.radius) {
      this.y = this.radius
      this.vy = -this.vy * 0.8
    } else if (this.y > canvas.height - this.radius) {
      this.y = canvas.height - this.radius
      this.vy = -this.vy * 0.8
    }

    this.vx *= friction
    this.vy *= friction
  }
}

function mixColors(c1, c2, a1, a2) {
  const total = a1 + a2

  return {
    r: Math.round((c1.r * a1 + c2.r * a2) / total),
    g: Math.round((c1.g * a1 + c2.g * a2) / total),
    b: Math.round((c1.b * a1 + c2.b * a2) / total),
  }
}

function randomColor() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

balls.push(new Ball(canvas.width / 2, canvas.height / 2, 20, randomColor()))

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // ctx.clearRect(0, 0, canvas.width, canvas.height)

  balls.forEach((ball) => ball.update())

  balls = balls.filter((ball) => ball.alive)

  balls.forEach((ball) => ball.draw())

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
  balls.push(new Ball(mx, my, Math.random() * 10 + 10, randomColor()))
})

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top

  if (draggedBall) {
    draggedBall.x = e.clientX
    draggedBall.y = e.clientY
    draggedBall.vx = e.movementX
    draggedBall.vy = e.movementY
  }

  const x = e.clientX
  const y = e.clientY

  const nearLeft = x < TRIGGER_SIZE
  const nearBottom = y > window.innerHeight - TRIGGER_SIZE

  if (nearLeft && nearBottom) {
    panel.classList.add('visible')
  } else {
    panel.classList.remove('visible')
  }
})

canvas.addEventListener('mouseup', () => {
  mouseDown = false
  draggedBall = null
})

// UI
const panel = document.getElementById('control-panel')

const TRIGGER_SIZE = 80

const attractionSlider = document.getElementById('attraction-slider')
const frictionSlider = document.getElementById('friction-slider')

attractionStrength = parseFloat(attractionSlider.value)
friction = parseFloat(frictionSlider.value)

attractionSlider.addEventListener('input', (e) => {
  attraction = parseFloat(e.target.value)
})

frictionSlider.addEventListener('input', (e) => {
  friction = parseFloat(e.target.value)
})
