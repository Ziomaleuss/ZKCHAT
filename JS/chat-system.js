// Anonymous Chat System
class AnonymousChatSystem {
    constructor() {
        this.chatBox = document.getElementById('chat-box');
        this.inputField = document.getElementById('message');
        this.sendButton = document.getElementById('send');
        this.messages = [];
        this.messageCount = 0;
        this.messageIds = new Set();
        this.initialLoad = true;

        // Default anonymous avatar
        this.defaultAvatar = 'https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40';

        // Ensure required DOM elements exist
        if (!this.chatBox || !this.inputField || !this.sendButton) {
            console.error('AnonymousChatSystem: Required DOM elements are missing', {
                chatBox: !!this.chatBox,
                inputField: !!this.inputField,
                sendButton: !!this.sendButton
            });
            this.enabled = false; // disable further activity to avoid runtime errors
            return;
        }

        this.enabled = true;
        this.setupEventListeners();
        this.loadMessages();
        this.pollForNewMessages();
    }

    setupEventListeners() {
        if (!this.enabled) return;

        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const text = this.inputField.value.trim();

        if (!text) {
            this.showNotification('Please type a message!');
            return;
        }

        const message = {
            nick: 'Anonymous',
            pic: this.defaultAvatar,
            text: text,
            timestamp: new Date().toISOString()
        };

        // Show loading state
        this.showLoading();

        try {
            // Send to server
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            // Clear input
            this.inputField.value = '';
            this.inputField.focus();

            // Reload messages
            await this.loadMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Error sending message. Please try again.');
            this.removeLoading();
        }
    }

    async loadMessages() {
        try {
            const response = await fetch('/api/messages');
            if (!response.ok) {
                throw new Error('Failed to load messages');
            }

            const data = await response.json();
            const fetched = data.messages || [];

            // Initial load: render all without animations
            if (this.initialLoad) {
                this.messages = fetched;
                this.messageIds = new Set(fetched.map(m => m.id));
                this.renderMessages({ animate: false });
                this.initialLoad = false;
                this.removeLoading();
                return;
            }

            // Find new messages by id
            const newMessages = fetched.filter(m => !this.messageIds.has(m.id));

            if (newMessages.length > 0) {
                newMessages.forEach((m, idx) => {
                    this.messages.push(m);
                    this.messageIds.add(m.id);
                    const el = this.createMessageElement(m, true, idx);
                    this.chatBox.appendChild(el);
                });
                this.chatBox.scrollTop = this.chatBox.scrollHeight;
            }

            this.removeLoading();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    renderMessages(options = { animate: true }) {
        const animate = options.animate;
        this.chatBox.innerHTML = '';

        if (this.messages.length === 0) {
            this.chatBox.innerHTML = '<div style="text-align: center; color: #707070; padding: 2rem;">No messages yet. Be the first to say something!</div>';
            return;
        }

        this.messages.forEach((msg, index) => {
            const messageEl = this.createMessageElement(msg, animate, index);
            this.chatBox.appendChild(messageEl);
        });

        // Auto-scroll to bottom
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    createMessageElement(msg, animate = false, index = 0) {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        if (animate) {
            messageItem.classList.add('animate');
            messageItem.style.animationDelay = `${index * 0.05}s`;
        } else {
            // Ensure element is visible immediately without animation
            messageItem.style.opacity = '1';
            messageItem.style.transform = 'none';
        }

        const avatar = document.createElement('img');
        avatar.className = 'user-avatar';
        avatar.src = msg.pic;
        avatar.alt = msg.nick;
        avatar.style.width = '40px';
        avatar.style.height = '40px';
        avatar.style.borderRadius = '50%';
        avatar.onerror = () => {
            avatar.src = `https://ui-avatars.com/api/?name=${msg.nick}&background=667eea&color=fff&size=40`;
        };

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';

        const nickSpan = document.createElement('span');
        nickSpan.className = 'message-nick';
        nickSpan.textContent = msg.nick;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(msg.timestamp);

        headerDiv.appendChild(nickSpan);
        headerDiv.appendChild(timeSpan);

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';

        const textSpan = document.createElement('span');
        textSpan.className = 'message-text';
        textSpan.textContent = msg.text;

        bubbleDiv.appendChild(textSpan);

        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(bubbleDiv);

        messageItem.appendChild(avatar);
        messageItem.appendChild(contentDiv);

        return messageItem;
    }

    formatTime(timestamp) {
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;

            // Less than a minute
            if (diff < 60000) {
                return 'just now';
            }

            // Less than an hour
            if (diff < 3600000) {
                const minutes = Math.floor(diff / 60000);
                return `${minutes}m ago`;
            }

            // Less than a day
            if (diff < 86400000) {
                const hours = Math.floor(diff / 3600000);
                return `${hours}h ago`;
            }

            // Format as time
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'unknown';
        }
    }

    showLoading() {
        const loadingItem = document.createElement('div');
        loadingItem.className = 'message-item';
        loadingItem.id = 'loading-indicator';

        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = 'A';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';

        contentDiv.appendChild(loadingDiv);
        loadingItem.appendChild(avatar);
        loadingItem.appendChild(contentDiv);

        this.chatBox.appendChild(loadingItem);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    removeLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.remove();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 87, 87, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    pollForNewMessages() {
        setInterval(() => {
            if (this.enabled) {
                this.loadMessages();
            }
        }, 2000); // Poll every 2 seconds
    }
}

// Initialize chat system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        new AnonymousChatSystem();
    } catch (e) {
        console.error('AnonymousChatSystem initialization failed:', e);
    }
});
