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

    // 5. Scroll Reveal for Project Cards
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card').forEach(card => {
        projectObserver.observe(card);
    });

    // 6. Strong 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Increased rotation factor for "stronger" tilt
            const rotateX = (centerY - y) / 8; 
            const rotateY = (x - centerX) / 8; 

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
            
            // Parallax effect for success metric if it exists
            const metric = card.querySelector('.success-metric');
            if (metric) {
                metric.style.transform = `translateZ(50px) translateX(${(x - centerX) / 10}px) translateY(${(y - centerY) / 10}px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
            const metric = card.querySelector('.success-metric');
            if (metric) {
                metric.style.transform = `translateZ(50px)`;
            }
        });
    });

    // 7. Tech Network Connection System
    const drawConnections = () => {
        const svg = document.getElementById('connection-lines');
        if (!svg) return;
        svg.innerHTML = '';
        
        const wrappers = document.querySelectorAll('.sphere-wrapper');
        const containerRect = document.querySelector('.tech-sphere-container').getBoundingClientRect();
        
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        wrappers.forEach(wrap => {
            const sphere = wrap.querySelector('.tech-sphere');
            const rect = wrap.getBoundingClientRect();
            const posX = rect.left - containerRect.left + rect.width / 2;
            const posY = rect.top - containerRect.top + rect.height / 2;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centerX);
            line.setAttribute('y1', centerY);
            line.setAttribute('x2', posX);
            line.setAttribute('y2', posY);
            line.setAttribute('stroke', 'rgba(76, 201, 240, 0.2)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('class', `line-${sphere.id}`);
            svg.appendChild(line);
        });
    };

    window.addEventListener('load', drawConnections);
    window.addEventListener('resize', drawConnections);
    drawConnections();

    // 7. Tech Network Connection System (Continued)
    // Hover glow effect for connections
    document.querySelectorAll('.tech-sphere').forEach(sphere => {
        sphere.addEventListener('mouseenter', () => {
            const line = document.querySelector(`.line-${sphere.id}`);
            if (line) {
                line.setAttribute('stroke', 'rgba(37, 99, 235, 0.8)');
                line.setAttribute('stroke-width', '3');
                line.style.filter = 'drop-shadow(0 0 5px rgba(37, 99, 235, 0.4))';
            }
            sphere.classList.add('active');
        });

        sphere.addEventListener('mouseleave', () => {
            const line = document.querySelector(`.line-${sphere.id}`);
            if (line) {
                line.setAttribute('stroke', 'rgba(37, 99, 235, 0.15)');
                line.setAttribute('stroke-width', '1');
                line.style.filter = 'none';
            }
            sphere.classList.remove('active');
        });
    });

    // 8. Tech Detail Modal Logic
    const techData = {
        'tech-1': { title: '기계 도면 해독', icon: 'fa-cube', desc: 'SolidWorks를 활용한 3D 형상 모델링, 부품 조립 및 상호 간섭 체크 능력을 통해 장비의 기계적 구조와 조립 메커니즘을 완벽히 이해합니다.' },
        'tech-2': { title: '전장 트러블슈팅', icon: 'fa-bolt', desc: '복잡한 장비 내부의 배선 전장 도면을 완벽히 해독하여, 단선 및 절연 불량 등 전기적 결함 발생 시 신속하고 정확한 트러블슈팅을 수행합니다.' },
        'tech-3': { title: 'PLC 프로그래밍', icon: 'fa-terminal', desc: 'LS산전 및 미쓰비시 PLC를 활용하여 산업용 자동화 라인의 시퀀스 제어 로직을 설계하고, HMI 연동을 통한 실시간 모니터링 시스템 구축 경험이 있습니다.' },
        'tech-4': { title: '제어 시스템 통합', icon: 'fa-robot', desc: '오실로스코프와 멀티미터를 활용하여 RLC 부하 회로의 전압/전류 파형을 분석하고, 이상 유무를 검증할 수 있는 계측 능력을 갖추었습니다.' },
        'tech-5': { title: '전기공학적 분석', icon: 'fa-charging-station', desc: '회로이론의 기본 법칙(KCL, KVL)을 숙지하고, 실제 회로 구성을 통한 전압/전류 측정 실험을 통해 전장 도면 분석 및 회로 트러블슈팅의 기초를 다졌습니다.' }
    };

    const modal = document.getElementById('tech-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalIcon = document.getElementById('modal-icon');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.tech-sphere').forEach(sphere => {
        sphere.addEventListener('click', () => {
            const data = techData[sphere.id];
            if (data) {
                modalTitle.innerText = data.title;
                modalDesc.innerText = data.desc;
                modalIcon.className = `fas ${data.icon}`;
                modal.style.display = 'block';
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 10. Live Time & Weather Update
    const updateLiveInfo = () => {
        const timeEl = document.getElementById('current-time');
        const weatherEl = document.getElementById('current-weather');
        
        if (timeEl) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('ko-KR', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            timeEl.innerText = timeStr;
        }

        // Simple weather simulation (Could be replaced with a real API)
        if (weatherEl && !weatherEl.dataset.updated) {
            const temp = 18 + Math.floor(Math.random() * 5);
            weatherEl.innerHTML = `<i class="fas fa-cloud-sun"></i> ${temp}°C`;
            weatherEl.dataset.updated = "true";
        }
    };

    setInterval(updateLiveInfo, 1000);
    updateLiveInfo();

    // 9. Free Board Logic
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
    // 11. Side Navigation Scroll Spy & Smooth Scroll
    const sideNavDots = document.querySelectorAll('.nav-dot');
    const navSections = document.querySelectorAll('section');

    const updateActiveDot = () => {
        let currentId = '';
        navSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                currentId = section.getAttribute('id');
            }
        });

        sideNavDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === currentId) {
                dot.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveDot);
    updateActiveDot();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
