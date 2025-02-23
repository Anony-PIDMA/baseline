// src/map.js
export function loadBaiduMapScript(ak) {
    return new Promise((resolve, reject) => {
      if (typeof BMap !== 'undefined') {
        resolve(BMap);
        return;
      }
  
      window.onBMapCallback = () => {
        resolve(BMap);
      };
  
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=onBMapCallback`;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }