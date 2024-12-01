class ImgPiecer {
	constructor(container, options = {}) {
		this.container = container;
		// Merge options with defaults in one step
		const defaults = {
			imageUrl: '',
			rows: 5,
			columns: 5,
			animationDuration: 1,
			direction: 'top',
			initialOpacity: 0,
			spin: false,
		};
		
		// Assign all properties at once
		Object.assign(this, defaults, options);
		
		// Animation state tracking
		this.isAnimating = false;
		this.hadScrollbars = false;
		this.pieces = [];

		// Create and configure image
		this.image = new Image();
		this.image.src = this.imageUrl;
		
		// Cache container dimensions
		this.maxWidth = this.findAncestorWithWidthInPixels(this.container);
		this.containerWidth = this.container.offsetWidth;
		this.containerHeight = this.container.offsetHeight;
		this.containerCenterX = this.containerWidth / 2;
		this.containerCenterY = this.containerHeight / 2;

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
		// Create pieces and let createPieces handle the sizing
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
			} else if (this.direction.startsWith('curtain-')) {
				this.curtain();
			} else if (['left', 'right', 'top', 'bottom'].includes(this.direction)) {
				this.scatter();
			} else {
				this.animate();
			}
		}, 100);
	}

	findAncestorWithWidthInPixels(element) {
		let currentElement = element;
		while (currentElement) {
			const computedStyle = window.getComputedStyle(currentElement);
			// Determine if width or max-width is available
			let width = computedStyle.width !== 'auto' ? computedStyle.width : null;
			let maxWidth = computedStyle.maxWidth !== 'none' ? computedStyle.maxWidth : null;
			// Convert percentage width to pixels if necessary
			if (width && width.endsWith('%')) {
				let parentElement = currentElement.parentElement;						
				if (parentElement) {
					const parentStyle = window.getComputedStyle(parentElement);
					const parentWidth = parseFloat(parentStyle.width);
					const percentageWidth = parseFloat(width);
					width = (parentWidth * percentageWidth) / 100; // + 'px';
				}
			}
			if (maxWidth && maxWidth.endsWith('%')) {
				let parentElement = currentElement.parentElement;		
				if (parentElement) {
					const parentStyle = window.getComputedStyle(parentElement);
					const parentWidth = parseFloat(parentStyle.width);
					const percentageMaxWidth = parseFloat(maxWidth);
					maxWidth = (parentWidth * percentageMaxWidth) / 100; // + 'px';
				}
			}
			// Return the width in pixels if available
			if (width || maxWidth) {
				return width.replace('px', '') || maxWidth.replace('px', '');
			}
			currentElement = currentElement.parentElement;
		}
		return null;
	}

	createPieces() {
		let imageWidth = this.image.width;
		let imageHeight = this.image.height;

		if (imageWidth > this.maxWidth) {
			// Calculate aspect ratio from original dimensions
			const aspectRatio = this.image.height / this.image.width;
			// First set the new width
			imageWidth = this.maxWidth;
			// Then calculate new height using the aspect ratio
			imageHeight = Math.round(imageWidth * aspectRatio);
		}

		// Set container size
		Object.assign(this.container.style, {
			width: `${imageWidth}px`,
			height: `${imageHeight}px`,
			position: 'relative'
		});
		
		// Cache piece dimensions
		const pieceWidth = imageWidth / this.columns;
		const pieceHeight = imageHeight / this.rows;
		
		// Create document fragment for better performance
		const fragment = document.createDocumentFragment();
		this.pieces = new Array(this.rows * this.columns);

		// Create pieces and position them
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				const piece = document.createElement('div');
				piece.className = 'image-piece';

				// Calculate positions once
				const finalX = col * pieceWidth;
				const finalY = row * pieceHeight;
				
				// Set all styles at once using CSS transform
				Object.assign(piece.style, {
					width: `${pieceWidth}px`,
					height: `${pieceHeight}px`,
					backgroundImage: `url(${this.imageUrl})`,
					backgroundSize: `${imageWidth}px ${imageHeight}px`,
					backgroundPosition: `-${finalX}px -${finalY}px`,
					position: 'absolute',
					transform: 'scale(0.5)',
					willChange: 'transform, opacity'  // Optimize for animations
				});
				
				// Store positions as numbers
				piece.dataset.finalX = finalX;
				piece.dataset.finalY = finalY;
				
				// Set initial position and opacity based on direction
				this.setInitialPiecePosition(piece, finalX, finalY, imageWidth, imageHeight, pieceWidth, pieceHeight);
				
				fragment.appendChild(piece);
				this.pieces[row * this.columns + col] = piece;
			}
		}

		this.container.appendChild(fragment);
	}

	setInitialPiecePosition(piece, finalX, finalY, imageWidth, imageHeight, pieceWidth, pieceHeight) {
		switch (this.direction) {
			case 'explode':
				Object.assign(piece.style, {
					opacity: '1',
					transform: 'scale(1)',
					top: `${finalY}px`,
					left: `${finalX}px`
				});
				piece.dataset.originalTop = finalY;
				piece.dataset.originalLeft = finalX;
				break;
			case 'curtain-left':
				Object.assign(piece.style, {
					opacity: `${this.initialOpacity}`,
					left: `${-pieceWidth}px`,
					top: `${finalY}px`
				});
				break;
			case 'curtain-right':
				Object.assign(piece.style, {
					opacity: `${this.initialOpacity}`,
					left: `${imageWidth}px`,
					top: `${finalY}px`
				});
				break;
			case 'curtain-top':
				Object.assign(piece.style, {
					opacity: `${this.initialOpacity}`,
					top: `${-pieceHeight}px`,
					left: `${finalX}px`
				});
				break;
			case 'curtain-bottom':
				Object.assign(piece.style, {
					opacity: `${this.initialOpacity}`,
					top: `${imageHeight}px`,
					left: `${finalX}px`
				});
				break;
			default:
				Object.assign(piece.style, {
					opacity: `${this.initialOpacity}`,
					top: `${-pieceHeight}px`,
					left: `${Math.random() * imageWidth}px`
				});
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

	curtain() {
		// Ensure pieces are properly ordered for the animation
		const orderedPieces = [...this.pieces];
		
		// Sort pieces based on direction
		if (this.direction === 'curtain-left') {
			orderedPieces.sort((a, b) => parseInt(a.dataset.finalX) - parseInt(b.dataset.finalX));
		} else if (this.direction === 'curtain-right') {
			orderedPieces.sort((a, b) => parseInt(b.dataset.finalX) - parseInt(a.dataset.finalX));
		} else if (this.direction === 'curtain-top') {
			orderedPieces.sort((a, b) => parseInt(a.dataset.finalY) - parseInt(b.dataset.finalY));
		} else if (this.direction === 'curtain-bottom') {
			orderedPieces.sort((a, b) => parseInt(b.dataset.finalY) - parseInt(a.dataset.finalY));
		}

		// Calculate delays based on position
		const getDelay = (piece, index) => {
			if (this.direction === 'curtain-left' || this.direction === 'curtain-right') {
				const col = Math.floor(index / this.rows);
				const row = index % this.rows;
				return (col * 50) + (row * 20); // Slight delay within same column
			} else {
				const row = Math.floor(index / this.columns);
				const col = index % this.columns;
				return (row * 50) + (col * 20); // Slight delay within same row
			}
		};

		// Apply animations with proper timing
		orderedPieces.forEach((piece, index) => {
			const finalX = parseInt(piece.dataset.finalX);
			const finalY = parseInt(piece.dataset.finalY);
			
			// Set initial state immediately
			piece.style.opacity = `${this.initialOpacity}`;
			piece.style.transform = 'scale(0.8)';
			
			// Ensure transition is set before changing properties
			piece.style.transition = `all ${this.animationDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
			
			// Use requestAnimationFrame to ensure styles are applied in sequence
			requestAnimationFrame(() => {
				setTimeout(() => {
					Object.assign(piece.style, {
						opacity: '1',
						transform: 'scale(1)',
						top: `${finalY}px`,
						left: `${finalX}px`
					});
				}, getDelay(piece, index));
			});
		});
		
		// Calculate max delay including animation duration
		const maxDelay = (Math.max(this.rows, this.columns) * 50) + (Math.min(this.rows, this.columns) * 20);
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
		} else if (this.direction.startsWith('curtain-')) {
			this.curtain();
		} else if (['left', 'right', 'top', 'bottom'].includes(this.direction)) {
			this.scatter();
		} else {
			this.scatter(); // Default animation
		}
	}
}