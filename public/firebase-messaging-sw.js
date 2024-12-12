// Service Worker lifecycle events
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Kích hoạt ngay lập tức mà không cần chờ
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

// Import Firebase scripts (compat versions)
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlxyL-YbbZloekntzaV8aJNuONvi3kRdI",
  authDomain: "uploadimg-97839.firebaseapp.com",
  projectId: "uploadimg-97839",
  storageBucket: "uploadimg-97839.appspot.com",
  messagingSenderId: "766099455450",
  appId: "1:766099455450:web:d8ed6c9f8aa18cc4e654e3",
  measurementId: "G-CEL2EZ1H2F",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
