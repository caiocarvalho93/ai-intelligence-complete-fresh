// 🔧 CHINA POPUP FIX TEST
// Run this in the browser console to test the popup fix

console.log('🔧 Testing China Popup Fix...');

// Function to simulate clicking on China with improved error handling
const testChinaPopupFix = () => {
  console.log('🇨🇳 Simulating China click with improved error handling...');
  
  // Check if we're on the right page
  if (!window.location.pathname.includes('dashboard') && !window.location.pathname === '/') {
    console.log('⚠️ Navigate to the dashboard first to test the popup');
    return;
  }
  
  // Look for China in the leaderboard
  const chinaElements = Array.from(document.querySelectorAll('*')).filter(el => 
    el.textContent && (el.textContent.includes('China') || el.textContent.includes('🇨🇳'))
  );
  
  if (chinaElements.length > 0) {
    console.log(`✅ Found ${chinaElements.length} China elements`);
    
    // Try to find the clickable China element
    const clickableChina = chinaElements.find(el => {
      const style = window.getComputedStyle(el);
      return style.cursor === 'pointer' || el.onclick || el.addEventListener;
    });
    
    if (clickableChina) {
      console.log('🎯 Found clickable China element, simulating click...');
      clickableChina.click();
      
      // Monitor for popup appearance
      setTimeout(() => {
        const popup = document.querySelector('[style*="position: fixed"][style*="z-index: 2000"]');
        if (popup) {
          console.log('✅ Popup appeared successfully!');
          
          // Monitor for 10 seconds to see if it stays open
          let checkCount = 0;
          const monitorInterval = setInterval(() => {
            checkCount++;
            const stillThere = document.querySelector('[style*="position: fixed"][style*="z-index: 2000"]');
            
            if (!stillThere) {
              console.log(`❌ Popup disappeared after ${checkCount * 500}ms`);
              clearInterval(monitorInterval);
            } else if (checkCount >= 20) { // 10 seconds
              console.log('✅ Popup stayed open for 10+ seconds - FIX SUCCESSFUL!');
              clearInterval(monitorInterval);
            }
          }, 500);
        } else {
          console.log('❌ Popup did not appear');
        }
      }, 1000);
    } else {
      console.log('❌ Could not find clickable China element');
    }
  } else {
    console.log('❌ Could not find China elements on page');
  }
};

// Function to check current popup state
const checkPopupState = () => {
  const popup = document.querySelector('[style*="position: fixed"][style*="z-index: 2000"]');
  if (popup) {
    console.log('✅ Popup is currently open');
    
    // Check for error messages
    const errorElements = popup.querySelectorAll('*');
    const hasError = Array.from(errorElements).some(el => 
      el.textContent && (
        el.textContent.includes('error') || 
        el.textContent.includes('failed') || 
        el.textContent.includes('unavailable')
      )
    );
    
    if (hasError) {
      console.log('⚠️ Popup contains error messages');
    } else {
      console.log('✅ Popup appears to be working normally');
    }
  } else {
    console.log('❌ No popup currently open');
  }
};

// Make functions available globally
window.testChinaPopupFix = testChinaPopupFix;
window.checkPopupState = checkPopupState;

console.log('🔧 China Popup Fix Test loaded!');
console.log('📋 Available commands:');
console.log('  - testChinaPopupFix() - Test clicking on China');
console.log('  - checkPopupState() - Check current popup state');

// Auto-run the test if we detect we're on the right page
if (document.readyState === 'complete') {
  setTimeout(() => {
    console.log('🚀 Auto-running China popup test...');
    testChinaPopupFix();
  }, 2000);
} else {
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('🚀 Auto-running China popup test...');
      testChinaPopupFix();
    }, 2000);
  });
}