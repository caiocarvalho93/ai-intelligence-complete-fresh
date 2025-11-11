/**
 * 🌍 CAI Universal Translation - Complete React Example
 * 
 * This is a complete working example showing how to integrate
 * CAI's translation system into a React application.
 * 
 * Features demonstrated:
 * - Complete app translation
 * - Beautiful language selector
 * - ONE LOVE appreciation system
 * - Professional UI design
 * - Mobile responsive layout
 * 
 * @author CAI
 */

import React from 'react';
import { LanguageProvider, CAILanguageSelector, TranslatedText } from '../packages/react/CAITranslationSystem';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        {/* Header Section */}
        <header className="app-header">
          <div className="container">
            <nav className="navbar">
              <div className="logo">
                <h1><TranslatedText>My Amazing App</TranslatedText></h1>
              </div>
              <ul className="nav-links">
                <li><a href="#home"><TranslatedText>Home</TranslatedText></a></li>
                <li><a href="#about"><TranslatedText>About</TranslatedText></a></li>
                <li><a href="#services"><TranslatedText>Services</TranslatedText></a></li>
                <li><a href="#contact"><TranslatedText>Contact</TranslatedText></a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                <TranslatedText>Welcome to the Future of Communication</TranslatedText>
              </h1>
              <p className="hero-subtitle">
                <TranslatedText>
                  Experience seamless translation across 50+ languages with CAI's 
                  revolutionary translation system. Connect with the world instantly.
                </TranslatedText>
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary">
                  <TranslatedText>Get Started</TranslatedText>
                </button>
                <button className="btn btn-secondary">
                  <TranslatedText>Learn More</TranslatedText>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">
              <TranslatedText>Amazing Features</TranslatedText>
            </h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h3><TranslatedText>50+ Languages</TranslatedText></h3>
                <p>
                  <TranslatedText>
                    Support for all major world languages with native names and beautiful flag emojis.
                  </TranslatedText>
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3><TranslatedText>Lightning Fast</TranslatedText></h3>
                <p>
                  <TranslatedText>
                    Average response time under 200ms with smart caching for optimal performance.
                  </TranslatedText>
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3><TranslatedText>Beautiful Design</TranslatedText></h3>
                <p>
                  <TranslatedText>
                    Professional glassmorphism UI that enhances your app's visual appeal.
                  </TranslatedText>
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3><TranslatedText>Mobile Ready</TranslatedText></h3>
                <p>
                  <TranslatedText>
                    Responsive design that works perfectly on all devices and screen sizes.
                  </TranslatedText>
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🆓</div>
                <h3><TranslatedText>100% Free</TranslatedText></h3>
                <p>
                  <TranslatedText>
                    No API keys, no registration, no limits. CAI's gift to the developer community.
                  </TranslatedText>
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💝</div>
                <h3><TranslatedText>ONE LOVE</TranslatedText></h3>
                <p>
                  <TranslatedText>
                    Show appreciation to CAI for creating this amazing translation system.
                  </TranslatedText>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <div className="container">
            <h2 className="section-title">
              <TranslatedText>What Developers Say</TranslatedText>
            </h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  <TranslatedText>
                    "CAI's translation system transformed our e-commerce platform. 
                    We now serve customers in 30+ countries seamlessly!"
                  </TranslatedText>
                </p>
                <div className="testimonial-author">
                  <strong><TranslatedText>Sarah Johnson</TranslatedText></strong>
                  <span><TranslatedText>Lead Developer, TechCorp</TranslatedText></span>
                </div>
              </div>
              
              <div className="testimonial-card">
                <p className="testimonial-text">
                  <TranslatedText>
                    "The integration was incredibly easy. Copy, paste, and boom - 
                    our SaaS app speaks every language. Amazing work, CAI!"
                  </TranslatedText>
                </p>
                <div className="testimonial-author">
                  <strong><TranslatedText>Miguel Rodriguez</TranslatedText></strong>
                  <span><TranslatedText>CTO, StartupXYZ</TranslatedText></span>
                </div>
              </div>
              
              <div className="testimonial-card">
                <p className="testimonial-text">
                  <TranslatedText>
                    "The ONE LOVE philosophy really resonates with our team. 
                    This isn't just code - it's a bridge between cultures."
                  </TranslatedText>
                </p>
                <div className="testimonial-author">
                  <strong><TranslatedText>Yuki Tanaka</TranslatedText></strong>
                  <span><TranslatedText>Product Manager, GlobalTech</TranslatedText></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">
                <TranslatedText>Ready to Connect the World?</TranslatedText>
              </h2>
              <p className="cta-subtitle">
                <TranslatedText>
                  Join thousands of developers using CAI's translation system to make 
                  the web more accessible and inclusive for everyone.
                </TranslatedText>
              </p>
              <button className="btn btn-primary btn-large">
                <TranslatedText>Start Translating Now</TranslatedText>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3><TranslatedText>CAI Translation</TranslatedText></h3>
                <p>
                  <TranslatedText>
                    Making the web multilingual, one app at a time. 
                    Travel the world through languages.
                  </TranslatedText>
                </p>
              </div>
              
              <div className="footer-section">
                <h4><TranslatedText>Quick Links</TranslatedText></h4>
                <ul>
                  <li><a href="#api"><TranslatedText>API Documentation</TranslatedText></a></li>
                  <li><a href="#examples"><TranslatedText>Examples</TranslatedText></a></li>
                  <li><a href="#support"><TranslatedText>Support</TranslatedText></a></li>
                  <li><a href="#github"><TranslatedText>GitHub</TranslatedText></a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4><TranslatedText>Languages</TranslatedText></h4>
                <p>
                  <TranslatedText>
                    50+ languages supported including English, Spanish, French, 
                    German, Chinese, Japanese, Arabic, and many more.
                  </TranslatedText>
                </p>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>
                <TranslatedText>
                  Made with ❤️ by CAI • ONE LOVE - Connecting the world through languages
                </TranslatedText>
              </p>
            </div>
          </div>
        </footer>

        {/* CAI Language Selector - Automatically positioned */}
        <CAILanguageSelector />
      </div>
    </LanguageProvider>
  );
}

export default App;