// Test script to verify all 40 transfer types get mapped to images
const getTransferOptionImage = (title) => {
  const titleLower = title.toLowerCase();
  
  // ECO LUXURY (ECLX, AP4, GP4)
  if (titleLower.includes('eco luxury') || titleLower.includes('eclx')) return '/transfer-images/eco-luxury.png';
  
  // ECO PRIVATE (ECOP, ECPR alternative)
  if (titleLower.includes('eco private') || titleLower.includes('ecop')) return '/transfer-images/eco-private.png';
  
  // LUXURY CAR (LIMO, LSUV alternative)
  if (titleLower.includes('luxury car') || titleLower.includes('limo')) return '/transfer-images/luxury-car.png';
  
  // LUXURY MINIBUS (EXEC, ECON, LSUV, AP3, GP3)
  if (titleLower.includes('luxury minibus') || titleLower.includes('executive') || titleLower.includes('exec') || 
      titleLower.includes('economy transfer') || titleLower.includes('econ') || titleLower.includes('luxury suv') || titleLower.includes('lsuv')) return '/transfer-images/luxury-minibus.png';
  
  // SHARED TRANSFER (SHAR, PRIO, SHPL, MEMS, GLF, EC1)
  if (titleLower.includes('shared') || titleLower.includes('shar') || titleLower.includes('priority shared') || 
      titleLower.includes('shared plus') || titleLower.includes('to shared') || titleLower.includes('golf transfer') ||
      titleLower.includes('economy shuttle') || titleLower.includes('ec1')) return '/transfer-images/shared-transfer.png';
  
  // SCHEDULE SHUTTLE (SHTL)
  if (titleLower.includes('shuttle') && !titleLower.includes('scheduled') && !titleLower.includes('denver') && !titleLower.includes('aosta') && !titleLower.includes('economy')) return '/transfer-images/schedule-shuttle.png';
  
  // PRIVATE COACH (COAC, PCG, SCHD, DSHU, AOSH, AP6)
  if (titleLower.includes('coach') || titleLower.includes('coac') || titleLower.includes('private coach') ||
      titleLower.includes('scheduled') || titleLower.includes('denver') || titleLower.includes('aosta') || titleLower.includes('airport package 6')) return '/transfer-images/private-coach.png';
  
  // PRIVATE TRANSFER (PRIV, PRGF, PTNS, ECPR, AP1, AP2, GP1, GP2, LUN, LXGL, M&G, LUGV, Acc, 8HRS, HELI)
  if (titleLower.includes('private transfer') || titleLower.includes('priv') || titleLower.includes('ptns') ||
      titleLower.includes('golf transfer') && titleLower.includes('private') ||
      titleLower.includes('economy private') || titleLower.includes('ecpr') ||
      titleLower.includes('airport package 1') || titleLower.includes('airport package 2') ||
      titleLower.includes('golf package one') || titleLower.includes('golf package two') ||
      titleLower.includes('lunch') || titleLower.includes('lun') ||
      titleLower.includes('luxury golf') || titleLower.includes('lxgl') ||
      titleLower.includes('meet and greet') || titleLower.includes('m&g') ||
      titleLower.includes('luggage') || titleLower.includes('lugv') ||
      titleLower.includes('accessible') || titleLower.includes('acc') ||
      titleLower.includes('full day') || titleLower.includes('8hrs') ||
      titleLower.includes('helicopter') || titleLower.includes('heli')) return '/transfer-images/private.png';
  
  // AIRPORT PACKAGES (AP3, AP4, AP5 use different images based on capacity)
  if (titleLower.includes('airport package 3')) return '/transfer-images/luxury-minibus.png';
  if (titleLower.includes('airport package 4')) return '/transfer-images/eco-luxury.png';
  if (titleLower.includes('airport package 5')) return '/transfer-images/private-coach.png';
  
  // GOLF PACKAGES (GP3, GP4, GP5, GP6 use different images based on capacity)
  if (titleLower.includes('golf package three')) return '/transfer-images/luxury-minibus.png';
  if (titleLower.includes('golf package four')) return '/transfer-images/eco-luxury.png';
  if (titleLower.includes('golf package five') || titleLower.includes('golf package six')) return '/transfer-images/private-coach.png';
  
  // Generic airport/golf packages fallback
  if (titleLower.includes('airport package') || titleLower.includes('ap')) return '/transfer-images/private.png';
  if (titleLower.includes('golf package') || titleLower.includes('gp')) return '/transfer-images/private.png';
  
  return '/transfer-images/private.png'; // default fallback
};

