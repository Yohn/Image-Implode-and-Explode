class ImgPiecer {
  constructor(container, options = {}) {
    this.container = container;
    this.options = Object.assign({
      imageUrl: '',
      rows: 5,
      columns: 5,
      animationDuration: 1,
      direction: 'top',
      initialOpacity: 0,
      spin: false,
    }, options);

    this.imageUrl = this.options.imageUrl;
    this.rows = this.options.rows;
    this.columns = this.options.columns;
    this.animationDuration = this.options.animationDuration;
    this.direction = this.options.direction;
    this.initialOpacity = this.options.initialOpacity;
    this.spin = this.options.spin;

    // Animation state tracking
    this.isAnimating = false;
    this.hadScrollbars = false;

    this.image = new Image();
    this.image.src = this.imageUrl;
    this.pieces = [];

    // Wait for the image to load before proceeding
    this.image.onload = this.init.bind(this);
  }

  startAnimation() {
    // Only check for vertical scrollbar
    const hasVerticalScroll = window.innerHeight < document.documentElement.scrollHeight;
    this.hadScrollbars = hasVerticalScroll;

    // Only hide scrollbars if they weren't already visible
    if (!this.hadScrollbars) {
      document.body.classList.add('animating');
    }
    this.isAnimating = true;
  }

  endAnimation() {
    // Only remove the class if we added it (no scrollbars were present)
    if (!this.hadScrollbars) {
      document.body.classList.remove('animating');
    }
    this.isAnimating = false;
  }

  init() {
    this.startAnimation();
    const imageWidth = this.image.width;
    const imageHeight = this.image.height;

    // Set container size
    this.container.style.width = `${imageWidth}px`;
    this.container.style.height = `${imageHeight}px`;
    this.container.style.position = 'relative';

    // Create pieces
    this.createPieces();

    // Trigger appropriate animation
    setTimeout(() => {
      if (this.direction === 'explode') {
        this.explode();
      } else if (this.direction === 'implode') {
        this.implode();
      } else if (this.direction === 'spiral') {
        this.spiral();
      } else if (this.direction === 'wave') {
        this.wave();
      } else if (this.direction === 'grow-in') {
        this.growIn();
      } else if (this.direction === 'grow-out') {
        this.growOut();
      } else if (this.direction === 'domino') {
        this.domino();
      } else if (this.direction === 'vortex') {
        this.vortex();
      } else if (this.direction === 'shutter') {
        this.shutter();
      } else if (this.direction === 'hypno') {
        this.hypno();
      } else if (this.direction.startsWith('curtain-')) {
        this.curtain();
      } else if (['left', 'right', 'top', 'bottom'].includes(this.direction)) {
        this.scatter();
      } else {
        // Handle default animation
        this.pieces.forEach(piece => {
          piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
          piece.style.opacity = '1';
          piece.style.transform = 'scale(1)';
          piece.style.top = piece.dataset.finalY + 'px';
          piece.style.left = piece.dataset.finalX + 'px';
        });
      }
    }, 100);
  }

  createPieces() {
    const imageWidth = this.image.width;
    const imageHeight = this.image.height;
    
    this.pieces = [];
    let pieceIndex = 0;

    // Create pieces and position them
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const piece = document.createElement('div');
        piece.classList.add('image-piece');
        
        const pieceWidth = imageWidth / this.columns;
        const pieceHeight = imageHeight / this.rows;

        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        piece.style.backgroundImage = `url(${this.imageUrl})`;
        piece.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
        piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;

        // Initial setup
        piece.style.position = 'absolute';
        piece.style.transform = 'scale(0.5)';
        
        // Set initial position and opacity based on direction
        switch (this.direction) {
          case 'explode':
            // For explode, start fully visible at original position
            piece.style.opacity = '1';
            piece.style.transform = 'scale(1)';
            piece.style.top = `${row * pieceHeight}px`;
            piece.style.left = `${col * pieceWidth}px`;
            piece.dataset.originalTop = `${row * pieceHeight}`;
            piece.dataset.originalLeft = `${col * pieceWidth}`;
            break;
          case 'curtain-left':
            piece.style.opacity = `${this.initialOpacity}`;
            piece.style.left = `${-pieceWidth}px`;
            piece.style.top = `${row * pieceHeight}px`;
            break;
          case 'curtain-right':
            piece.style.opacity = `${this.initialOpacity}`;
            piece.style.left = `${imageWidth}px`;
            piece.style.top = `${row * pieceHeight}px`;
            break;
          case 'curtain-top':
            piece.style.opacity = `${this.initialOpacity}`;
            piece.style.top = `${-pieceHeight}px`;
            piece.style.left = `${col * pieceWidth}px`;
            break;
          case 'curtain-bottom':
            piece.style.opacity = `${this.initialOpacity}`;
            piece.style.top = `${imageHeight}px`;
            piece.style.left = `${col * pieceWidth}px`;
            break;
          default:
            piece.style.opacity = `${this.initialOpacity}`;
            // Default positioning for other animations
            piece.style.top = `${-pieceHeight}px`;
            piece.style.left = `${Math.random() * imageWidth}px`;
            break;
        }

        // Store final positions for all pieces
        piece.dataset.finalX = `${col * pieceWidth}`;
        piece.dataset.finalY = `${row * pieceHeight}`;

        this.container.appendChild(piece);
        this.pieces.push(piece);
        pieceIndex++;
      }
    }
  }

  implode() {
    const distance = Math.max(window.innerWidth, window.innerHeight);
    
    // Group pieces by direction
    const directionGroups = Array(8).fill().map(() => []);
    
    // Distribute pieces across directions
    this.pieces.forEach(piece => {
      const direction = Math.floor(Math.random() * 8);
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      let startX = finalX;
      let startY = finalY;

      switch(direction) {
        case 0: // North
          startY = -distance;
          startX = finalX;
          break;
        case 1: // Northeast
          startX = distance;
          startY = -distance;
          break;
        case 2: // East
          startX = distance;
          startY = finalY;
          break;
        case 3: // Southeast
          startX = distance;
          startY = distance;
          break;
        case 4: // South
          startX = finalX;
          startY = distance;
          break;
        case 5: // Southwest
          startX = -distance;
          startY = distance;
          break;
        case 6: // West
          startX = -distance;
          startY = finalY;
          break;
        case 7: // Northwest
          startX = -distance;
          startY = -distance;
          break;
      }

      // Add slight randomness to avoid pieces following exact same path
      startX += Math.random() * 100 - 50;
      startY += Math.random() * 100 - 50;

      piece.style.left = `${startX}px`;
      piece.style.top = `${startY}px`;
      
      directionGroups[direction].push(piece);
    });

    // Animate all pieces in each direction group together
    directionGroups.forEach((group, directionIndex) => {
      setTimeout(() => {
        group.forEach(piece => {
          piece.style.transition = `all ${this.animationDuration * 0.8}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
          piece.style.transform = 'scale(1) rotate(0deg)';
          piece.style.opacity = '1'; 
          piece.style.top = `${piece.dataset.finalY}px`;
          piece.style.left = `${piece.dataset.finalX}px`;
        });
      }, directionIndex * 50); 
    });

    // End animation after max duration
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + (directionGroups.length * 50));
  }

  explode() {
    const distance = Math.max(window.innerWidth, window.innerHeight);
    const centerX = this.container.offsetWidth / 2;
    const centerY = this.container.offsetHeight / 2;
    
    this.pieces.forEach(piece => {
      // Calculate piece's center position
      const pieceWidth = piece.offsetWidth;
      const pieceHeight = piece.offsetHeight;
      const startX = parseFloat(piece.dataset.originalLeft) + pieceWidth / 2;
      const startY = parseFloat(piece.dataset.originalTop) + pieceHeight / 2;
      
      // Calculate angle from center to piece
      const angle = Math.atan2(startY - centerY, startX - centerX);
      
      // Add some randomness to the angle
      const randomAngle = angle + (Math.random() * 0.5 - 0.25);
      
      // Calculate end position using the angle
      const endX = startX + Math.cos(randomAngle) * distance;
      const endY = startY + Math.sin(randomAngle) * distance;
      
      // Set initial position
      piece.style.left = `${startX - pieceWidth / 2}px`;
      piece.style.top = `${startY - pieceHeight / 2}px`;
      piece.style.opacity = '1';
      piece.style.transform = 'scale(1)';
      
      // Start explosion animation
      requestAnimationFrame(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
        piece.style.transform = `scale(0.5) rotate(${Math.random() * 720 - 360}deg)`;
        piece.style.opacity = '0';
        piece.style.left = `${endX - pieceWidth / 2}px`;
        piece.style.top = `${endY - pieceHeight / 2}px`;
      });
    });

    // End animation after duration
    setTimeout(() => this.endAnimation(), this.animationDuration * 1000);
  }

  scatter() {
    const distance = Math.max(window.innerWidth, window.innerHeight);
    const shuffledPieces = [...this.pieces].sort(() => Math.random() - 0.5);
    
    // Set initial positions based on direction
    shuffledPieces.forEach(piece => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      // Random offset for scattered effect
      const randomOffset = Math.random() * 100 - 50;
      
      // Random rotation direction (1 for clockwise, -1 for counterclockwise)
      const rotationDir = Math.random() < 0.5 ? 1 : -1;
      
      // Set initial rotation if spinning is enabled
      if (this.spin) {
        piece.style.transform = `scale(0.5) rotate(${rotationDir * (720 + Math.random() * 360)}deg)`;
      }
      
      switch(this.direction) {
        case 'left':
          piece.style.left = `${-distance}px`;
          piece.style.top = `${finalY + randomOffset}px`;
          break;
        case 'right':
          piece.style.left = `${distance}px`;
          piece.style.top = `${finalY + randomOffset}px`;
          break;
        case 'top':
          piece.style.top = `${-distance}px`;
          piece.style.left = `${finalX + randomOffset}px`;
          break;
        case 'bottom':
          piece.style.top = `${window.innerHeight + distance}px`;
          piece.style.left = `${finalX + randomOffset}px`;
          break;
      }
      
      // Animate to final position
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        piece.style.transform = 'scale(1) rotate(0deg)';
        piece.style.opacity = '1'; 
        piece.style.top = `${finalY}px`;
        piece.style.left = `${finalX}px`;
      }, Math.random() * 300); 
    });

    // End animation after max duration
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + 300);
  }

  spiral() {
    // Create a grid-based spiral order
    const order = [];
    let top = 0;
    let bottom = this.rows - 1;
    let left = 0;
    let right = this.columns - 1;
    
    while (top <= bottom && left <= right) {
      // Top row
      for (let i = left; i <= right; i++) {
        order.push([top, i]);
      }
      top++;
      
      // Right column
      for (let i = top; i <= bottom; i++) {
        order.push([i, right]);
      }
      right--;
      
      if (top <= bottom) {
        // Bottom row
        for (let i = right; i >= left; i--) {
          order.push([bottom, i]);
        }
        bottom--;
      }
      
      if (left <= right) {
        // Left column
        for (let i = bottom; i >= top; i--) {
          order.push([i, left]);
        }
        left++;
      }
    }
    
    // Phase 1: Create spiral pattern
    const spiralSpacing = 50;
    const spiralCenterX = this.container.offsetWidth / 2;
    const spiralCenterY = this.container.offsetHeight / 2;
    
    // Map grid positions to pieces and animate to spiral pattern
    order.forEach(([row, col], index) => {
      const piece = this.pieces[row * this.columns + col];
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      // Calculate spiral position
      const angle = (index / order.length) * Math.PI * 2;
      const radius = spiralSpacing * (order.length - index) / order.length;
      const spiralX = spiralCenterX + radius * Math.cos(angle);
      const spiralY = spiralCenterY + radius * Math.sin(angle);
      
      // Start from outside the container
      piece.style.left = `${this.container.offsetWidth}px`;
      piece.style.top = `${-piece.offsetHeight}px`;
      piece.style.opacity = '0';
      piece.style.zIndex = this.pieces.length - index;
      piece.style.transform = 'scale(0.5)';
      
      // First phase: Move to spiral position
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration * 0.5}s cubic-bezier(0.4, 0, 0.2, 1)`;
        piece.style.opacity = '1';
        piece.style.left = `${spiralX}px`;
        piece.style.top = `${spiralY}px`;
      }, index * 50);
    });
    
    // Phase 2: Move all pieces to final positions
    const phase1Duration = (order.length * 50) + (this.animationDuration * 0.5 * 1000);
    
    setTimeout(() => {
      this.pieces.forEach(piece => {
        const finalX = parseInt(piece.dataset.finalX);
        const finalY = parseInt(piece.dataset.finalY);
        
        piece.style.transition = `all ${this.animationDuration * 0.3}s cubic-bezier(0.4, 0, 0.2, 1)`;
        piece.style.left = `${finalX}px`;
        piece.style.top = `${finalY}px`;
      });
    }, phase1Duration);

    // Phase 3: Final expansion
    const phase2Duration = phase1Duration + (this.animationDuration * 0.3 * 1000);
    
    setTimeout(() => {
      this.pieces.forEach(piece => {
        piece.style.transition = `all ${this.animationDuration * 0.2}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
        piece.style.transform = 'scale(1)';
      });
    }, phase2Duration);
    
    // End animation after all phases
    setTimeout(() => this.endAnimation(), 
      phase2Duration + (this.animationDuration * 0.2 * 1000));
  }

  wave() {
    const amplitude = this.container.offsetHeight * 0.3; // 30% of container height
    const frequency = 2; // Number of waves across the width
    const speed = 100; // Speed of wave propagation
    
    // Sort pieces by column for wave effect
    const sortedPieces = [...this.pieces].sort((a, b) => {
      const aX = parseInt(a.dataset.finalX);
      const bX = parseInt(b.dataset.finalX);
      return aX - bX;
    });

    // Group pieces by column
    const columns = {};
    sortedPieces.forEach(piece => {
      const x = parseInt(piece.dataset.finalX);
      if (!columns[x]) columns[x] = [];
      columns[x].push(piece);
    });

    // Sort pieces within each column by Y position
    Object.values(columns).forEach(column => {
      column.sort((a, b) => {
        const aY = parseInt(a.dataset.finalY);
        const bY = parseInt(b.dataset.finalY);
        return aY - bY;
      });
    });

    // Animate each column with a delay
    Object.entries(columns).forEach(([x, column], columnIndex) => {
      const columnDelay = columnIndex * speed;
      
      column.forEach((piece, rowIndex) => {
        const finalX = parseInt(piece.dataset.finalX);
        const finalY = parseInt(piece.dataset.finalY);
        
        // Calculate wave offset based on column position
        const waveProgress = (finalX / this.container.offsetWidth) * Math.PI * 2 * frequency;
        const yOffset = Math.sin(waveProgress) * amplitude;
        
        // Start position above the final position
        piece.style.left = `${finalX}px`;
        piece.style.top = `${finalY - amplitude * 2}px`;
        piece.style.opacity = '0';
        piece.style.transform = 'scale(0.8)';
        
        // Animate with wave motion
        setTimeout(() => {
          // Create keyframes for wave motion
          const keyframes = [];
          const steps = 20;
          
          for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const wave = Math.sin(progress * Math.PI) * yOffset;
            const scale = 0.8 + (0.2 * progress);
            const opacity = Math.min(1, progress * 2);
            
            keyframes.push({
              offset: progress,
              transform: `scale(${scale})`,
              top: `${finalY + wave * (1 - progress)}px`,
              opacity: opacity
            });
          }
          
          piece.animate(keyframes, {
            duration: this.animationDuration * 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
          });
        }, columnDelay + (rowIndex * 50));
      });
    });

    // End animation after all columns are done
    const totalColumns = Object.keys(columns).length;
    const maxRowLength = Math.max(...Object.values(columns).map(col => col.length));
    const totalDuration = (totalColumns * speed) + (maxRowLength * 50) + (this.animationDuration * 1000);
    
    setTimeout(() => this.endAnimation(), totalDuration);
  }

  growIn() {
    this.pieces.forEach((piece, index) => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      // Ensure pieces are positioned exactly where they should end up
      piece.style.transformOrigin = 'center center';
      piece.style.left = `${finalX}px`;
      piece.style.top = `${finalY}px`;
      piece.style.transform = 'scale(0.1)';
      piece.style.opacity = `${this.initialOpacity}`;
      
      // Animate with growth
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
        piece.style.transform = 'scale(1)';
        piece.style.opacity = '1';
      }, index * 40);
    });
    
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + (this.pieces.length * 40));
  }

  growOut() {
    this.pieces.forEach((piece, index) => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      // Ensure pieces are positioned exactly where they should end up
      piece.style.transformOrigin = 'center center';
      piece.style.left = `${finalX}px`;
      piece.style.top = `${finalY}px`;
      piece.style.transform = 'scale(3)';
      piece.style.opacity = `${this.initialOpacity}`;
      
      // Animate with smooth shrink
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
        piece.style.transform = 'scale(1)';
        piece.style.opacity = '1';
      }, index * 40);
    });
    
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + (this.pieces.length * 40));
  }

  domino() {
    // Create diagonal waves of pieces appearing
    this.pieces.forEach((piece, index) => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      // Calculate diagonal distance for timing
      const row = Math.floor(index / this.columns);
      const col = index % this.columns;
      const diagonalSum = row + col;
      
      piece.style.transformOrigin = 'center center';
      piece.style.left = `${finalX}px`;
      piece.style.top = `${finalY}px`;
      piece.style.transform = 'scale(0.1) rotate(45deg)';
      piece.style.opacity = `${this.initialOpacity}`;
      
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
        piece.style.transform = 'scale(1) rotate(0deg)';
        piece.style.opacity = '1';
      }, diagonalSum * 100); // Delay based on diagonal position
    });
    
    const maxDelay = (this.rows + this.columns - 1) * 100;
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + maxDelay);
  }

  vortex() {
    const centerX = this.container.offsetWidth / 2;
    const centerY = this.container.offsetHeight / 2;
    
    this.pieces.forEach((piece, index) => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      // Calculate initial spiral position
      const angle = (index / this.pieces.length) * Math.PI * 4; // Two full rotations
      const radius = 150 + (index * 3); // Increasing radius for spiral
      const startX = centerX + radius * Math.cos(angle);
      const startY = centerY + radius * Math.sin(angle);
      
      piece.style.transformOrigin = 'center center';
      piece.style.left = `${startX}px`;
      piece.style.top = `${startY}px`;
      piece.style.transform = 'rotate(720deg) scale(0.3)';
      piece.style.opacity = `${this.initialOpacity}`;
      
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
        piece.style.left = `${finalX}px`;
        piece.style.top = `${finalY}px`;
        piece.style.transform = 'rotate(0deg) scale(1)';
        piece.style.opacity = '1';
      }, index * 30);
    });
    
    const maxDistance = Math.sqrt(Math.pow(this.container.offsetWidth, 2) + Math.pow(this.container.offsetHeight, 2));
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + maxDistance * 2);
  }

  shutter() {
    this.pieces.forEach((piece, index) => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      const col = index % this.columns;
      
      // Alternate between coming from top and bottom
      const startY = col % 2 === 0 ? -100 : this.container.offsetHeight + 100;
      
      piece.style.left = `${finalX}px`;
      piece.style.top = `${startY}px`;
      piece.style.transform = 'rotateX(90deg)';
      piece.style.opacity = `${this.initialOpacity}`;
      
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        piece.style.top = `${finalY}px`;
        piece.style.transform = 'rotateX(0deg)';
        piece.style.opacity = '1';
      }, col * 100);
    });
    
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + this.columns * 100);
  }

  hypno() {
    const centerX = this.container.offsetWidth / 2;
    const centerY = this.container.offsetHeight * 0.5; // Move center point lower
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;
    
    // Reverse the pieces array so the first piece leads
    const orderedPieces = [...this.pieces].reverse();
    
    // Group pieces by their target columns
    const piecesByColumn = {};
    orderedPieces.forEach(piece => {
      const finalX = parseInt(piece.dataset.finalX);
      if (!piecesByColumn[finalX]) {
        piecesByColumn[finalX] = [];
      }
      piecesByColumn[finalX].push(piece);
    });

    // Sort columns from right to left instead of left to right
    const sortedColumns = Object.keys(piecesByColumn).sort((a, b) => parseInt(b) - parseInt(a));
    
    // Find the height range of all pieces
    let minY = Infinity, maxY = -Infinity;
    orderedPieces.forEach(piece => {
      const y = parseInt(piece.dataset.finalY);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
    const totalHeight = maxY - minY;
    
    // Find the piece dimensions for position adjustments
    const pieceWidth = this.pieces[0].offsetWidth;
    const pieceHeight = this.pieces[0].offsetHeight;
    
    orderedPieces.forEach((piece, index) => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      // Find which column this piece belongs to
      const columnIndex = sortedColumns.indexOf(finalX.toString());
      const columnProgress = columnIndex / (sortedColumns.length - 1); // 0 to 1
      
      // Calculate relative position in the grid
      const relativeY = (finalY - minY) / totalHeight; // 0 to 1, where 0 is top row
      
      // Adjust position for the last piece
      let adjustedFinalX = finalX;
      let adjustedFinalY = finalY;
      if (index === orderedPieces.length - 1) {
        adjustedFinalX += pieceWidth * 0.5;  // Move half a piece width right
      }
      
      // Start from top-right, above container
      // Move pieces much higher up, off screen
      const startY = -containerHeight - (relativeY * containerHeight * 0.5);
      // Start further left
      const startX = containerWidth * 0.8 - (containerWidth * 0.2 * columnIndex);
      
      piece.style.perspective = '1000px';
      piece.style.transformStyle = 'preserve-3d';
      piece.style.transformOrigin = 'center center';
      piece.style.left = `${startX}px`;
      piece.style.top = `${startY}px`;
      // Add initial shadow
      piece.style.filter = 'drop-shadow(0 0 10px rgba(0,0,0,0.3))';
      
      // Much bigger scale at start, gradually decreasing
      const startScale = Math.max(15 - (index * 0.3), 1);
      
      // Initial transform: scaled up with minimal tilt
      piece.style.transform = `translate(${startX - adjustedFinalX}px, ${startY}px) scale(${startScale}) translateZ(300px) rotateX(15deg)`;
      piece.style.opacity = '0'; // Start invisible
      piece.style.zIndex = index; // Leading piece (index 0) stays on top
      
      // Create keyframes for circular motion
      const keyframes = [];
      // Adjust circles based on column position
      const numCircles = Math.max(2 - (columnProgress * 0.6), 0.8);
      
      // Add keyframes for circular motion
      const steps = 20; // More steps for smoother animation
      for(let i = 0; i <= steps; i++) {
        const progress = i / steps;
        // More complex radius calculation for snake-like motion
        const radiusProgress = Math.sin(progress * Math.PI * 1.5);
        // Narrower radius and shifted left
        const baseRadius = containerWidth * (0.7 - columnProgress * 0.25);
        const radius = baseRadius * (1 - progress * 0.7) * (1 + radiusProgress * 0.3);
        
        // Add wagging motion
        const wag = -Math.sin(progress * Math.PI * 2) * (1 - progress) * (containerWidth * (0.5 - columnProgress * 0.2));
        const angle = progress * Math.PI * 2 * numCircles;
        
        // Calculate vertical motion with gentler lifting
        const verticalLift = Math.sin(progress * Math.PI) * containerHeight * 0.15 * (1 - relativeY * 0.7);
        const verticalOffset = progress < 0.3 ? 
          Math.sin(progress * Math.PI * 2) * containerHeight * 0.1 :
          Math.cos(progress * Math.PI * 2) * containerHeight * 0.05;
        
        // Adjust circular motion based on target column
        // Adjust sweep direction for reversed columns
        // Shift target position left
        const targetX = adjustedFinalX - containerWidth * 0.2 + (containerWidth * 0.3 * (1 - columnProgress));
        const x = targetX + radius * Math.cos(angle) + wag;
        // More direct path to final Y position
        const y = adjustedFinalY * (progress ** 1.2) + startY * (1 - progress ** 1.2) + 
                 radius * Math.sin(angle) * 0.5 + 
                 verticalLift + verticalOffset;
        
        const scale = startScale - (progress * (startScale - 1));
        // Stay further back longer
        const z = 400 - (progress ** 1.5 * 400);
        
        // Much gentler head lifting rotation
        const headLift = progress < 0.3 ? 
          15 - progress * 45 :
          -15 + (progress - 0.3) * 15;
        // Smoother tilt motion
        const tilt = -Math.cos(angle) * 15 * (1 - progress ** 1.2) + headLift;
        
        // Calculate shadow based on progress
        const shadowBlur = Math.max(10 * (1 - progress), 0);
        const shadowOpacity = Math.max(0.3 * (1 - progress), 0);
        
        keyframes.push({
          offset: progress,
          transform: `translate(${x - adjustedFinalX}px, ${y}px) scale(${scale}) translateZ(${z}px) rotate(${angle * 180 / Math.PI}deg) rotateX(${headLift}deg) rotateY(${tilt}deg)`,
          filter: `drop-shadow(0 0 ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`,
          opacity: Math.min(1, progress * 2) // Slower fade in during first half of animation
        });
      }
      
      // Add final position
      keyframes.push({
        offset: 1,
        transform: 'scale(1) translateZ(0) rotate(0deg) rotateX(0deg) rotateY(0deg)',
        filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))',
        opacity: 1
      });
      
      // Calculate more dramatic staggered delay
      const baseDelay = index * 200; // Even more delay between pieces
      const columnDelay = columnIndex * this.animationDuration * 0.05;
      const rowDelay = relativeY * this.animationDuration * 0.03;
      
      setTimeout(() => {
        piece.animate(keyframes, {
          duration: this.animationDuration * 600, // Slower animation
          easing: 'ease-in-out',
          fill: 'forwards'
        });
        
        // Animate final position separately for smoother landing
        piece.style.transition = `top ${this.animationDuration}s ease-in-out`;
        piece.style.top = `${adjustedFinalY}px`;
        piece.style.opacity = '1';
      }, baseDelay + columnDelay + rowDelay);
    });
    
    // Adjust end animation timing for new delays
    const maxDelay = (this.pieces.length * 200) + (sortedColumns.length * this.animationDuration * 0.05) + (Math.max(...Object.values(piecesByColumn).map(col => col.length)) * this.animationDuration * 0.03);
    setTimeout(() => this.endAnimation(), (this.animationDuration * 600) + maxDelay);
  }

  curtain() {
    const delay = this.direction === 'curtain-left' || this.direction === 'curtain-right' ? 
      (piece, index) => (index % this.rows) * 50 : // Delay by row for left/right
      (piece, index) => (Math.floor(index / this.rows)) * 50; // Delay by column for top/bottom
    
    this.pieces.forEach((piece, index) => {
      const finalX = parseInt(piece.dataset.finalX);
      const finalY = parseInt(piece.dataset.finalY);
      
      setTimeout(() => {
        piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
        piece.style.opacity = '1';
        piece.style.transform = 'scale(1)';
        piece.style.top = `${finalY}px`;
        piece.style.left = `${finalX}px`;
      }, delay(piece, index));
    });
    
    // Set end animation timeout based on max delay
    const maxDelay = Math.max(this.rows, this.columns) * 50;
    setTimeout(() => this.endAnimation(), (this.animationDuration * 1000) + maxDelay);
  }

  animate() {
    // Clear any existing pieces
    this.container.innerHTML = '';
    
    // Create pieces
    this.createPieces();
    
    // Choose animation based on direction
    if (this.direction === 'explode') {
      this.explode();
    } else if (this.direction === 'implode') {
      this.implode();
    } else if (this.direction === 'spiral') {
      this.spiral();
    } else if (this.direction === 'wave') {
      this.wave();
    } else if (this.direction === 'grow-in') {
      this.growIn();
    } else if (this.direction === 'grow-out') {
      this.growOut();
    } else if (this.direction === 'domino') {
      this.domino();
    } else if (this.direction === 'vortex') {
      this.vortex();
    } else if (this.direction === 'shutter') {
      this.shutter();
    } else if (this.direction === 'hypno') {
      this.hypno();
    } else if (this.direction.startsWith('curtain-')) {
      this.curtain();
    } else if (['left', 'right', 'top', 'bottom'].includes(this.direction)) {
      this.scatter();
    } else {
      this.scatter(); // Default animation
    }
  }
}
