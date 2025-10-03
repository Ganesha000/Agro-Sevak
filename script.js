// ===== GLOBAL VARIABLES AND STATE =====
let currentUser = null;
let isLoggedIn = false;
let currentLanguage = 'en';
let currentTheme = 'light';
let isVoiceListening = false;
let recognition = null;
let fabExpanded = false;

// ===== TRANSLATION SYSTEM =====
const translations = {
  en: {
    appName: "Agro Sevak",
    features: "Features",
    tools: "Tools",
    about: "About",
    contact: "Contact",
    settings: "Settings",
    login: "Login",
    signup: "Sign Up",
    heroTitle: "AI-Powered Agricultural Assistant for Modern Farmers",
    heroText: "Agro Sevak combines cutting-edge technology with agricultural expertise to help you maximize your crop yield and minimize risks.",
    getStarted: "Get Started",
    exploreTools: "Explore Tools",
    whyChoose: "Why Choose Agro Sevak?",
    feature1Title: "AI Disease Detection",
    feature1Text: "Our advanced machine learning models can identify plant diseases with over 95% accuracy just from a photo of your crop.",
    feature2Title: "Smart Weather Alerts",
    feature2Text: "Get hyper-local weather forecasts and alerts tailored to your specific crops and location.",
    feature3Title: "Real-time Market Prices",
    feature3Text: "Access up-to-date mandi prices across India to get the best value for your produce.",
    aboutUs: "About Agro Sevak",
    ourMission: "Our Mission",
    missionText: "Agro Sevak was founded with a simple mission: to empower farmers with technology that helps them make better decisions, increase yields, and improve their livelihoods.",
    ourTechnology: "Our Technology",
    technologyText: "Using artificial intelligence, machine learning, and satellite data, we provide personalized recommendations for crop management, disease prevention, and optimal harvesting times.",
    farmersServed: "Farmers Served",
    accuracyRate: "Disease Detection Accuracy",
    supportAvailable: "Support Available",
    agriTools: "Agricultural AI Tools",
    scanLeaf: "Plant Disease Scanner",
    viewMandi: "Market Intelligence",
    getWeather: "Weather Intelligence",
    startVoice: "Voice Assistant",
    getCalendar: "Crop Calendar",
    smartAlerts: "Smart Alerts",
    footerDesc: "Empowering farmers with AI technology to make informed decisions and maximize agricultural productivity.",
    quickLinks: "Quick Links",
    privacy: "Privacy Policy",
    contactUs: "Contact Us",
    address: "123 Farm Road, Agri Zone, India",
    rightsReserved: "All Rights Reserved",
    personalizeCalendar: "Personalize Your Crop Calendar",
    selectState: "Select State",
    district: "District",
    soilType: "Soil Type",
    selectSoil: "Select Soil Type",
    alluvial: "Alluvial Soil",
    blackSoil: "Black Soil (Regur)",
    redSoil: "Red Soil",
    laterite: "Laterite Soil",
    mountain: "Mountain Soil",
    desert: "Desert Soil",
    mainCrop: "Main Crop",
    selectCrop: "Select Main Crop",
    wheat: "Wheat",
    rice: "Rice",
    maize: "Maize",
    sugarcane: "Sugarcane",
    cotton: "Cotton",
    soybean: "Soybean",
    pulses: "Pulses",
    oilseeds: "Oilseeds",
    cancel: "Cancel",
    generateCalendar: "Generate Calendar",
    // ... Additional translations can be added
  },
  hi: {
    appName: "एग्रो सेवक",
    features: "विशेषताएं",
    tools: "उपकरण",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    settings: "सेटिंग्स",
    login: "लॉग इन",
    signup: "साइन अप",
    heroTitle: "आधुनिक किसानों के लिए एआई-संचालित कृषि सहायक",
    heroText: "एग्रो सेवक उन्नत तकनीक और कृषि विशेषज्ञता को जोड़कर आपकी फसल की पैदावार को अधिकतम करने में मदद करता है।",
    getStarted: "शुरू करें",
    exploreTools: "उपकरण देखें",
    // ... Additional Hindi translations
  }
  // Additional languages can be added here
};

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
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

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function createRippleEffect(event, element) {
  const ripple = document.createElement('div');
  ripple.classList.add('btn-ripple');
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function showNotification(message, type = 'success') {
  const container = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// ===== INITIALIZATION =====
function initializeApp() {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
  }, 1500);
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Initialize animations
  initializeScrollAnimations();
  
  // Initialize parallax effects
  initializeParallaxEffects();
  
  // Initialize navigation
  initializeNavigation();
  
  // Initialize authentication
  initializeAuthentication();
  
  // Initialize voice recognition
  initializeVoiceRecognition();
  
  // Initialize language system
  initializeLanguageSystem();
  
  // Initialize theme system
  initializeThemeSystem();
  
  // Initialize drag and drop
  initializeDragAndDrop();
  
  // Initialize FAB
  initializeFAB();
  
  // Load user settings
  loadUserSettings();
  
  console.log('Agro Sevak initialized successfully');
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
  // Button ripple effects
  document.addEventListener('click', (e) => {
    if (e.target.closest('.modern-btn, .btn-primary, .btn-outline, .btn-icon')) {
      const button = e.target.closest('.modern-btn, .btn-primary, .btn-outline, .btn-icon');
      createRippleEffect(e, button);
    }
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Authentication form handling
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }
  
  // Location form handling
  const locationForm = document.getElementById('locationForm');
  if (locationForm) {
    locationForm.addEventListener('submit', handleLocationSubmit);
  }
  
  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLocationModal();
      closeSettings();
    }
  });
  
  // Hero scroll indicator
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      scrollToSection('features');
    });
  }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Animate counters
        if (entry.target.querySelector('[data-target]')) {
          animateCounters(entry.target);
        }
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .hero-stats').forEach(el => {
    observer.observe(el);
  });
}

