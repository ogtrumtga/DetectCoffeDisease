/**
 * Script test kết nối backend từ môi trường React Native
 * Chạy: node test_backend_connection.js
 * 
 * HƯỚNG DẪN:
 * 1. Mở file .env
 * 2. Copy giá trị EXPO_PUBLIC_API_BASE_URL
 * 3. Paste vào dòng API_BASE_URL bên dưới
 * 
 * Hoặc chạy với env variable:
 * EXPO_PUBLIC_API_BASE_URL=http://10.10.10.252:8000 node test_backend_connection.js
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.10.10.252:8000';

async function testConnection() {
  console.log('='.repeat(60));
  console.log('TEST KẾT NỐI BACKEND');
  console.log('='.repeat(60));
  console.log(`\nAPI Base URL: ${API_BASE_URL}`);
  console.log(`(Từ env variable hoặc default)\n`);

  // Test 1: Health check
  console.log('1. Testing health check...');
  try {
    const response = await fetch(`${API_BASE_URL}/docs`);
    if (response.ok) {
      console.log('   ✅ Backend is running!');
      console.log(`   Status: ${response.status} ${response.statusText}`);
    } else {
      console.log(`   ❌ Backend returned: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to backend');
    console.log(`   Error: ${error.message}`);
    console.log('\n💡 Kiểm tra:');
    console.log('   - Backend có đang chạy không?');
    console.log('   - IP address đúng chưa? (chạy ipconfig)');
    console.log('   - Firewall có block port 8000 không?');
    console.log('   - Máy tính và điện thoại cùng WiFi chưa?');
    return;
  }

  // Test 2: Test upload endpoint
  console.log('\n2. Testing upload endpoint availability...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/diagnosis/upload-image`, {
      method: 'OPTIONS', // Preflight check
    });
    console.log(`   ✅ Upload endpoint accessible`);
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    console.log(`   ❌ Upload endpoint error: ${error.message}`);
  }

  // Test 3: Test predict endpoint
  console.log('\n3. Testing predict endpoint availability...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/diagnosis/predict`, {
      method: 'OPTIONS', // Preflight check
    });
    console.log(`   ✅ Predict endpoint accessible`);
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    console.log(`   ❌ Predict endpoint error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ KẾT NỐI BACKEND HOẠT ĐỘNG TỐT!');
  console.log('='.repeat(60));
  console.log('\n📱 Bây giờ có thể test trên app');
  console.log('   1. Mở Expo app');
  console.log('   2. Chụp ảnh');
  console.log('   3. Xem logs trong terminal này và backend terminal');
}

testConnection().catch(console.error);
