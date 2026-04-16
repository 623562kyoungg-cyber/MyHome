document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });

    // 2. Navbar Scroll Effect & Home Button Visibility
    const navbar = document.getElementById('navbar');
    const homeBtn = document.getElementById('home-back-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            homeBtn.classList.add('visible');
        } else {
            homeBtn.classList.remove('visible');
        }
    });

    // 3. Generate Floating Elements (Anti-gravityEffect)
    const floatingContainer = document.getElementById('floating-elements');
    const icons = ['fa-microchip', 'fa-gear', 'fa-bolt', 'fa-cube', 'fa-atom', 'fa-wrench'];
    
    for (let i = 0; i < 30; i++) {
        const icon = document.createElement('i');
        const iconClass = icons[Math.floor(Math.random() * icons.length)];
        
        icon.className = `fas ${iconClass} floating-obj`;
        icon.style.left = `${Math.random() * 100}%`;
        icon.style.top = `${Math.random() * 100}%`;
        icon.style.fontSize = `${Math.random() * 20 + 10}px`;
        icon.style.color = Math.random() > 0.5 ? '#3a86ff' : '#4cc9f0';
        icon.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
        icon.style.animationDelay = `${Math.random() * 5}s`;
        
        floatingContainer.appendChild(icon);
    }

    // 4. Floating Animation Styling (Injection via JS to keep CSS clean)
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-300px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // 5. Scroll Reveal for Project Steps
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const steps = entry.target.querySelectorAll('.step');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('visible');
                    }, index * 300);
                });
            }
        });
    }, observerOptions);

    const projectBoard = document.querySelector('.project-board');
    if (projectBoard) {
        observer.observe(projectBoard);
    }

    // 6. Tilt Effect for Cards
    const cards = document.querySelectorAll('.strength-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 10;
            const rotateY = (x - centerX) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // 7. Tech Spheres Interactive Movement (Reverted to hover)
    const techSpheres = document.querySelectorAll('.tech-sphere');
    techSpheres.forEach(sphere => {
        sphere.addEventListener('mousemove', (e) => {
            const rect = sphere.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const dx = (x - rect.width / 2) / 5;
            const dy = (y - rect.height / 2) / 5;
            sphere.querySelector('.sphere-content').style.transform = `translate(${dx}px, ${dy}px)`;
        });

        sphere.addEventListener('mouseleave', () => {
            sphere.querySelector('.sphere-content').style.transform = `translate(0px, 0px)`;
        });
    });

    // 8. Free Board Logic
    const boardForm = document.getElementById('free-board-form');
    const boardPosts = document.getElementById('board-posts');
    const toggleWriteBtn = document.getElementById('toggle-write-form');
    const boardFormContainer = document.getElementById('board-form-container');
    const boardContainer = document.querySelector('.board-container');

    if (boardForm && boardPosts) {
        let posts = JSON.parse(localStorage.getItem('portfolio_posts')) || [];

        const renderPosts = () => {
            if (posts.length === 0) {
                boardPosts.innerHTML = '<div class="no-posts">등록된 게시물이 없습니다. 첫 번째 의견을 남겨보세요!</div>';
                return;
            }

            boardPosts.innerHTML = posts.map((post, index) => `
                <div class="post-card">
                    <div class="post-header">
                        <div class="post-info">
                            <span class="post-name">${post.name}</span>
                            <span class="post-email">${post.email}</span>
                            <span class="post-category">${post.category}</span>
                        </div>
                        <span class="post-date">${post.date}</span>
                    </div>
                    <div class="post-message" id="post-text-${index}">${post.message}</div>
                    <div class="edit-area" id="edit-area-${index}" style="display: none;">
                        <textarea class="edit-textarea" id="edit-input-${index}">${post.message}</textarea>
                        <div class="edit-buttons">
                            <button class="action-btn save-btn" data-index="${index}"><i class="fas fa-check"></i> 저장</button>
                            <button class="action-btn cancel-btn" data-index="${index}"><i class="fas fa-times"></i> 취소</button>
                        </div>
                    </div>
                    <div class="post-actions" id="post-actions-${index}">
                        <button class="action-btn edit-btn" data-index="${index}">
                            <i class="fas fa-edit"></i> 수정
                        </button>
                        <button class="action-btn delete-btn" data-index="${index}">
                            <i class="fas fa-trash"></i> 삭제
                        </button>
                        <button class="action-btn reply-toggle" data-index="${index}">
                            <i class="fas fa-reply"></i> 답글 (${post.replies ? post.replies.length : 0})
                        </button>
                    </div>
                    <div class="reply-section" id="reply-section-${index}" style="display: none;">
                        <div class="reply-list">
                            ${(post.replies || []).map(reply => `
                                <div class="reply-item">
                                    <strong>관리자/팀원:</strong> ${reply}
                                </div>
                            `).join('')}
                        </div>
                        <form class="reply-form" data-index="${index}">
                            <input type="text" placeholder="답글 내용을 입력하세요" required>
                            <button type="submit" class="btn btn-primary" style="padding: 5px 15px; font-size: 12px; margin: 0;">등록</button>
                        </form>
                    </div>
                </div>
            `).join('');

            // Event Listeners for Board Post Actions
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = btn.dataset.index;
                    document.getElementById(`post-text-${idx}`).style.display = 'none';
                    document.getElementById(`post-actions-${idx}`).style.display = 'none';
                    document.getElementById(`edit-area-${idx}`).style.display = 'block';
                });
            });

            document.querySelectorAll('.save-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = btn.dataset.index;
                    const newText = document.getElementById(`edit-input-${idx}`).value;
                    if (newText.trim() !== "") {
                        posts[idx].message = newText;
                        saveAndRender();
                    }
                });
            });

            document.querySelectorAll('.cancel-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = btn.dataset.index;
                    document.getElementById(`post-text-${idx}`).style.display = 'block';
                    document.getElementById(`post-actions-${idx}`).style.display = 'flex';
                    document.getElementById(`edit-area-${idx}`).style.display = 'none';
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (confirm('이 게시물을 삭제하시겠습니까?')) {
                        posts.splice(btn.dataset.index, 1);
                        saveAndRender();
                    }
                });
            });

            document.querySelectorAll('.reply-toggle').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = btn.dataset.index;
                    const section = document.getElementById(`reply-section-${idx}`);
                    section.style.display = section.style.display === 'none' ? 'block' : 'none';
                });
            });

            document.querySelectorAll('.reply-form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const idx = form.dataset.index;
                    const input = form.querySelector('input');
                    if (!posts[idx].replies) posts[idx].replies = [];
                    posts[idx].replies.push(input.value);
                    input.value = '';
                    saveAndRender();
                });
            });
        };

        const saveAndRender = () => {
            localStorage.setItem('portfolio_posts', JSON.stringify(posts));
            renderPosts();
        };

        // Toggle Write Form
        if (toggleWriteBtn) {
            toggleWriteBtn.addEventListener('click', () => {
                const isHidden = boardFormContainer.style.display === 'none';
                if (isHidden) {
                    boardFormContainer.style.display = 'block';
                    setTimeout(() => {
                        boardFormContainer.classList.add('visible');
                        boardContainer.classList.add('form-active');
                    }, 10);
                    toggleWriteBtn.innerHTML = '<i class="fas fa-times"></i> 닫기';
                } else {
                    boardFormContainer.classList.remove('visible');
                    boardContainer.classList.remove('form-active');
                    setTimeout(() => {
                        boardFormContainer.style.display = 'none';
                    }, 500);
                    toggleWriteBtn.innerHTML = '<i class="fas fa-pen-nib"></i> 글쓰기';
                }
            });
        }

        boardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            posts.unshift({
                name: document.getElementById('board-name').value,
                email: document.getElementById('board-email').value,
                category: document.getElementById('board-category').value,
                message: document.getElementById('board-message').value,
                date: new Date().toLocaleString(),
                replies: []
            });
            boardForm.reset();
            saveAndRender();
        });

        renderPosts();
    }

    // 9. New Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // For now, let's also save it to the Board data so it shows up there
            let posts = JSON.parse(localStorage.getItem('portfolio_posts')) || [];
            posts.unshift({
                name: name,
                email: email,
                category: 'Contact',
                message: message,
                date: new Date().toLocaleString(),
                replies: []
            });
            localStorage.setItem('portfolio_posts', JSON.stringify(posts));

            alert(`${name}님, 메시지가 성공적으로 전송되었습니다!`);
            contactForm.reset();
            
            // Refresh board if present
            if (typeof renderPosts === 'function') {
                renderPosts();
            }
        });
    }
});