function animateCounters(container) {
  const counters = container.querySelectorAll('[data-target]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.hero-bg-layer');
  
  const handleScroll = throttle(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach((element, index) => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const yPos = scrolled * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  }, 16);
  
  window.addEventListener('scroll', handleScroll);
}

// ===== NAVIGATION =====
function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;
  
  const handleNavbarScroll = throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  }, 16);
  
  window.addEventListener('scroll', handleNavbarScroll);
  
  // Smooth scroll for navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

// ===== AUTHENTICATION =====
function initializeAuthentication() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem('agroSevakUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;
    updateAuthUI();
  }
}

function showAuthModal(mode) {
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const buttonText = document.getElementById('authButtonText');
  const switchText = document.getElementById('authSwitchText');
  const switchBtn = document.getElementById('authSwitchBtn');
  const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
  
  if (mode === 'login') {
    title.textContent = 'Welcome Back';
    subtitle.textContent = 'Sign in to access your personalized dashboard';
    buttonText.textContent = 'Sign In';
    switchText.textContent = "Don't have an account?";
    switchBtn.textContent = 'Sign Up';
    confirmPasswordGroup.style.display = 'none';
  } else {
    title.textContent = 'Join Agro Sevak';
    subtitle.textContent = 'Create your account to get started';
    buttonText.textContent = 'Sign Up';
    switchText.textContent = 'Already have an account?';
    switchBtn.textContent = 'Sign In';
    confirmPasswordGroup.style.display = 'block';
  }
  
  modal.classList.add('active');
  modal.dataset.mode = mode;
}

function closeModal() {
  const modal = document.getElementById('authModal');
  modal.classList.remove('active');
  
  // Clear form
  const form = document.getElementById('authForm');
  form.reset();
}

function switchAuthMode() {
  const modal = document.getElementById('authModal');
  const currentMode = modal.dataset.mode;
  const newMode = currentMode === 'login' ? 'signup' : 'login';
  
  closeModal();
  setTimeout(() => showAuthModal(newMode), 100);
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  
  const modal = document.getElementById('authModal');
  const mode = modal.dataset.mode;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (mode === 'signup' && password !== confirmPassword) {
    showNotification('Passwords do not match!', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: mode,
        email: email,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = data.user;
      isLoggedIn = true;
      localStorage.setItem('agroSevakUser', JSON.stringify(currentUser));
      
      updateAuthUI();
      closeModal();
      showNotification(mode === 'login' ? 'Login successful!' : 'Account created successfully!');
    } else {
      showNotification(data.message || 'Authentication failed', 'error');
    }
  } catch (error) {
    console.error('Auth error:', error);
    showNotification('Network error. Please try again.', 'error');
  }
}

function updateAuthUI() {
  const authButtons = document.getElementById('authButtons');
  const userProfile = document.getElementById('userProfile');
  const userName = document.getElementById('userName');
  
  if (isLoggedIn && currentUser) {
    authButtons.style.display = 'none';
    userProfile.style.display = 'flex';
    userName.textContent = currentUser.name || currentUser.email.split('@')[0];
  } else {
    authButtons.style.display = 'flex';
    userProfile.style.display = 'none';
  }
}

function logout() {
  currentUser = null;
  isLoggedIn = false;
  localStorage.removeItem('agroSevakUser');
  updateAuthUI();
  showNotification('Logged out successfully!');
}

// ===== SETTINGS =====
function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  const overlay = document.getElementById('settingsOverlay');
  
  panel.classList.toggle('active');
  overlay.classList.toggle('active');
}

function closeSettings() {
  const panel = document.getElementById('settingsPanel');
  const overlay = document.getElementById('settingsOverlay');
  
  panel.classList.remove('active');
  overlay.classList.remove('active');
}

function changeLanguage(language) {
  currentLanguage = language;
  updateLanguage();
  saveUserSettings();
}

function updateLanguage() {
  const elements = document.querySelectorAll('[data-key]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });
}

function changeTheme(theme) {
  currentTheme = theme;
  
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else if (theme === 'light') {
    document.body.classList.remove('dark-theme');
  } else {
    // System theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
  
  saveUserSettings();
}

function changeFontSize(size) {
  const root = document.documentElement;
  
  switch(size) {
    case 'small':
      root.style.fontSize = '14px';
      break;
    case 'large':
      root.style.fontSize = '18px';
      break;
    default:
      root.style.fontSize = '16px';
  }
  
  saveUserSettings();
}

function saveSettings() {
  saveUserSettings();
  showNotification('Settings saved successfully!');
  closeSettings();
}

function saveUserSettings() {
  const settings = {
    language: currentLanguage,
    theme: currentTheme,
    fontSize: document.getElementById('fontSize').value,
    notifications: document.getElementById('notifications').checked,
    notificationSound: document.getElementById('notificationSound').checked
  };
  
  localStorage.setItem('agroSevakSettings', JSON.stringify(settings));
}

function loadUserSettings() {
  const savedSettings = localStorage.getItem('agroSevakSettings');
  
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    
    // Apply language
    if (settings.language) {
      currentLanguage = settings.language;
      document.getElementById('languageSelect').value = settings.language;
      updateLanguage();
    }
    
    // Apply theme
    if (settings.theme) {
      document.getElementById('themeSelect').value = settings.theme;
      changeTheme(settings.theme);
    }
    
    // Apply font size
    if (settings.fontSize) {
      document.getElementById('fontSize').value = settings.fontSize;
      changeFontSize(settings.fontSize);
    }
    
    // Apply notification settings
    if (settings.notifications !== undefined) {
      document.getElementById('notifications').checked = settings.notifications;
    }
    
    if (settings.notificationSound !== undefined) {
      document.getElementById('notificationSound').checked = settings.notificationSound;
    }
  }
}

// ===== LANGUAGE SYSTEM =====
function initializeLanguageSystem() {
  updateLanguage();
}

// ===== THEME SYSTEM =====
function initializeThemeSystem() {
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme === 'system') {
      changeTheme('system');
    }
  });
}

