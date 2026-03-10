// Verification script to check all 40 transfer types have images
const fs = require('fs');
const path = require('path');

// Copy the exact mapping logic from frontend
const getTransferOptionImage = (title, badge, transferTypeCode) => {
  const titleLower = title.toLowerCase();
  
  // ABSOLUTE CORRECT MATCHES ONLY - each image maps to exactly ONE transfer type
  
  // eco-luxury.png → ONLY ECLX (Eco Luxury)
  if (titleLower === 'eco luxury') return '/transfer-images/eco-luxury.png';
  
  // eco-private.png → ONLY ECOP (Eco Private)  
  if (titleLower === 'eco private') return '/transfer-images/eco-private.png';
  
  // luxury-car.png → ONLY LIMO (Luxury Car)
  if (titleLower === 'luxury car') return '/transfer-images/luxury-car.png';
  
  // luxury-minibus.png → ONLY EXEC (Luxury Minibus)
  if (titleLower === 'luxury minibus') return '/transfer-images/luxury-minibus.png';
  
  // shared-transfer.png → ONLY SHAR (Shared Transfer)
  if (titleLower === 'shared transfer') return '/transfer-images/shared-transfer.png';
  
  // private-coach.png → ONLY COAC (Private Coach)
  if (titleLower === 'private coach') return '/transfer-images/private-coach.png';
  
  // private.png → ONLY PRIV (Private Transfer with "Most Popular" badge)
  if (titleLower === 'private transfer' && badge?.includes('Most Popular')) {
    return '/transfer-images/private.png';
  }
  
  // schedule-shuttle.png → ONLY SHTL (Shuttle)
  if (titleLower === 'shuttle') return '/transfer-images/schedule-shuttle.png';
  
  // Everything else (32 other transfer types including PTNS) gets undefined.png
  return '/transfer-images/undefined.png';
};

// All 40 transfer types from backend mapping with their badges
const transferTypes = [
  { code: 'PRIV', title: 'Private Transfer', badge: 'Most Popular' },
  { code: 'SHAR', title: 'Shared Transfer', badge: 'Budget Friendly' },
  { code: 'EXEC', title: 'Luxury Minibus', badge: 'Premium' },
  { code: 'COAC', title: 'Private Coach', badge: 'Group Travel' },
  { code: 'LIMO', title: 'Luxury Car', badge: 'Luxury' },
  { code: 'SCHD', title: 'Scheduled Shuttle', badge: 'Scheduled' },
  { code: 'ECON', title: 'Economy Transfer', badge: 'Budget Friendly' },
  { code: 'PRIO', title: 'Priority Shared', badge: 'Priority' },
  { code: 'SHPL', title: 'Shared Plus', badge: 'Enhanced Shared' },
  { code: 'MEMS', title: 'TO Shared', badge: 'Shared Service' },
  { code: 'PRGF', title: 'Private Golf Transfer', badge: 'Golf Specialist' },
  { code: 'GLF', title: 'Golf Transfer', badge: 'Golf Transfer' },
  { code: 'PCG', title: 'Private Coach Golf', badge: 'Golf Group' },
  { code: 'HELI', title: 'Helicopter Transfer', badge: 'Premium' },
  { code: 'SHTL', title: 'Shuttle', badge: 'Shuttle Service' },
  { code: 'AP2', title: 'Airport Package 2', badge: 'Airport Package' },
  { code: 'AP3', title: 'Airport Package 3', badge: 'Airport Package' },
  { code: 'AP4', title: 'Airport Package 4', badge: 'Airport Package' },
  { code: 'AP5', title: 'Airport Package 5', badge: 'Airport Package' },
  { code: 'AP6', title: 'Airport Package 6', badge: 'Airport Package' },
  { code: 'GP2', title: 'Golf Package Two', badge: 'Golf Package' },
  { code: 'GP3', title: 'Golf Package Three', badge: 'Golf Package' },
  { code: 'GP4', title: 'Golf Package Four', badge: 'Golf Package' },
  { code: 'GP5', title: 'Golf Package Five', badge: 'Golf Package' },
  { code: 'GP6', title: 'Golf Package Six', badge: 'Golf Package' },
  { code: 'LSUV', title: 'Luxury SUV', badge: 'Luxury' },
  { code: 'DSHU', title: 'Denver Shuttle', badge: 'Regional Shuttle' },
  { code: 'AOSH', title: 'Aosta Shuttle', badge: 'Regional Shuttle' },
  { code: 'AP1', title: 'Airport Package 1', badge: 'Airport Package' },
  { code: 'GP1', title: 'Golf Package One', badge: 'Golf Package' },
  { code: 'EC1', title: 'Economy Shuttle', badge: 'Budget Friendly' },
  { code: 'ECPR', title: 'Economy Private', badge: 'Eco-friendly' },
  { code: 'ECLX', title: 'Eco Luxury', badge: 'Eco-friendly' },
  { code: 'ECOP', title: 'Eco Private', badge: 'Eco-friendly' },
  { code: 'M&G', title: 'Meet and Greet Rep', badge: 'VIP Service' },
  { code: 'LUN', title: 'Lunch', badge: 'Dining Service' },
  { code: 'PTNS', title: 'Private Transfer', badge: 'Private Service' },
  { code: 'LXGL', title: 'Luxury Golf Transfer', badge: 'Luxury Golf' },
  { code: '8HRS', title: 'Full Day Luxury Private Vehicle & Driver Hire', badge: 'Full Day Service' },
  { code: 'LUGV', title: 'Luggage Van', badge: 'Luggage Service' },
  { code: 'Acc', title: 'Accessible Vehicle', badge: 'Accessible' }
];

