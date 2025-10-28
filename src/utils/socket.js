/* eslint-disable no-undef */
// src/utils/socket.js
import { io } from 'socket.io-client';
import store from '@/store';
import router from '@/router';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }

    connect() {
        if (this.socket?.connected) return;

        const token = localStorage.getItem('auth_token') || store.state.auth.token;
        
        if (!token) {
            console.warn('No authentication token available');
            return;
        }

        this.socket = io(process.env.VUE_APP_SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
            timeout: 10000
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.isConnected = true;
            this.reconnectAttempts = 0;
            store.commit('setSocketConnected', true);
            
            // Subscribe to channels after connection
            this.subscribeToChannels();
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this.isConnected = false;
            store.commit('setSocketConnected', false);
            
            if (reason === 'io server disconnect') {
                // Server forced disconnect,可能需要重新认证
                setTimeout(() => this.connect(), 2000);
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.handleConnectionError(error);
        });

        this.socket.on('notification', (notification) => {
            this.handleNotification(notification);
        });

        this.socket.on('system_notification', (notification) => {
            this.handleSystemNotification(notification);
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.handleSocketError(error);
        });

        this.socket.on('reconnect_attempt', (attempt) => {
            console.log(`Reconnection attempt ${attempt}`);
            this.reconnectAttempts = attempt;
        });
    }

    subscribeToChannels() {
        const user = store.state.auth.user;
        if (!user) return;

        const channels = [
            'notifications:global',
            'notifications:user'
        ];

        // Add user-specific channel
        if (user.id) {
            channels.push(`user:${user.id}`);
        }

        // Add role-based channel if applicable
        if (user.role === 'admin') {
            channels.push('notifications:system');
        }

        this.socket.emit('subscribe', channels);
    }

    handleNotification(notification) {
        console.log('Received notification:', notification);
        
        // Store in Vuex
        store.commit('addNotification', notification);
        
        // Show UI notification based on type
        this.showUINotification(notification);
    }

    handleSystemNotification(notification) {
        console.log('Received system notification:', notification);
        store.commit('addSystemNotification', notification);
    }

    showUINotification(notification) {
        const { title, message, priority = 'normal' } = notification;
        
        // Implement your UI notification system here
        // Contoh menggunakan toast library
        if (window.toast) {
            window.toast({
                title,
                message,
                type: priority === 'high' ? 'error' : 'success',
                duration: 5000
            });
        }
    }

    handleConnectionError(error) {
        if (error.message.includes('Authentication')) {
            // Token invalid, redirect to login
            store.dispatch('auth/logout');
            router.push('/login');
        }
    }

    handleSocketError(error) {
        // Handle specific socket errors
        console.error('Socket error handled:', error);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            store.commit('setSocketConnected', false);
        }
    }

    // Method untuk emit custom events
    emit(event, data) {
        if (this.socket && this.isConnected) {
            this.socket.emit(event, data);
        }
    }

    // Method untuk listen custom events
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

export default new SocketService();