// ===== DISEASE DETECTION =====
function initializeDragAndDrop() {
  const uploadArea = document.getElementById('uploadArea');
  
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleImageUpload(files[0]);
      }
    });
    
    uploadArea.addEventListener('click', () => {
      document.getElementById('imageInput').click();
    });
  }
}

function triggerFileInput() {
  document.getElementById('imageInput').click();
}

function analyzeDisease(event) {
  const file = event.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
}

function handleImageUpload(file) {
  const uploadArea = document.getElementById('uploadArea');
  const imagePreview = document.getElementById('imagePreview');
  const previewImage = document.getElementById('previewImage');
  
  // Create file reader
  const reader = new FileReader();
  
  reader.onload = function(e) {
    previewImage.src = e.target.result;
    uploadArea.style.display = 'none';
    imagePreview.style.display = 'block';
  };
  
  reader.readAsDataURL(file);
}

function clearImage() {
  const uploadArea = document.getElementById('uploadArea');
  const imagePreview = document.getElementById('imagePreview');
  const diseaseResult = document.getElementById('diseaseResult');
  const imageInput = document.getElementById('imageInput');
  
  uploadArea.style.display = 'block';
  imagePreview.style.display = 'none';
  diseaseResult.style.display = 'none';
  imageInput.value = '';
}

