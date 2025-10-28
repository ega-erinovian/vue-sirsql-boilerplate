// src/store/modules/notifications.js
const state = {
    notifications: [],
    connectionStatus: false
};

const getters = {
    unreadCount: state => state.notifications.filter(n => !n.read).length,
    recentNotifications: state => state.notifications.slice(0, 10),
    hasUnread: state => state.notifications.some(n => !n.read)
};

const mutations = {
    setNotifications(state, notifications) {
        state.notifications = notifications;
    },
    
    addNotification(state, notification) {
        state.notifications.unshift({
            ...notification,
            id: notification.id || Date.now(),
            read: false,
            timestamp: notification.timestamp || Date.now()
        });
        
        // Keep only latest 50 notifications
        if (state.notifications.length > 50) {
            state.notifications = state.notifications.slice(0, 50);
        }
    },
    
    markAsRead(state, notificationId) {
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    },
    
    markAllAsRead(state) {
        state.notifications.forEach(notification => {
            notification.read = true;
        });
    },
    
    setConnectionStatus(state, status) {
        state.connectionStatus = status;
    },
    
    clearNotifications(state) {
        state.notifications = [];
    }
};

const actions = {
    async loadNotifications({ commit }) {
        try {
            const response = await this.$http.get('/api/v1/notifications');
            commit('setNotifications', response.data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            throw error;
        }
    },
    
    async markAsRead({ commit }, notificationId) {
        try {
            await this.$http.patch(`/api/v1/notifications/${notificationId}/read`);
            commit('markAsRead', notificationId);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};