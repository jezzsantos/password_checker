// Letter Glitch Background Animation
class LetterGlitch {
    constructor(options = {}) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration
        this.glitchColors = options.glitchColors || ['#2b4539', '#61dca3', '#61b3dc'];
        this.glitchSpeed = options.glitchSpeed || 50;
        this.smooth = options.smooth !== undefined ? options.smooth : true;
        this.centerVignette = options.centerVignette || false;
        this.outerVignette = options.outerVignette !== undefined ? options.outerVignette : true;
        this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
        
        // Animation state
        this.letters = [];
        this.animationFrame = null;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createLetters();
        this.animate(0);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createLetters() {
        const cols = Math.floor(this.canvas.width / 20);
        const rows = Math.floor(this.canvas.height / 20);
        
        this.letters = [];
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.letters.push({
                    x: i * 20,
                    y: j * 20,
                    char: this.getRandomChar(),
                    color: this.getRandomColor(),
                    opacity: Math.random() * 0.5 + 0.1,
                    speed: Math.random() * 0.5 + 0.5,
                    nextChange: Math.random() * 1000
                });
            }
        }
    }
    
    getRandomChar() {
        return this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    }
    
    getRandomColor() {
        return this.glitchColors[Math.floor(Math.random() * this.glitchColors.length)];
    }
    
    animate(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw letters
        this.letters.forEach(letter => {
            letter.nextChange -= deltaTime;
            
            if (letter.nextChange <= 0) {
                letter.char = this.getRandomChar();
                letter.color = this.getRandomColor();
                letter.nextChange = Math.random() * (2000 / this.glitchSpeed) + (1000 / this.glitchSpeed);
                
                if (!this.smooth) {
                    letter.opacity = Math.random() * 0.5 + 0.1;
                }
            }
            
            if (this.smooth) {
                letter.opacity += (Math.random() - 0.5) * 0.02;
                letter.opacity = Math.max(0.1, Math.min(0.6, letter.opacity));
            }
            
            // Draw letter
            this.ctx.font = '12px monospace';
            this.ctx.fillStyle = letter.color;
            this.ctx.globalAlpha = letter.opacity;
            this.ctx.fillText(letter.char, letter.x, letter.y);
        });
        
        // Reset global alpha
        this.ctx.globalAlpha = 1;
        
        // Draw vignettes
        if (this.centerVignette) {
            this.drawCenterVignette();
        }
        
        if (this.outerVignette) {
            this.drawOuterVignette();
        }
        
        this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    }
    
    drawCenterVignette() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawOuterVignette() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.max(this.canvas.width, this.canvas.height) * 0.7;
        
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, radius * 0.5,
            centerX, centerY, radius
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        window.removeEventListener('resize', () => this.resize());
    }
}