async function processImage() {
  const previewImage = document.getElementById('previewImage');
  const diseaseResult = document.getElementById('diseaseResult');
  const resultContent = document.getElementById('resultContent');
  
  if (!previewImage.src) return;
  
  // Show loading state
  resultContent.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Analyzing plant health...</p>
    </div>
  `;
  diseaseResult.style.display = 'block';
  
  try {
    // Convert image to base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;
    ctx.drawImage(previewImage, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    const response = await fetch('/api/analyze-disease', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        user_id: currentUser?.id
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayDiseaseResult(data.result);
    } else {
      resultContent.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Analysis failed: ${data.message}</p>
          <button class="btn-outline" onclick="processImage()">Try Again</button>
        </div>
      `;
    }
  } catch (error) {
    console.error('Disease analysis error:', error);
    resultContent.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Network error. Please check your connection and try again.</p>
        <button class="btn-outline" onclick="processImage()">Retry</button>
      </div>
    `;
  }
}

function displayDiseaseResult(result) {
  const resultContent = document.getElementById('resultContent');
  
  resultContent.innerHTML = `
    <div class="disease-analysis">
      <div class="analysis-header">
        <div class="confidence-badge ${result.confidence > 80 ? 'high' : result.confidence > 60 ? 'medium' : 'low'}">
          ${result.confidence}% Confidence
        </div>
        <div class="severity-badge ${result.severity}">
          ${result.severity} Severity
        </div>
      </div>
      
      <div class="disease-info">
        <h4>${result.disease_name}</h4>
        <p class="scientific-name">${result.scientific_name}</p>
        <p class="description">${result.description}</p>
      </div>
      
      <div class="recommendations">
        <h5><i class="fas fa-lightbulb"></i> Recommended Treatment</h5>
        <ul>
          ${result.treatments.map(treatment => `<li>${treatment}</li>`).join('')}
        </ul>
      </div>
      
      <div class="prevention-tips">
        <h5><i class="fas fa-shield-alt"></i> Prevention Tips</h5>
        <ul>
          ${result.prevention.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
      
      <div class="analysis-actions">
        <button class="btn-primary" onclick="saveAnalysisReport()">
          <i class="fas fa-save"></i> Save Report
        </button>
        <button class="btn-outline" onclick="shareAnalysis()">
          <i class="fas fa-share"></i> Share
        </button>
      </div>
    </div>
  `;
}

function saveAnalysisReport() {
  showNotification('Analysis report saved to your dashboard!');
}

function shareAnalysis() {
  if (navigator.share) {
    navigator.share({
      title: 'Plant Disease Analysis - Agro Sevak',
      text: 'Check out my plant health analysis from Agro Sevak',
      url: window.location.href
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showNotification('Link copied to clipboard!');
    });
  }
}

// ===== WEATHER FORECAST =====
async function getWeatherForecast() {
  const weatherOutput = document.getElementById('weatherOutput');
  
  // Show loading state
  weatherOutput.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Fetching weather data...</p>
    </div>
  `;
  
  try {
    // Get user's location
    const position = await getCurrentPosition();
    
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        user_id: currentUser?.id
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayWeatherForecast(data.weather);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    weatherOutput.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to fetch weather data. Please try again.</p>
        <button class="btn-outline" onclick="getWeatherForecast()">Retry</button>
      </div>
    `;
  }
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function displayWeatherForecast(weatherData) {
  const weatherOutput = document.getElementById('weatherOutput');
  
  weatherOutput.innerHTML = `
    <div class="weather-display">
      <div class="current-weather">
        <div class="weather-header">
          <div class="location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${weatherData.location}</span>
          </div>
          <div class="last-updated">
            Updated: ${new Date(weatherData.timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        <div class="weather-main">
          <div class="temperature">
            <span class="temp-value">${weatherData.current.temperature}°C</span>
            <div class="weather-icon">
              <i class="fas fa-${getWeatherIcon(weatherData.current.condition)}"></i>
            </div>
          </div>
          <div class="weather-details">
            <div class="condition">${weatherData.current.condition}</div>
            <div class="feels-like">Feels like ${weatherData.current.feels_like}°C</div>
          </div>
        </div>
        
        <div class="weather-stats">
          <div class="stat">
            <i class="fas fa-tint"></i>
            <span>Humidity</span>
            <span>${weatherData.current.humidity}%</span>
          </div>
          <div class="stat">
            <i class="fas fa-wind"></i>
            <span>Wind</span>
            <span>${weatherData.current.wind_speed} km/h</span>
          </div>
          <div class="stat">
            <i class="fas fa-cloud-rain"></i>
            <span>Rain Chance</span>
            <span>${weatherData.current.rain_chance}%</span>
          </div>
        </div>
      </div>
      
      <div class="forecast">
        <h5><i class="fas fa-calendar"></i> 5-Day Forecast</h5>
        <div class="forecast-grid">
          ${weatherData.forecast.map(day => `
            <div class="forecast-day">
              <div class="day">${new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</div>
              <i class="fas fa-${getWeatherIcon(day.condition)}"></i>
              <div class="temps">
                <span class="high">${day.high}°</span>
                <span class="low">${day.low}°</span>
              </div>
              <div class="rain">${day.rain_chance}%</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="farming-alerts">
        <h5><i class="fas fa-bell"></i> Farming Alerts</h5>
        <div class="alerts-list">
          ${weatherData.alerts.map(alert => `
            <div class="alert ${alert.type}">
              <i class="fas fa-${getAlertIcon(alert.type)}"></i>
              <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function getWeatherIcon(condition) {
  const iconMap = {
    'clear': 'sun',
    'sunny': 'sun',
    'partly cloudy': 'cloud-sun',
    'cloudy': 'cloud',
    'overcast': 'cloud',
    'rain': 'cloud-rain',
    'drizzle': 'cloud-drizzle',
    'thunderstorm': 'bolt',
    'snow': 'snowflake',
    'fog': 'smog',
    'mist': 'smog'
  };
  
  return iconMap[condition.toLowerCase()] || 'cloud';
}

function getAlertIcon(type) {
  const iconMap = {
    'warning': 'exclamation-triangle',
    'info': 'info-circle',
    'success': 'check-circle',
    'danger': 'exclamation-circle'
  };
  
  return iconMap[type] || 'bell';
}

// ===== ENHANCED MARKET INTELLIGENCE =====

// Global variables for market intelligence
let currentMarketData = null;
let userLocation = null;

// AI-powered crop search
async function performAIMarketSearch() {
  const cropInput = document.getElementById('cropSearchInput');
  const locationInput = document.getElementById('locationSearchInput');
  const mandiOutput = document.getElementById('mandiOutput');
  
  const cropQuery = cropInput.value.trim();
  const locationQuery = locationInput.value.trim();
  
  if (!cropQuery) {
    showNotification('Please enter a crop name to search', 'warning');
    cropInput.focus();
    return;
  }
  
  // Show AI processing state
  mandiOutput.innerHTML = `
    <div class="ai-processing-state">
      <div class="ai-brain-animation">
        <i class="fas fa-brain"></i>
        <div class="brain-waves">
          <div class="wave wave-1"></div>
          <div class="wave wave-2"></div>
          <div class="wave wave-3"></div>
        </div>
      </div>
      <h4>AI is analyzing market data...</h4>
      <p>Searching for ${cropQuery} prices ${locationQuery ? 'in ' + locationQuery : 'across India'}</p>
      <div class="ai-progress">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-steps">
          <div class="step active">Market Data</div>
          <div class="step">Price Analysis</div>
          <div class="step">AI Insights</div>
        </div>
      </div>
    </div>
  `;
  
  try {
    const response = await fetch('/api/ai-market-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crop: cropQuery,
        location: locationQuery,
        user_id: currentUser?.id
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentMarketData = data.results;
      displayAIMarketResults(data.results);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('AI market search error:', error);
    mandiOutput.innerHTML = `
      <div class="error-state">
        <i class="fas fa-robot"></i>
        <h4>AI Search Failed</h4>
        <p>Unable to analyze market data. Please try again or use Quick Rates.</p>
        <div class="error-actions">
          <button class="btn-primary" onclick="performAIMarketSearch()">
            <i class="fas fa-retry"></i> Retry AI Search
          </button>
          <button class="btn-outline" onclick="getMandiRates()">
            <i class="fas fa-bolt"></i> Quick Rates
          </button>
        </div>
      </div>
    `;
  }
}

// Quick crop search function
function searchCrop(cropName) {
  const cropInput = document.getElementById('cropSearchInput');
  cropInput.value = cropName;
  
  // Add visual feedback
  const cropCard = document.querySelector(`[data-crop="${cropName}"]`);
  cropCard.style.transform = 'scale(0.95)';
  setTimeout(() => {
    cropCard.style.transform = '';
  }, 150);
  
  // Perform search
  performAIMarketSearch();
}

// Location detection
async function detectUserLocation() {
  const locationInput = document.getElementById('locationSearchInput');
  const detectBtn = document.querySelector('.location-detect-btn');
  
  if (!navigator.geolocation) {
    showNotification('Geolocation is not supported by this browser', 'error');
    return;
  }
  
  // Show loading state
  detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  detectBtn.disabled = true;
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding to get location name
        const response = await fetch(`/api/reverse-geocode?lat=${latitude}&lng=${longitude}`);
        const data = await response.json();
        
        if (data.success) {
          locationInput.value = data.location;
          userLocation = { lat: latitude, lng: longitude, name: data.location };
          showNotification('Location detected successfully!', 'success');
        } else {
          throw new Error('Failed to get location name');
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        locationInput.value = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
        showNotification('Location detected, but unable to get place name', 'warning');
      }
      
      // Reset button
      detectBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
      detectBtn.disabled = false;
    },
    (error) => {
      console.error('Geolocation error:', error);
      showNotification('Unable to detect location. Please enter manually.', 'error');
      
      // Reset button
      detectBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
      detectBtn.disabled = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

// Display AI market results
function displayAIMarketResults(results) {
  const mandiOutput = document.getElementById('mandiOutput');
  
  mandiOutput.innerHTML = `
    <div class="ai-market-results">
      <div class="results-header">
        <div class="header-left">
          <h4><i class="fas fa-brain"></i> AI Market Analysis</h4>
          <p class="search-summary">
            Showing results for <strong>${results.crop}</strong>
            ${results.location ? ` in <strong>${results.location}</strong>` : ' across India'}
          </p>
        </div>
        <div class="header-right">
          <div class="ai-confidence">
            <i class="fas fa-chart-line"></i>
            <span>Confidence: ${results.confidence}%</span>
          </div>
        </div>
      </div>
      
      <div class="market-insights-grid">
        <div class="insight-card price-trends">
          <div class="insight-header">
            <i class="fas fa-trending-up"></i>
            <h5>Price Trends</h5>
          </div>
          <div class="trend-chart">
            <div class="current-price">
              <span class="price">₹${results.averagePrice}</span>
              <span class="unit">per ${results.unit}</span>
            </div>
            <div class="price-change ${results.priceChange >= 0 ? 'positive' : 'negative'}">
              <i class="fas fa-${results.priceChange >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
              ${Math.abs(results.priceChange)}% this week
            </div>
          </div>
        </div>
        
        <div class="insight-card market-locations">
          <div class="insight-header">
            <i class="fas fa-map-marker-alt"></i>
            <h5>Best Markets</h5>
          </div>
          <div class="locations-list">
            ${results.topMarkets.map(market => `
              <div class="location-item">
                <div class="location-info">
                  <span class="market-name">${market.name}</span>
                  <span class="market-state">${market.state}</span>
                </div>
                <div class="location-price">
                  <span class="price">₹${market.price}</span>
                  <span class="distance">${market.distance || 'N/A'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="insight-card ai-recommendations">
          <div class="insight-header">
            <i class="fas fa-lightbulb"></i>
            <h5>AI Recommendations</h5>
          </div>
          <div class="recommendations-list">
            ${results.recommendations.map(rec => `
              <div class="recommendation-item">
                <i class="fas fa-${getRecommendationIcon(rec.type)}"></i>
                <div class="rec-content">
                  <h6>${rec.title}</h6>
                  <p>${rec.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="detailed-rates">
        <div class="rates-header">
          <h5><i class="fas fa-table"></i> Detailed Market Rates</h5>
          <div class="view-options">
            <button class="view-btn active" onclick="switchView('grid')">
              <i class="fas fa-th"></i> Grid
            </button>
            <button class="view-btn" onclick="switchView('list')">
              <i class="fas fa-list"></i> List
            </button>
          </div>
        </div>
        
        <div class="rates-grid" id="ratesGrid">
          ${results.markets.map(market => `
            <div class="enhanced-rate-card">
              <div class="market-header">
                <div class="market-info">
                  <h6>${market.name}</h6>
                  <span class="market-location">${market.location}</span>
                </div>
                <div class="market-status ${market.status}">
                  <i class="fas fa-circle"></i>
                  ${market.status}
                </div>
              </div>
              
              <div class="price-display">
                <div class="current-price">
                  <span class="price">₹${market.price}</span>
                  <span class="unit">per ${market.unit}</span>
                </div>
                <div class="price-change ${market.change >= 0 ? 'positive' : 'negative'}">
                  <i class="fas fa-${market.change >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                  ${Math.abs(market.change)}%
                </div>
              </div>
              
              <div class="market-details">
                <div class="detail-item">
                  <span class="label">Last Updated:</span>
                  <span class="value">${market.lastUpdated}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Volume:</span>
                  <span class="value">${market.volume} tons</span>
                </div>
              </div>
              
              <div class="card-actions">
                <button class="action-btn" onclick="setAlert('${market.name}', '${results.crop}')">
                  <i class="fas fa-bell"></i> Set Alert
                </button>
                <button class="action-btn" onclick="shareMarket('${market.name}')">
                  <i class="fas fa-share"></i> Share
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="results-actions">
        <button class="btn-primary" onclick="subscribeToAlerts()">
          <i class="fas fa-bell"></i> Enable Price Alerts
        </button>
        <button class="btn-outline" onclick="exportMarketData()">
          <i class="fas fa-download"></i> Export Data
        </button>
        <button class="btn-outline" onclick="shareResults()">
          <i class="fas fa-share-alt"></i> Share Results
        </button>
      </div>
    </div>
  `;
}

// Traditional mandi rates function (enhanced)
async function getMandiRates() {
  const mandiOutput = document.getElementById('mandiOutput');
  
  // Show loading state
  mandiOutput.innerHTML = `
    <div class="loading-state">
      <div class="loading-animation">
        <div class="loading-spinner"></div>
        <div class="loading-bars">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
      <h4>Loading Market Prices...</h4>
      <p>Fetching latest rates from mandis across India</p>
    </div>
  `;
  
  try {
    const response = await fetch('/api/mandi-rates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayMandiRates(data.rates);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Mandi rates fetch error:', error);
    mandiOutput.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h4>Unable to Load Market Prices</h4>
        <p>Failed to fetch market prices. Please try again.</p>
        <button class="btn-outline" onclick="getMandiRates()">
          <i class="fas fa-retry"></i> Retry
        </button>
      </div>
    `;
  }
}

function displayMandiRates(ratesData) {
  const mandiOutput = document.getElementById('mandiOutput');
  
  mandiOutput.innerHTML = `
    <div class="mandi-display">
      <div class="mandi-header">
        <h5><i class="fas fa-chart-line"></i> Today's Market Prices</h5>
        <div class="last-updated">
          Updated: ${new Date(ratesData.timestamp).toLocaleString()}
        </div>
      </div>
      
      <div class="rates-grid">
        ${ratesData.commodities.map(commodity => `
          <div class="rate-card">
            <div class="commodity-info">
              <div class="commodity-name">${commodity.name}</div>
              <div class="market-name">${commodity.market}</div>
            </div>
            <div class="price-info">
              <div class="current-price">₹${commodity.price}</div>
              <div class="price-unit">per ${commodity.unit}</div>
              <div class="price-change ${commodity.change >= 0 ? 'positive' : 'negative'}">
                <i class="fas fa-${commodity.change >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                ${Math.abs(commodity.change).toFixed(2)}%
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="market-insights">
        <h5><i class="fas fa-lightbulb"></i> Market Insights</h5>
        <div class="insights-list">
          ${ratesData.insights.map(insight => `
            <div class="insight">
              <i class="fas fa-${insight.type === 'positive' ? 'trending-up' : insight.type === 'negative' ? 'trending-down' : 'info-circle'}"></i>
              <span>${insight.message}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="mandi-actions">
        <button class="btn-primary" onclick="subscribeToAlerts()">
          <i class="fas fa-bell"></i> Price Alerts
        </button>
        <button class="btn-outline" onclick="exportPrices()">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    </div>
  `;
}

function subscribeToAlerts() {
  showNotification('Price alerts activated! You will be notified of significant price changes.');
}

function exportPrices() {
  showNotification('Market prices exported successfully!');
}

// ===== HELPER FUNCTIONS FOR MARKET INTELLIGENCE =====

function getRecommendationIcon(type) {
  const iconMap = {
    'sell': 'hand-holding-usd',
    'buy': 'shopping-cart',
    'wait': 'clock',
    'alert': 'exclamation-triangle',
    'location': 'map-marker-alt',
    'timing': 'calendar-alt'
  };
  return iconMap[type] || 'info-circle';
}

function switchView(viewType) {
  const gridView = document.getElementById('ratesGrid');
  const viewButtons = document.querySelectorAll('.view-btn');
  
  // Update button states
  viewButtons.forEach(btn => btn.classList.remove('active'));
  event.target.closest('.view-btn').classList.add('active');
  
  // Apply view styles
  if (viewType === 'list') {
    gridView.classList.add('list-view');
  } else {
    gridView.classList.remove('list-view');
  }
}

function setAlert(marketName, crop) {
  showNotification(`Price alert set for ${crop} in ${marketName}`, 'success');
}

function shareMarket(marketName) {
  if (navigator.share) {
    navigator.share({
      title: 'Agro Sevak - Market Price',
      text: `Check out the current market prices for ${marketName}`,
      url: window.location.href
    });
  } else {
    // Fallback for browsers that don't support native sharing
    navigator.clipboard.writeText(window.location.href);
    showNotification('Market link copied to clipboard!', 'success');
  }
}

function exportMarketData() {
  if (!currentMarketData) {
    showNotification('No market data to export', 'warning');
    return;
  }
  
  // Create CSV data
  const csvData = [
    ['Market', 'Location', 'Price', 'Unit', 'Change %', 'Status', 'Last Updated'],
    ...currentMarketData.markets.map(market => [
      market.name,
      market.location,
      market.price,
      market.unit,
      market.change,
      market.status,
      market.lastUpdated
    ])
  ];
  
  const csv = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `market-prices-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification('Market data exported successfully!', 'success');
}

function shareResults() {
  if (navigator.share) {
    navigator.share({
      title: 'Agro Sevak - AI Market Analysis',
      text: 'Check out this comprehensive market analysis powered by AI',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Results link copied to clipboard!', 'success');
  }
}

// ===== VOICE ASSISTANT =====
function initializeVoiceRecognition() {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    
    recognition.onstart = function() {
      isVoiceListening = true;
      updateVoiceUI();
    };
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      handleVoiceInput(transcript);
    };
    
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      isVoiceListening = false;
      updateVoiceUI();
      showNotification('Voice recognition error. Please try again.', 'error');
    };
    
    recognition.onend = function() {
      isVoiceListening = false;
      updateVoiceUI();
    };
  }
}

function startVoiceAssistant() {
  if (!recognition) {
    showNotification('Voice recognition not supported in your browser.', 'error');
    return;
  }
  
  if (isVoiceListening) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

function updateVoiceUI() {
  const voiceBtn = document.getElementById('voiceBtn');
  const voiceOutput = document.getElementById('voiceOutput');
  
  if (isVoiceListening) {
    voiceBtn.innerHTML = `
      <i class="fas fa-stop"></i>
      <span>Stop Listening</span>
    `;
    voiceBtn.classList.add('listening');
    
    voiceOutput.innerHTML = `
      <div class="voice-listening">
        <div class="voice-indicator">
          <div class="voice-wave"></div>
          <div class="voice-wave"></div>
          <div class="voice-wave"></div>
        </div>
        <p>Listening... Speak now</p>
      </div>
    `;
  } else {
    voiceBtn.innerHTML = `
      <i class="fas fa-microphone"></i>
      <span>Start Voice Assistant</span>
    `;
    voiceBtn.classList.remove('listening');
  }
}

async function handleVoiceInput(transcript) {
  const voiceOutput = document.getElementById('voiceOutput');
  
  voiceOutput.innerHTML = `
    <div class="voice-conversation">
      <div class="user-message">
        <i class="fas fa-user"></i>
        <span>"${transcript}"</span>
      </div>
      <div class="loading-response">
        <div class="loading-spinner"></div>
        <span>Processing your query...</span>
      </div>
    </div>
  `;
  
  try {
    const response = await fetch('/api/voice-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: transcript,
        language: currentLanguage,
        user_id: currentUser?.id
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayVoiceResponse(transcript, data.response);
      
      // Text-to-speech response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Voice assistant error:', error);
    voiceOutput.innerHTML = `
      <div class="voice-conversation">
        <div class="user-message">
          <i class="fas fa-user"></i>
          <span>"${transcript}"</span>
        </div>
        <div class="error-response">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Sorry, I couldn't process your request. Please try again.</span>
        </div>
      </div>
    `;
  }
}

function displayVoiceResponse(query, response) {
  const voiceOutput = document.getElementById('voiceOutput');
  
  voiceOutput.innerHTML = `
    <div class="voice-conversation">
      <div class="user-message">
        <i class="fas fa-user"></i>
        <span>"${query}"</span>
      </div>
      <div class="assistant-response">
        <i class="fas fa-robot"></i>
        <span>${response}</span>
      </div>
      <div class="voice-actions">
        <button class="btn-outline" onclick="startVoiceAssistant()">
          <i class="fas fa-microphone"></i> Ask Another Question
        </button>
      </div>
    </div>
  `;
}

// ===== CROP CALENDAR =====
function showLocationModal() {
  const modal = document.getElementById('locationModal');
  modal.classList.add('active');
}

function closeLocationModal() {
  const modal = document.getElementById('locationModal');
  modal.classList.remove('active');
  
  // Clear form
  const form = document.getElementById('locationForm');
  form.reset();
}

async function handleLocationSubmit(e) {
  e.preventDefault();
  
  const state = document.getElementById('stateSelect').value;
  const district = document.getElementById('districtInput').value;
  const soilType = document.getElementById('soilSelect').value;
  const cropType = document.getElementById('cropSelect').value;
  
  if (!state || !district || !soilType || !cropType) {
    showNotification('Please fill all fields', 'error');
    return;
  }
  
  closeLocationModal();
  
  const chartOutput = document.getElementById('chartOutput');
  
  // Show loading state
  chartOutput.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Generating personalized crop calendar...</p>
    </div>
  `;
  
  try {
    const response = await fetch('/api/crop-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: state,
        district: district,
        soil_type: soilType,
        crop_type: cropType,
        user_id: currentUser?.id
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayCropCalendar(data.calendar);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Crop calendar error:', error);
    chartOutput.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to generate crop calendar. Please try again.</p>
        <button class="btn-outline" onclick="showLocationModal()">Try Again</button>
      </div>
    `;
  }
}

function displayCropCalendar(calendarData) {
  const chartOutput = document.getElementById('chartOutput');
  
  chartOutput.innerHTML = `
    <div class="calendar-display">
      <div class="calendar-header">
        <h5><i class="fas fa-calendar-alt"></i> Personalized Crop Calendar</h5>
        <div class="calendar-info">
          <span>${calendarData.crop} - ${calendarData.location}</span>
        </div>
      </div>
      
      <div class="calendar-overview">
        <div class="overview-stats">
          <div class="stat">
            <i class="fas fa-clock"></i>
            <span>Growth Period</span>
            <span>${calendarData.growth_period} days</span>
          </div>
          <div class="stat">
            <i class="fas fa-seedling"></i>
            <span>Best Planting</span>
            <span>${calendarData.best_planting}</span>
          </div>
          <div class="stat">
            <i class="fas fa-harvest"></i>
            <span>Harvest Time</span>
            <span>${calendarData.harvest_time}</span>
          </div>
        </div>
      </div>
      
      <div class="calendar-timeline">
        <h6><i class="fas fa-timeline"></i> Monthly Activities</h6>
        <div class="timeline">
          ${calendarData.activities.map((activity, index) => `
            <div class="timeline-item">
              <div class="timeline-marker">${index + 1}</div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h6>${activity.month}</h6>
                  <span class="activity-type">${activity.type}</span>
                </div>
                <div class="timeline-description">${activity.description}</div>
                <div class="timeline-tasks">
                  ${activity.tasks.map(task => `
                    <div class="task">
                      <i class="fas fa-check-circle"></i>
                      <span>${task}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="calendar-recommendations">
        <h6><i class="fas fa-lightbulb"></i> Recommendations</h6>
        <div class="recommendations-grid">
          ${calendarData.recommendations.map(rec => `
            <div class="recommendation">
              <i class="fas fa-${rec.icon}"></i>
              <div class="rec-content">
                <h6>${rec.title}</h6>
                <p>${rec.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="calendar-actions">
        <button class="btn-primary" onclick="downloadCalendar()">
          <i class="fas fa-download"></i> Download PDF
        </button>
        <button class="btn-outline" onclick="scheduleReminders()">
          <i class="fas fa-bell"></i> Set Reminders
        </button>
      </div>
    </div>
  `;
}

function downloadCalendar() {
  showNotification('Calendar PDF downloaded successfully!');
}

function scheduleReminders() {
  showNotification('Calendar reminders have been set!');
}

// ===== SMART ALERTS =====
async function showSmartAlerts() {
  const alertsOutput = document.getElementById('alertsOutput');
  
  // Show loading state
  alertsOutput.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Checking smart alerts...</p>
    </div>
  `;
  
  try {
    const response = await fetch('/api/smart-alerts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      displaySmartAlerts(data.alerts);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Smart alerts error:', error);
    alertsOutput.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to fetch alerts. Please try again.</p>
        <button class="btn-outline" onclick="showSmartAlerts()">Retry</button>
      </div>
    `;
  }
}

function displaySmartAlerts(alertsData) {
  const alertsOutput = document.getElementById('alertsOutput');
  
  if (alertsData.length === 0) {
    alertsOutput.innerHTML = `
      <div class="no-alerts">
        <i class="fas fa-check-circle"></i>
        <h6>All Good!</h6>
        <p>No critical alerts at the moment. Your farm is in good condition.</p>
      </div>
    `;
    return;
  }
  
  alertsOutput.innerHTML = `
    <div class="alerts-display">
      <div class="alerts-header">
        <h5><i class="fas fa-shield-alt"></i> Smart Alerts</h5>
        <div class="alerts-count">${alertsData.length} Active Alert${alertsData.length > 1 ? 's' : ''}</div>
      </div>
      
      <div class="alerts-list">
        ${alertsData.map(alert => `
          <div class="alert-card ${alert.priority}">
            <div class="alert-icon">
              <i class="fas fa-${getAlertIcon(alert.type)}"></i>
            </div>
            <div class="alert-content">
              <div class="alert-header">
                <h6>${alert.title}</h6>
                <span class="alert-time">${timeAgo(alert.timestamp)}</span>
              </div>
              <p class="alert-message">${alert.message}</p>
              ${alert.actions ? `
                <div class="alert-actions">
                  ${alert.actions.map(action => `
                    <button class="btn-outline btn-sm" onclick="performAlertAction('${action.id}')">
                      <i class="fas fa-${action.icon}"></i> ${action.label}
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            <button class="alert-dismiss" onclick="dismissAlert('${alert.id}')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `).join('')}
      </div>
      
      <div class="alerts-footer">
        <button class="btn-outline" onclick="markAllAlertsRead()">
          <i class="fas fa-check-double"></i> Mark All Read
        </button>
        <button class="btn-primary" onclick="configureAlerts()">
          <i class="fas fa-cog"></i> Configure Alerts
        </button>
      </div>
    </div>
  `;
}

function timeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function performAlertAction(actionId) {
  showNotification('Action performed successfully!');
}

function dismissAlert(alertId) {
  showNotification('Alert dismissed');
  // Remove the alert from UI
  document.querySelector(`[onclick="dismissAlert('${alertId}')"]`).closest('.alert-card').remove();
}

function markAllAlertsRead() {
  showNotification('All alerts marked as read');
}

function configureAlerts() {
  showNotification('Alert configuration opened');
}

// ===== FLOATING ACTION BUTTON =====
function initializeFAB() {
  const mainFab = document.getElementById('mainFab');
  const fabOptions = document.getElementById('fabOptions');
  
  mainFab.addEventListener('click', () => {
    fabExpanded = !fabExpanded;
    
    if (fabExpanded) {
      fabOptions.classList.add('active');
      mainFab.querySelector('i').style.transform = 'rotate(45deg)';
    } else {
      fabOptions.classList.remove('active');
      mainFab.querySelector('i').style.transform = 'rotate(0deg)';
    }
  });
  
  // Close FAB when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.fab-container') && fabExpanded) {
      fabOptions.classList.remove('active');
      mainFab.querySelector('i').style.transform = 'rotate(0deg)';
      fabExpanded = false;
    }
  });
}

// ===== EVENT HANDLERS FOR OVERLAYS =====
document.addEventListener('click', (e) => {
  // Close settings when clicking overlay
  if (e.target.classList.contains('settings-overlay')) {
    closeSettings();
  }
  
  // Close modals when clicking overlay
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
    closeLocationModal();
  }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Use Intersection Observer for better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: '50px'
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

// Observe elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
    animationObserver.observe(el);
  });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  showNotification('Network error. Please check your connection.', 'error');
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.showAuthModal = showAuthModal;
window.closeModal = closeModal;
window.switchAuthMode = switchAuthMode;
window.toggleSettings = toggleSettings;
window.changeLanguage = changeLanguage;
window.changeTheme = changeTheme;
window.changeFontSize = changeFontSize;
window.saveSettings = saveSettings;
window.logout = logout;
window.showLocationModal = showLocationModal;
window.closeLocationModal = closeLocationModal;
window.triggerFileInput = triggerFileInput;
window.analyzeDisease = analyzeDisease;
window.clearImage = clearImage;
window.processImage = processImage;
window.getWeatherForecast = getWeatherForecast;
window.getMandiRates = getMandiRates;
window.startVoiceAssistant = startVoiceAssistant;
window.showSmartAlerts = showSmartAlerts;
window.scrollToSection = scrollToSection;
window.initializeApp = initializeApp;
window.performAIMarketSearch = performAIMarketSearch;
window.searchCrop = searchCrop;
window.detectUserLocation = detectUserLocation;
window.switchView = switchView;
window.setAlert = setAlert;
window.shareMarket = shareMarket;
window.exportMarketData = exportMarketData;
window.shareResults = shareResults;

console.log('Agro Sevak JavaScript loaded successfully');