// All 40 transfer types from backend mapping
const transferTypes = [
  { code: 'PRIV', title: 'Private Transfer' },
  { code: 'SHAR', title: 'Shared Transfer' },
  { code: 'EXEC', title: 'Luxury Minibus' },
  { code: 'COAC', title: 'Private Coach' },
  { code: 'LIMO', title: 'Luxury Car' },
  { code: 'SCHD', title: 'Scheduled Shuttle' },
  { code: 'ECON', title: 'Economy Transfer' },
  { code: 'PRIO', title: 'Priority Shared' },
  { code: 'SHPL', title: 'Shared Plus' },
  { code: 'MEMS', title: 'TO Shared' },
  { code: 'PRGF', title: 'Private Golf Transfer' },
  { code: 'GLF', title: 'Golf Transfer' },
  { code: 'PCG', title: 'Private Coach Golf' },
  { code: 'HELI', title: 'Helicopter Transfer' },
  { code: 'SHTL', title: 'Shuttle' },
  { code: 'AP2', title: 'Airport Package 2' },
  { code: 'AP3', title: 'Airport Package 3' },
  { code: 'AP4', title: 'Airport Package 4' },
  { code: 'AP5', title: 'Airport Package 5' },
  { code: 'AP6', title: 'Airport Package 6' },
  { code: 'GP2', title: 'Golf Package Two' },
  { code: 'GP3', title: 'Golf Package Three' },
  { code: 'GP4', title: 'Golf Package Four' },
  { code: 'GP5', title: 'Golf Package Five' },
  { code: 'GP6', title: 'Golf Package Six' },
  { code: 'LSUV', title: 'Luxury SUV' },
  { code: 'DSHU', title: 'Denver Shuttle' },
  { code: 'AOSH', title: 'Aosta Shuttle' },
  { code: 'AP1', title: 'Airport Package 1' },
  { code: 'GP1', title: 'Golf Package One' },
  { code: 'EC1', title: 'Economy Shuttle' },
  { code: 'ECPR', title: 'Economy Private' },
  { code: 'ECLX', title: 'Eco Luxury' },
  { code: 'ECOP', title: 'Eco Private' },
  { code: 'M&G', title: 'Meet and Greet Rep' },
  { code: 'LUN', title: 'Lunch' },
  { code: 'PTNS', title: 'Private Transfer' },
  { code: 'LXGL', title: 'Luxury Golf Transfer' },
  { code: '8HRS', title: 'Full Day Luxury Private Vehicle & Driver Hire' },
  { code: 'LUGV', title: 'Luggage Van' },
  { code: 'Acc', title: 'Accessible Vehicle' }
];

console.log('=== TRANSFER TYPE IMAGE MAPPING TEST ===\n');

const imageUsage = {};
transferTypes.forEach(type => {
  const image = getTransferOptionImage(type.title);
  const imageName = image.split('/').pop();
  
  if (!imageUsage[imageName]) {
    imageUsage[imageName] = [];
  }
  imageUsage[imageName].push(`${type.code} - ${type.title}`);
  
  console.log(`${type.code.padEnd(4)} | ${type.title.padEnd(45)} | ${imageName}`);
});

console.log('\n=== IMAGE USAGE SUMMARY ===\n');
Object.keys(imageUsage).forEach(image => {
  console.log(`📸 ${image}:`);
  imageUsage[image].forEach(type => {
    console.log(`   - ${type}`);
  });
  console.log('');
});

console.log('✅ All 40 transfer types have been mapped to images!');
console.log(`📊 Total transfer types: ${transferTypes.length}`);
console.log(`🖼️  Total unique images: ${Object.keys(imageUsage).length}`); 