const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function testLocationValidation() {
  console.log('🧪 Testing location validation fix...\n');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const bookingDataService = app.get('BookingDataService');
  
  try {
    // Test the exact message from the user
    const testMessage = "I want to go from Timbaktu to Delhi";
    
    console.log(`📝 Testing message: "${testMessage}"`);
    
    const result = await bookingDataService.validateAnyMentionedLocations(testMessage);
    
    console.log('\n📊 Validation Results:');
    console.log('✅ Validated locations:', result.validatedLocations);
    console.log('❌ Unsupported locations:', result.unsupportedLocations);
    
    if (result.unsupportedLocations.length > 0) {
      console.log('\n🎉 SUCCESS: Fix is working! Unsupported locations detected.');
      console.log('The system should now respond with a limitation explanation instead of assuming ski context.');
    } else {
      console.log('\n⚠️ ISSUE: No unsupported locations detected. This might need further investigation.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await app.close();
  }
}

testLocationValidation().catch(console.error); 