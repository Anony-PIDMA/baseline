export default function getDeviceInfo() {
    // This is a mock implementation. You can replace this with actual APIs
  
    // Sample apps (replace this with actual logic to get installed apps)
    const apps = [
        { name: 'WeChat' }, // The most popular messaging and social app in China [^40^]
        { name: 'Alipay' }, // Leading mobile payment platform [^41^]
        { name: 'Didi Chuxing' }, // Popular ride-hailing app [^40^]
        { name: 'Taobao' }, // China's largest e-commerce platform [^41^]
        { name: 'Baidu Maps' }, // Comprehensive navigation app [^43^]
        { name: 'Gaode Maps' }, // Another popular navigation app [^43^]
        { name: 'Meituan' }, // Food delivery and local services app [^40^]
        { name: 'QQ' }, // Another popular communication app [^43^]
        { name: 'Douyin' }, // Short video app (TikTok in China) [^41^]
        { name: 'JD.com' }, // E-commerce platform [^43^]
        { name: 'Ele.me' }, // Food delivery app [^43^]
        { name: 'Meituan Waimai' }, // Another food delivery app [^43^]
        { name: 'China Railway 12306' }, // Official train ticket purchasing app [^40^]
        { name: 'Airbnb' }, // International short-term rental platform [^40^]
        { name: 'U Dictionary' }, // Translation app [^40^]
        { name: 'Dazhong Dianping' }, // Review and rating app for local businesses [^40^]
        { name: 'Trip.com' } // Travel booking app [^40^]
      ];
  
    // Sample Bluetooth devices (replace with actual logic to get connected Bluetooth devices)
    const bluetoothDevices = [
      { name: 'Anony’s Airpods' },
      { name: 'EVA Audio' },
      { name: 'Smart Watch' }
    ];
  
    // Sample WiFi networks (replace with actual logic to get connected WiFi networks)
    const wifiNetworks = [
      { name: 'Home WiFi' },
      { name: 'Office WiFi' },
      { name: 'Public WiFi' },
      { name: 'WiFi 1' },
      { name: 'WiFi 2' },
      { name: 'WiFi 3' },
      { name: 'WiFi 4' },
    ];
  
    // Sample current location (replace with actual geolocation logic)
    const currentLocation = {
      latitude: 10.00,
      longitude: -100.00
    };
  
    return {
      apps,
      bluetoothDevices,
      wifiNetworks,
      currentLocation
    };
  }
  