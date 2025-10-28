<template>
    <div class="notification-system">
        <!-- Notification Bell -->
        <div class="notification-bell" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">
                {{ unreadCount }}
            </span>
        </div>

        <!-- Notification Panel -->
        <div v-if="showPanel" class="notification-panel">
            <div class="panel-header">
                <h3>Notifications</h3>
                <button @click="markAllAsRead" class="mark-all-btn">
                    Mark all as read
                </button>
            </div>
            
            <div class="notification-list">
                <div 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    :class="['notification-item', { unread: !notification.read }]"
                    @click="handleNotificationClick(notification)"
                >
                    <div class="notification-icon">
                        <i :class="getNotificationIcon(notification)"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">
                            {{ notification.title }}
                        </div>
                        <div class="notification-message">
                            {{ notification.message }}
                        </div>
                        <div class="notification-time">
                            {{ formatTime(notification.timestamp) }}
                        </div>
                    </div>
                    <div class="notification-actions">
                        <button 
                            v-if="!notification.read"
                            @click.stop="markAsRead(notification)"
                            class="read-btn"
                        >
                            Mark read
                        </button>
                    </div>
                </div>
                
                <div v-if="notifications.length === 0" class="empty-state">
                    No notifications
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SocketService from '@/utils/socket';

export default {
    name: 'NotificationSystem',
    
    data() {
        return {
            showPanel: false
        };
    },
    
    computed: {
        ...mapState('notifications', ['notifications']),
        ...mapGetters('notifications', ['unreadCount'])
    },
    
    mounted() {
        // Initialize socket connection
        SocketService.connect();
        
        // Listen for new notifications
        SocketService.on('notification', this.handleNewNotification);
        
        // Load existing notifications from API
        this.loadNotifications();
    },
    
    beforeUnmount() {
        SocketService.off('notification', this.handleNewNotification);
    },
    
    methods: {
        toggleNotifications() {
            this.showPanel = !this.showPanel;
        },
        
        handleNewNotification(notification) {
            this.$store.commit('notifications/addNotification', notification);
            
            // Show desktop notification if permitted
            this.showDesktopNotification(notification);
        },
        
        showDesktopNotification(notification) {
            if (!('Notification' in window)) return;
            
            if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/notification-icon.png'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(notification.title, {
                            body: notification.message,
                            icon: '/notification-icon.png'
                        });
                    }
                });
            }
        },
        
        async loadNotifications() {
            try {
                const response = await this.$http.get('/api/v1/notifications');
                this.$store.commit('notifications/setNotifications', response.data);
            } catch (error) {
                console.error('Failed to load notifications:', error);
            }
        },
        
        async markAsRead(notification) {
            try {
                await this.$http.patch(`/api/v1/notifications/${notification.id}/read`);
                this.$store.commit('notifications/markAsRead', notification.id);
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        },
        
        async markAllAsRead() {
            try {
                await this.$http.patch('/api/v1/notifications/read-all');
                this.$store.commit('notifications/markAllAsRead');
            } catch (error) {
                console.error('Failed to mark all as read:', error);
            }
        },
        
        handleNotificationClick(notification) {
            // Handle notification click based on type
            if (notification.action_url) {
                this.$router.push(notification.action_url);
            }
            
            if (!notification.read) {
                this.markAsRead(notification);
            }
        },
        
        getNotificationIcon(notification) {
            const icons = {
                info: 'fas fa-info-circle',
                success: 'fas fa-check-circle',
                warning: 'fas fa-exclamation-triangle',
                error: 'fas fa-exclamation-circle'
            };
            
            return icons[notification.type] || 'fas fa-bell';
        },
        
        formatTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString();
        }
    }
};
</script>

<style scoped>
.notification-system {
    position: relative;
    display: inline-block;
}

.notification-bell {
    position: relative;
    cursor: pointer;
    padding: 8px;
    font-size: 1.2rem;
}

.notification-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-panel {
    position: absolute;
    top: 100%;
    right: 0;
    width: 350px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
}

.panel-header {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mark-all-btn {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 0.8rem;
}

.notification-list {
    max-height: 400px;
    overflow-y: auto;
}

.notification-item {
    display: flex;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;
}

.notification-item:hover {
    background-color: #f8f9fa;
}

.notification-item.unread {
    background-color: #f0f7ff;
}

.notification-icon {
    margin-right: 12px;
    color: #6c757d;
}

.notification-content {
    flex: 1;
}

.notification-title {
    font-weight: 600;
    margin-bottom: 4px;
}

.notification-message {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 4px;
}

.notification-time {
    font-size: 0.8rem;
    color: #adb5bd;
}

.notification-actions {
    margin-left: 12px;
}

.read-btn {
    background: none;
    border: 1px solid #007bff;
    color: #007bff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    cursor: pointer;
}

.empty-state {
    padding: 24px;
    text-align: center;
    color: #6c757d;
}
</style>