# JK BMS Monitor Dashboard

Ứng dụng React hiện đại để giám sát và điều khiển JK BMS (Battery Management System) thông qua MQTT.

## 🚀 Tính năng

- **Dashboard tổng quan**: Hiển thị thông tin pin, dòng điện, công suất
- **Giám sát cell**: Theo dõi điện áp và nội trở từng cell
- **Điều khiển BMS**: Bật/tắt sạc, xả, cân bằng cell
- **Cài đặt thông số**: Cấu hình các thông số bảo vệ
- **Kết nối MQTT**: Giao tiếp real-time với BMS

## 📁 Cấu trúc thư mục

```
src/
├── App.jsx                 # Component chính
├── index.css              # CSS global + Tailwind
├── main.jsx               # Entry point
├── components/            # UI Components
│   ├── JKBMSApp.jsx      # Component chính BMS
│   ├── StatusCard.jsx     # Card hiển thị trạng thái
│   ├── CellGrid.jsx       # Lưới hiển thị cell
│   ├── Header.jsx         # Header với trạng thái kết nối
│   ├── TabNavigation.jsx  # Navigation tabs
│   └── SettingsPanel.jsx  # Panel cài đặt
└── hooks/                 # Custom Hooks
    ├── useMQTT.js        # Hook xử lý MQTT
    └── useBMSData.js     # Hook quản lý dữ liệu BMS
```

## 🛠️ Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cài đặt Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Cài đặt các thư viện bổ sung

```bash
# Icons
npm install lucide-react

# MQTT Client
npm install mqtt
```

### 4. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### 5. Build production

```bash
npm run build
```

## 🔧 Cấu hình MQTT

Trong file `hooks/useMQTT.js`, thay thế mock connection bằng MQTT client thực:

```javascript
import mqtt from 'mqtt';

const client = mqtt.connect('ws://your-mqtt-broker:9001');

client.on('connect', () => {
  setMqttConnected(true);
  setConnectionStatus('Connected');
});

client.on('message', (topic, message) => {
  // Xử lý message từ BMS
});
```

## 📊 MQTT Topics

- `jk-bms/data` - Dữ liệu BMS real-time
- `jk-bms/control/charge` - Điều khiển sạc
- `jk-bms/control/discharge` - Điều khiển xả
- `jk-bms/control/balance` - Điều khiển cân bằng
- `jk-bms/settings` - Cài đặt thông số
- `jk-bms/emergency` - Dừng khẩn cấp

## 🎨 Customization

### Thay đổi theme colors trong `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ...
    }
  }
}
```

### Thêm animation trong `index.css`:

```css
@keyframes custom-animation {
  /* your animation */
}
```

## 📱 Responsive Design

Ứng dụng được tối ưu cho cả desktop và mobile:
- Grid tự động điều chỉnh trên màn hình nhỏ
- Touch-friendly controls
- Scrollable tabs navigation

## 🔒 Tính năng bảo mật

- Emergency stop function
- Input validation cho settings
- Connection status monitoring

## 🚨 Lưu ý quan trọng

1. **An toàn điện**: Luôn kiểm tra kết nối trước khi điều khiển
2. **Backup settings**: Sao lưu cài đặt trước khi thay đổi
3. **Monitoring**: Theo dõi liên tục nhiệt độ và điện áp cell
4. **Emergency stop**: Sử dụng khi có bất thường

## 📄 License

MIT License - Xem file LICENSE để biết chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ qua email.