console.log('🔍 VERIFYING ALL 40 TRANSFER TYPE IMAGES\n');

// Check which image files actually exist
const imageDir = __dirname;
const imageFiles = fs.readdirSync(imageDir).filter(file => file.endsWith('.png'));

console.log('📁 Available image files:');
imageFiles.forEach(file => {
  const filePath = path.join(imageDir, file);
  const stats = fs.statSync(filePath);
  const sizeKB = Math.round(stats.size / 1024);
  console.log(`   ✅ ${file} (${sizeKB} KB)`);
});

console.log('\n📊 TRANSFER TYPE → IMAGE MAPPING:\n');

const imageUsage = {};
const missingImages = [];

transferTypes.forEach(type => {
  const imagePath = getTransferOptionImage(type.title, type.badge, type.code);
  const imageName = imagePath.split('/').pop();
  const localImagePath = path.join(imageDir, imageName);
  
  // Check if image file exists
  const exists = fs.existsSync(localImagePath);
  const status = exists ? '✅' : '❌';
  
  if (!exists) {
    missingImages.push({ type, imageName });
  }
  
  if (!imageUsage[imageName]) {
    imageUsage[imageName] = [];
  }
  imageUsage[imageName].push(`${type.code} - ${type.title}`);
  
  console.log(`${status} ${type.code.padEnd(4)} | ${type.title.padEnd(45)} | ${imageName}`);
});

console.log('\n📈 IMAGE USAGE SUMMARY:\n');
Object.keys(imageUsage).sort().forEach(image => {
  const exists = fs.existsSync(path.join(imageDir, image));
  const status = exists ? '✅' : '❌';
  const count = imageUsage[image].length;
  
  console.log(`${status} ${image} (used by ${count} transfer type${count !== 1 ? 's' : ''}):`);
  imageUsage[image].forEach(type => {
    console.log(`     - ${type}`);
  });
  console.log('');
});

console.log('🎯 FINAL RESULTS:');
console.log(`📊 Total transfer types: ${transferTypes.length}`);
console.log(`🖼️  Total unique images needed: ${Object.keys(imageUsage).length}`);
console.log(`✅ Images that exist: ${Object.keys(imageUsage).filter(img => fs.existsSync(path.join(imageDir, img))).length}`);
console.log(`❌ Missing images: ${missingImages.length}`);

if (missingImages.length === 0) {
  console.log('\n🎉 SUCCESS: All 40 transfer types have images!');
} else {
  console.log('\n⚠️  MISSING IMAGES:');
  missingImages.forEach(({ type, imageName }) => {
    console.log(`   ❌ ${imageName} needed for ${type.code} - ${type.title}`);
  });
} 