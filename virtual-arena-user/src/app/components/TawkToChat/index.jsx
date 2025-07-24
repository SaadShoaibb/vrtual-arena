'use client'
import { useEffect } from 'react'

const TawkToChat = () => {
  useEffect(() => {
    // Initialize Tawk.to chat widget
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    
    (function(){
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/688272a32f66bc191640c585/1j0uovjqa';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Optional: Configure Tawk.to settings
    Tawk_API.onLoad = function(){
      console.log('Tawk.to chat widget loaded successfully');
    };

    // Cleanup function to remove script when component unmounts
    return () => {
      // Remove Tawk.to widget if it exists
      const tawkScript = document.querySelector('script[src*="embed.tawk.to"]');
      if (tawkScript) {
        tawkScript.remove();
      }
      
      // Remove Tawk.to widget container
      const tawkWidget = document.getElementById('tawk-widget');
      if (tawkWidget) {
        tawkWidget.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default TawkToChat;
