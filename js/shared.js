/**
 * AutomatUp SaaS Dashboard - Shared Utilities & State Management
 * Pure vanilla JS modules for state, storage, and common functionality
 */

// State Management
class AppState {
    constructor() {
        this.storage = new StorageManager();
        this.init();
    }

    init() {
        // Initialize default state if not exists
        if (!this.storage.get('appConfig')) {
            this.storage.set('appConfig', {
                plan: 'Basic',
                object: 'sack',
                action: 'counting',
                area: 'dock-1',
                rules: {
                    whatToDo: '',
                    whereToDo: '',
                    howToDo: '',
                    whenToDo: ''
                },
                exampleText: 'For night trucks these are two ROI where the truck will come and there are two stations corresponding to it. Do count loading and unloading of sacks.'
            });
        }

        if (!this.storage.get('userProfile')) {
            this.storage.set('userProfile', {
                business: {
                    companyName: 'AutomatUp Industries',
                    industry: 'Manufacturing',
                    address: '123 Industrial Ave, Tech City',
                    phone: '+1-555-0123'
                },
                user: {
                    name: 'John Manager',
                    email: 'john@automatup.com',
                    role: 'admin',
                    status: 'active',
                    phone: '+1-555-0124'
                },
                billing: {
                    paymentMethod: 'Credit Card ****1234',
                    nextBilling: '2025-09-20',
                    currentCycle: 'Monthly'
                }
            });
        }

        if (!this.storage.get('cameras')) {
            this.storage.set('cameras', [
                { id: 1, name: 'Dock A Camera 1', ip: '192.168.1.101', features: ['Counting'], area: 'Dock A', status: 'active' },
                { id: 2, name: 'Dock A Camera 2', ip: '192.168.1.102', features: ['Counting', 'Violation Detection'], area: 'Dock A', status: 'active' },
                { id: 3, name: 'Dock B Camera 1', ip: '192.168.1.103', features: ['Vehicle Tracking'], area: 'Dock B', status: 'active' },
                { id: 4, name: 'Gate Camera', ip: '192.168.1.104', features: ['Access Control'], area: 'Main Gate', status: 'active' },
                { id: 5, name: 'Warehouse Cam 1', ip: '192.168.1.105', features: ['Counting'], area: 'Warehouse', status: 'inactive' },
                { id: 6, name: 'Warehouse Cam 2', ip: '192.168.1.106', features: ['Safety Monitoring'], area: 'Warehouse', status: 'active' },
                { id: 7, name: 'Loading Bay 1', ip: '192.168.1.107', features: ['Vehicle Tracking', 'Counting'], area: 'Loading Bay', status: 'active' },
                { id: 8, name: 'Loading Bay 2', ip: '192.168.1.108', features: ['Counting'], area: 'Loading Bay', status: 'active' },
                { id: 9, name: 'Perimeter Cam 1', ip: '192.168.1.109', features: ['Security'], area: 'Perimeter', status: 'active' },
                { id: 10, name: 'Perimeter Cam 2', ip: '192.168.1.110', features: ['Security'], area: 'Perimeter', status: 'active' }
            ]);
        }

        if (!this.storage.get('events')) {
            this.generateMockEvents();
        }

        if (!this.storage.get('masterData')) {
            this.storage.set('masterData', {
                aoi: ['Dock A', 'Dock B', 'Warehouse', 'Loading Bay', 'Gate Area'],
                ooi: ['Sacks', 'Vehicles', 'Personnel', 'Equipment'],
                hoi: ['Loading', 'Unloading', 'Counting', 'Tracking'],
                events: ['Vehicle Arrival', 'Loading Complete', 'Violation Detected', 'Count Mismatch'],
                voi: ['Truck License Plate', 'Sack Count', 'Person ID', 'Time Stamp']
            });
        }
    }

    generateMockEvents() {
        const events = [];
        const eventTypes = ['Vehicle Arrival', 'Loading Complete', 'Violation Detected', 'Count Mismatch', 'Security Alert'];
        const areas = ['Dock A', 'Dock B', 'Warehouse', 'Loading Bay', 'Gate Area'];
        const severities = ['high', 'medium', 'low'];
        
        for (let i = 1; i <= 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            events.push({
                id: i,
                date: date.toISOString().split('T')[0],
                time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
                eventName: eventTypes[Math.floor(Math.random() * eventTypes.length)],
                eventArea: areas[Math.floor(Math.random() * areas.length)],
                severity: severities[Math.floor(Math.random() * severities.length)],
                pinned: Math.random() > 0.8,
                actionPoints: ['Review footage', 'Notify supervisor', 'Update count'],
                details: `Event details for ${eventTypes[Math.floor(Math.random() * eventTypes.length)]} at ${areas[Math.floor(Math.random() * areas.length)]}`
            });
        }
        
        this.storage.set('events', events);
    }

