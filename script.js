document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    // Observer callback
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the id of the intersecting section
                const activeId = entry.target.getAttribute('id');

                const sidebarSig = document.getElementById('sidebar-signature');
                if (sidebarSig) {
                    if (activeId !== 'home') {
                        sidebarSig.classList.add('show');
                    } else {
                        sidebarSig.classList.remove('show');
                    }
                }

                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Add active class to corresponding link
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all pages
    pages.forEach(page => {
        observer.observe(page);
    });

    // Handle smooth transition of profile name style on scroll
    const profileName = document.getElementById('profile-name');
    window.addEventListener('scroll', () => {
        if (profileName) {
            // Map 0 -> 400px of scrolling to 0 -> 1 progress
            let progress = Math.min(window.scrollY / 400, 1);
            profileName.style.setProperty('--scroll-progress', progress);
        }
    });

    // Premium Magnetic Letter Effect
    const letters = document.querySelectorAll('.profile-name .letter');

    // Enable effect only after CSS entrance animations finish (approx 4 seconds)
    setTimeout(() => {
        if (!profileName) return;

        profileName.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;

            letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const letterCenterX = rect.left + rect.width / 2;
                const letterCenterY = rect.top + rect.height / 2;

                const deltaX = clientX - letterCenterX;
                const deltaY = clientY - letterCenterY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                // Magnetic radius (distance in pixels the cursor affects)
                if (distance < 120) {
                    // Pull the letter slightly towards the cursor
                    const pullX = (deltaX / distance) * (120 - distance) * 0.15;
                    const pullY = (deltaY / distance) * (120 - distance) * 0.15;
                    letter.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.05)`;
                    letter.style.transition = 'transform 0.1s ease-out';
                } else {
                    // Return to normal
                    letter.style.transform = 'translate(0px, 0px) scale(1)';
                    letter.style.transition = 'transform 0.3s ease-out';
                }
            });
        });

        // Reset all letters when cursor leaves the name area
        profileName.addEventListener('mouseleave', () => {
            letters.forEach(letter => {
                letter.style.transform = 'translate(0px, 0px) scale(1)';
                letter.style.transition = 'transform 0.4s ease-out';
            });
        });
    }, 4000);

    // Golden Sparkle Cursor Effect
    let lastSparkleTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Create a sparkle extremely fast for dense trail
        if (now - lastSparkleTime > 15) {
            createSparkle(e.pageX, e.pageY);
            lastSparkleTime = now;
        }
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        // Tighter radius for a more cohesive, defined trail
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;

        // Randomize size
        const size = Math.random() * 5 + 3; // 3px to 8px
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        // Shorter animation duration for a punchy smooth fade
        const duration = Math.random() * 0.3 + 0.4;
        sparkle.style.animationDuration = `${duration}s`;

        document.body.appendChild(sparkle);

        // Remove element after animation completes
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, duration * 1000);
    }

    // Rolling Numbers Animation for Stats
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    statNumbers.forEach(stat => {
                        const targetStr = stat.innerText.trim();
                        const target = parseInt(targetStr, 10);
                        const hasLeadingZero = targetStr.startsWith('0');
                        const duration = 2000; // 2 seconds roll up

                        // Temporarily set to 0 initially
                        stat.innerText = hasLeadingZero ? '0'.padStart(targetStr.length, '0') : '0';

                        let startTime = null;
                        const step = (timestamp) => {
                            if (!startTime) startTime = timestamp;
                            // Calculate progress between 0 and 1
                            const progress = Math.min((timestamp - startTime) / duration, 1);

                            // Ease-out effect (starts fast, slows down at the end)
                            const easeOut = progress * (2 - progress);
                            const current = Math.floor(easeOut * target);

                            let displayVal = current.toString();
                            if (hasLeadingZero) {
                                displayVal = displayVal.padStart(targetStr.length, '0');
                            }
                            stat.innerText = displayVal;

                            if (progress < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                stat.innerText = targetStr; // Snap exactly to final value
                            }
                        };

                        window.requestAnimationFrame(step);
                    });
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

        statsObserver.observe(statsSection);
    }

    // Proximity Line Animation
    const proximityContainer = document.querySelector('.proximity-line-container');
    const proximityLine = document.querySelector('.proximity-line');

    if (proximityContainer && proximityLine) {
        document.addEventListener('mousemove', (e) => {
            const rect = proximityContainer.getBoundingClientRect();
            // Calculate distance from cursor to the vertical center of the container relative to viewport
            const containerCenterY = rect.top + rect.height / 2;
            const distanceY = Math.abs(e.clientY - containerCenterY);

            // Activation threshold: 300 pixels
            const maxDistance = 300;

            if (distanceY < maxDistance) {
                // The closer the cursor, the closer the scale and opacity get to 1
                // Use ease-out math for a slightly softer expansion
                const progress = 1 - (distanceY / maxDistance);
                const easedProgress = Math.pow(progress, 0.5); // Pops up more eagerly

                proximityLine.style.transform = `scaleX(${easedProgress})`;
                proximityLine.style.opacity = easedProgress;
            } else {
                proximityLine.style.transform = 'scaleX(0)';
                proximityLine.style.opacity = '0';
            }
        });
    }

    // Dynamic Projects rendering
    const projectsGrid = document.getElementById('projectsGrid');
    const projectModal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalGallery = document.getElementById('modalGallery');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (projectsGrid && typeof projectsData !== 'undefined') {
        projectsData.forEach((project) => {
            // Find the cover image: specifically looking for files containing 'BRAND PAGE'
            let coverImage = project.images.find(img => img.toUpperCase().includes('BRAND PAGE'));
            // Fallback to first image if no BRAND PAGE found
            if (!coverImage && project.images.length > 0) coverImage = project.images[0];

            if (!coverImage) return; // Skip if directory is somehow completely empty

            // Construct cover image path
            const coverPath = `assets/IMAGES/${encodeURIComponent(project.name)}/${encodeURIComponent(coverImage)}`;

            // Create project item DOM structure
            const itemDiv = document.createElement('div');
            itemDiv.className = 'project-item';

            // Image element
            const imgEl = document.createElement('img');
            imgEl.src = coverPath;
            imgEl.alt = project.name;
            itemDiv.appendChild(imgEl);

            // Overlay element containing the title
            const overlayDiv = document.createElement('div');
            overlayDiv.className = 'project-overlay';
            const titleEl = document.createElement('h3');
            titleEl.textContent = project.name;
            overlayDiv.appendChild(titleEl);
            itemDiv.appendChild(overlayDiv);

            // Add Click listener to open modal with gallery
            itemDiv.addEventListener('click', () => {
                modalTitle.textContent = project.name;
                modalGallery.innerHTML = ''; // Clear existing images

                // Add all images for this project to the modal
                project.images.forEach(img => {
                    // Skip the brand page inside the modal as requested
                    if (img.toUpperCase().includes('BRAND PAGE')) return;

                    const galleryImgPath = `assets/IMAGES/${encodeURIComponent(project.name)}/${encodeURIComponent(img)}`;
                    const galleryImgEl = document.createElement('img');
                    galleryImgEl.src = galleryImgPath;
                    galleryImgEl.loading = "lazy"; // Add lazy loading for performance
                    modalGallery.appendChild(galleryImgEl);
                });

                // Show modal and prevent body scroll
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            // Append to Grid
            projectsGrid.appendChild(itemDiv);
        });
    }

    // Close Modal listeners
    const closeModal = () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (projectModal) {
        // Close if click is outside modal content
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }
});
