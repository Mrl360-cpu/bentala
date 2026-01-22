// --- CONFIGURATION ---
const GUIDE_STEPS = [
  { text: "Welcome to the new Bentala Mapalus experience.", target: null },
  { text: "We've modernized our platform to better serve the environment.", target: ".logo" },
  { text: "Try our new BenMind AI for any questions!", target: "#assistant-avatar" }
];
let currentStep = 0;

// --- RADICAL PAGE TRANSITIONS ---
function initTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) overlay.classList.remove('active');
  });

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && !link.hasAttribute('target')) {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 800);
      }
    });
  });
}

// --- BENMIND AI & ASSISTANT ---
function initAssistant() {
  const guide = document.getElementById('assistant-guide');
  const textEl = document.getElementById('assistant-text');
  const nextBtn = document.getElementById('assistant-next');
  const avatar = document.getElementById('assistant-avatar');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');

  if (!guide) return;

  // Show guide bubble if first time
  if (!localStorage.getItem('bentala_guide_shown')) {
    const bubble = document.getElementById('speech-bubble');
    if (bubble) {
      setTimeout(() => bubble.style.display = 'block', 2000);
    }

    nextBtn.addEventListener('click', () => {
      currentStep++;
      if (currentStep < GUIDE_STEPS.length) {
        textEl.innerText = GUIDE_STEPS[currentStep].text;
      } else {
        bubble.style.display = 'none';
        localStorage.setItem('bentala_guide_shown', 'true');
      }
    });
  }

  avatar.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
  });

  closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  initBenMindChat();
}

const GEMINI_API_KEY = "AIzaSyAFVRw3xWM5X2prm3l7TIDjVNR-lt-da44";

function initBenMindChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messagesContainer = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('typing-indicator');

  if (!input || !sendBtn) return;

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function getGeminiResponse(userText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `You are BenMind, the expert eco-assistant for "Bentala Mapalus" in North Sulawesi. 
    Programs: Bibit Gratis, Coastal Cleanup, Green Education. 
    Mission: Environmental conservation. Style: Friendly, helpful, uses emojis. 
    User message: ${userText}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) throw new Error("API Connection Failed");
      const data = await response.json();

      if (data && data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid structure");
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Waduh, koneksi BenMind sedikit terganggu. Coba tanya lagi sebentar ya! 🌿";
    }
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Easter Egg: ZCP Creative Studio
    if (text.toLowerCase() === 'zcp creative studio') {
      typingIndicator.style.display = 'block';
      setTimeout(() => {
        addMessage("Wah! Kamu menemukan kunci rahasia ZCP Creative Studio. Membuka gerbang rahasia... 🚀", 'bot');
        setTimeout(() => {
          window.location.href = 'studio.html';
        }, 2000);
      }, 1000);
      return;
    }

    typingIndicator.style.display = 'block';

    try {
      const botResponse = await getGeminiResponse(text);
      typingIndicator.style.display = 'none';
      addMessage(botResponse, 'bot');
    } catch (err) {
      typingIndicator.style.display = 'none';
      addMessage("Maaf, ada kendala teknis. Silakan coba lagi.", 'bot');
    }
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
}

// --- WOW SCROLL REVEAL ---
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-wow').forEach(el => observer.observe(el));
}

// --- HERO SLIDER ANIMATION ---
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
  initTransitions();
  initAssistant();
  initScrollReveal();
  initHeroSlider();
});