    getConfig() {
        return this.storage.get('appConfig');
    }

    updateConfig(updates) {
        const current = this.getConfig();
        this.storage.set('appConfig', { ...current, ...updates });
    }

    getProfile() {
        return this.storage.get('userProfile');
    }

    updateProfile(updates) {
        const current = this.getProfile();
        this.storage.set('userProfile', { ...current, ...updates });
    }

    getCameras() {
        return this.storage.get('cameras') || [];
    }

    addCamera(camera) {
        const cameras = this.getCameras();
        camera.id = Math.max(...cameras.map(c => c.id), 0) + 1;
        cameras.push(camera);
        this.storage.set('cameras', cameras);
        return camera;
    }

    getEvents() {
        return this.storage.get('events') || [];
    }

    toggleEventPin(eventId) {
        const events = this.getEvents();
        const event = events.find(e => e.id === eventId);
        if (event) {
            event.pinned = !event.pinned;
            this.storage.set('events', events);
        }
        return event;
    }

    getMasterData() {
        return this.storage.get('masterData') || {};
    }

    updateMasterData(category, items) {
        const masterData = this.getMasterData();
        masterData[category] = items;
        this.storage.set('masterData', masterData);
    }
}

// Local Storage Manager
class StorageManager {
    get(key) {
        try {
            const item = localStorage.getItem(`automatup_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(`automatup_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error('Error writing to localStorage:', e);
        }
    }

    remove(key) {
        localStorage.removeItem(`automatup_${key}`);
    }
}

// Mock API Manager
class MockAPI {
    static delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async generateSQL(prompt) {
        await this.delay(1000);
        
        const sqlTemplates = {
            'sack': 'SELECT date, COUNT(*) as total_sacks FROM sack_events WHERE date BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW() GROUP BY date ORDER BY date',
            'vehicle': 'SELECT date, COUNT(DISTINCT vehicle_id) as vehicle_count FROM vehicle_logs WHERE date BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() GROUP BY date',
            'daily': 'SELECT DATE(timestamp) as day, COUNT(*) as count FROM events WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(timestamp)',
            'loading': 'SELECT dock_area, SUM(sack_count) as total_sacks FROM loading_events WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY dock_area',
            'violation': 'SELECT violation_type, COUNT(*) as count FROM violations WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY violation_type'
        };

        // Simple keyword matching
        let sql = sqlTemplates.daily; // default
        Object.keys(sqlTemplates).forEach(key => {
            if (prompt.toLowerCase().includes(key)) {
                sql = sqlTemplates[key];
            }
        });

        return sql;
    }

    static async generateChartData(sql, chartType = 'bar') {
        await this.delay(800);
        
        // Generate mock data based on SQL pattern
        if (sql.includes('sack')) {
            return {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Sack Count',
                    data: [245, 312, 189, 298],
                    backgroundColor: '#3b82f6'
                }]
            };
        } else if (sql.includes('vehicle')) {
            return {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Vehicle Count',
                    data: [15, 23, 18, 27, 31, 12, 8],
                    backgroundColor: '#10b981'
                }]
            };
        } else if (sql.includes('dock_area')) {
            return {
                labels: ['Dock A', 'Dock B', 'Dock C'],
                datasets: [{
                    label: 'Loading Count',
                    data: [120, 95, 87],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b']
                }]
            };
        } else {
            return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Daily Events',
                    data: [12, 19, 15, 25, 22, 18],
                    backgroundColor: '#6366f1'
                }]
            };
        }
    }
}

// Utility Functions
class Utils {
    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static exportToCSV(data, filename) {
        const csv = data.map(row => Object.values(row).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    static showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Chart Helper
class ChartHelper {
    static createChart(canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        return new Chart(ctx.getContext('2d'), config);
    }

    static createSparkline(canvasId, data, color = '#3b82f6') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        
        ctx.beginPath();
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }
}

// Global App Instance
window.appState = new AppState();
window.mockAPI = MockAPI;
window.utils = Utils;
window.chartHelper = ChartHelper;

// Update current time in header
function updateTime() {
    const timeElements = document.querySelectorAll('[data-time]');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    timeElements.forEach(el => {
        el.textContent = timeString;
    });
}

// Initialize time updates
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
});
