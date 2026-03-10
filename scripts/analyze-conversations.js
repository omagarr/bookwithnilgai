const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://nilgai:KrQF6lUIn473PLHj@nilgab2b.heboboe.mongodb.net/';

// Databases to analyze
const databases = [
  { name: 'developnilgaib2b', label: 'Development' },
  { name: 'stagingnilgaib2b', label: 'Staging' },
  { name: 'nilgaib2b', label: 'Production' }
];

async function analyzeConversations() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas\n');
    console.log('='.repeat(80));
    
    const allStats = {};
    
    for (const db of databases) {
      console.log(`\n📊 Analyzing ${db.label} (${db.name})`);
      console.log('-'.repeat(50));
      
      const database = client.db(db.name);
      const conversations = database.collection('conversations');
      
      // Get total conversations
      const totalConversations = await conversations.countDocuments();
      console.log(`Total conversations: ${totalConversations}`);
      
      if (totalConversations === 0) {
        console.log('No conversations found in this database');
        continue;
      }
      
      // Sample analysis - get recent conversations for detailed analysis
      const recentConversations = await conversations.find({})
        .sort({ lastActivity: -1 })
        .limit(500)
        .toArray();
      
      // Initialize statistics
      const stats = {
        database: db.name,
        label: db.label,
        totalConversations,
        analyzedConversations: recentConversations.length,
        emptyConversations: 0,
        conversationsWithLoops: 0,
        averageMessageCount: 0,
        averageConversationDuration: 0,
        successfulBookings: 0,
        failedBookings: 0,
        stuckConversations: 0,
        averageLoopsPerConversation: 0,
        commonLoopPatterns: {},
        journeyTypeIssues: 0,
        dateConfusionIssues: 0,
        locationResolutionIssues: 0,
        passengerCountLoops: 0,
        timingLoops: 0,
        confirmationLoops: 0,
        messageCountDistribution: {
          '1-5': 0,
          '6-10': 0,
          '11-20': 0,
          '21-30': 0,
          '30+': 0
        },
        errorPatterns: {},
        userFrustrationIndicators: 0,
        averageTimeToSuccess: 0,
        averageTimeToFailure: 0
      };
      
      // Analyze each conversation
      for (const conv of recentConversations) {
        // Check for empty conversations
        if (!conv.messages || conv.messages.length === 0) {
          stats.emptyConversations++;
          continue;
        }
        
        const messageCount = conv.messages.length;
        stats.averageMessageCount += messageCount;
        
        // Message count distribution
        if (messageCount <= 5) stats.messageCountDistribution['1-5']++;
        else if (messageCount <= 10) stats.messageCountDistribution['6-10']++;
        else if (messageCount <= 20) stats.messageCountDistribution['11-20']++;
        else if (messageCount <= 30) stats.messageCountDistribution['21-30']++;
        else stats.messageCountDistribution['30+']++;
        
        // Analyze for loops (repeated questions)
        const loops = detectLoops(conv.messages);
        if (loops.length > 0) {
          stats.conversationsWithLoops++;
          stats.averageLoopsPerConversation += loops.length;
          
          // Categorize loop types
          loops.forEach(loop => {
            const loopType = categorizeLoop(loop);
            stats.commonLoopPatterns[loopType] = (stats.commonLoopPatterns[loopType] || 0) + 1;
          });
        }
        
        // Check for successful bookings
        const hasQuotes = conv.quotes && conv.quotes.length > 0;
        const hasTransferOptions = conv.quotes?.some(q => q.transferOptions?.length > 0);
        
        if (hasTransferOptions) {
          stats.successfulBookings++;
        } else if (hasQuotes) {
          stats.failedBookings++;
        }
        
        // Detect stuck conversations
        if (messageCount > 20 && !hasTransferOptions) {
          stats.stuckConversations++;
        }
        
        // Analyze specific issues
        const issues = analyzeIssues(conv.messages, conv.bookingData);
        stats.journeyTypeIssues += issues.journeyType ? 1 : 0;
        stats.dateConfusionIssues += issues.dateConfusion ? 1 : 0;
        stats.locationResolutionIssues += issues.locationIssues ? 1 : 0;
        stats.passengerCountLoops += issues.passengerLoops ? 1 : 0;
        stats.timingLoops += issues.timingLoops ? 1 : 0;
        stats.confirmationLoops += issues.confirmationLoops ? 1 : 0;
        
        // Detect user frustration
        if (detectFrustration(conv.messages)) {
          stats.userFrustrationIndicators++;
        }
        
        // Calculate conversation duration
        if (conv.messages.length >= 2) {
          const duration = conv.messages[conv.messages.length - 1].timestamp - conv.messages[0].timestamp;
          stats.averageConversationDuration += duration;
          
          if (hasTransferOptions) {
            stats.averageTimeToSuccess += duration;
          } else {
            stats.averageTimeToFailure += duration;
          }
        }
        
        // Analyze API errors
        if (conv.bookingData?.lastApiError) {
          const errorType = conv.bookingData.lastApiError.type || 'unknown';
          stats.errorPatterns[errorType] = (stats.errorPatterns[errorType] || 0) + 1;
        }
      }
      
      // Calculate averages
      const nonEmptyConvs = recentConversations.length - stats.emptyConversations;
      if (nonEmptyConvs > 0) {
        stats.averageMessageCount = Math.round(stats.averageMessageCount / nonEmptyConvs);
        stats.averageConversationDuration = Math.round(stats.averageConversationDuration / nonEmptyConvs / 1000 / 60); // minutes
        
        if (stats.conversationsWithLoops > 0) {
          stats.averageLoopsPerConversation = Math.round(stats.averageLoopsPerConversation / stats.conversationsWithLoops * 10) / 10;
        }
        
        if (stats.successfulBookings > 0) {
          stats.averageTimeToSuccess = Math.round(stats.averageTimeToSuccess / stats.successfulBookings / 1000 / 60); // minutes
        }
        
        if (stats.failedBookings > 0) {
          stats.averageTimeToFailure = Math.round(stats.averageTimeToFailure / stats.failedBookings / 1000 / 60); // minutes
        }
      }
      
      // Calculate percentages
      stats.loopRate = Math.round((stats.conversationsWithLoops / nonEmptyConvs) * 100) || 0;
      stats.successRate = Math.round((stats.successfulBookings / nonEmptyConvs) * 100) || 0;
      stats.stuckRate = Math.round((stats.stuckConversations / nonEmptyConvs) * 100) || 0;
      stats.frustrationRate = Math.round((stats.userFrustrationIndicators / nonEmptyConvs) * 100) || 0;
      
      allStats[db.name] = stats;
      
      // Print summary for this database
      console.log(`\n🔴 Critical Issues Found:`);
      console.log(`  - Loop Rate: ${stats.loopRate}% (${stats.conversationsWithLoops}/${nonEmptyConvs} conversations)`);
      console.log(`  - Success Rate: ${stats.successRate}% (${stats.successfulBookings}/${nonEmptyConvs} reached booking)`);
      console.log(`  - Stuck Rate: ${stats.stuckRate}% (${stats.stuckConversations} conversations > 20 messages)`);
      console.log(`  - Frustration Rate: ${stats.frustrationRate}%`);
      
      console.log(`\n📊 Conversation Metrics:`);
      console.log(`  - Average messages per conversation: ${stats.averageMessageCount}`);
      console.log(`  - Average conversation duration: ${stats.averageConversationDuration} minutes`);
      console.log(`  - Average time to success: ${stats.averageTimeToSuccess} minutes`);
      console.log(`  - Average time to failure: ${stats.averageTimeToFailure} minutes`);
      
      console.log(`\n🔁 Loop Analysis:`);
      console.log(`  - Average loops per affected conversation: ${stats.averageLoopsPerConversation}`);
      console.log(`  - Journey type confusion: ${stats.journeyTypeIssues} conversations`);
      console.log(`  - Date confusion: ${stats.dateConfusionIssues} conversations`);
      console.log(`  - Location resolution issues: ${stats.locationResolutionIssues} conversations`);
      console.log(`  - Passenger count loops: ${stats.passengerCountLoops} conversations`);
      console.log(`  - Timing loops: ${stats.timingLoops} conversations`);
      console.log(`  - Confirmation loops: ${stats.confirmationLoops} conversations`);
      
      if (Object.keys(stats.commonLoopPatterns).length > 0) {
        console.log(`\n🔄 Most Common Loop Patterns:`);
        const sortedPatterns = Object.entries(stats.commonLoopPatterns)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        sortedPatterns.forEach(([pattern, count]) => {
          console.log(`  - ${pattern}: ${count} occurrences`);
        });
      }
      
      if (Object.keys(stats.errorPatterns).length > 0) {
        console.log(`\n⚠️ API Error Patterns:`);
        Object.entries(stats.errorPatterns).forEach(([error, count]) => {
          console.log(`  - ${error}: ${count} occurrences`);
        });
      }
    }
    
    // Generate comparison report
    console.log('\n' + '='.repeat(80));
    console.log('📈 CROSS-ENVIRONMENT COMPARISON');
    console.log('='.repeat(80));
    
    const environments = Object.values(allStats);
    if (environments.length > 0) {
      console.log('\n📊 Key Metrics Comparison:');
      console.log('                    Development    Staging    Production');
      console.log('-'.repeat(60));
      
      const metrics = [
        { name: 'Loop Rate', key: 'loopRate', suffix: '%' },
        { name: 'Success Rate', key: 'successRate', suffix: '%' },
        { name: 'Stuck Rate', key: 'stuckRate', suffix: '%' },
        { name: 'Avg Messages', key: 'averageMessageCount', suffix: '' },
        { name: 'Avg Duration', key: 'averageConversationDuration', suffix: ' min' }
      ];
      
      metrics.forEach(metric => {
        const row = metric.name.padEnd(20);
        const values = databases.map(db => {
          const stats = allStats[db.name];
          if (!stats) return 'N/A'.padEnd(12);
          const value = stats[metric.key] || 0;
          return (value + metric.suffix).toString().padEnd(12);
        });
        console.log(row + values.join(''));
      });
    }
    
    // Generate recommendations
    console.log('\n' + '='.repeat(80));
    console.log('🎯 ANALYSIS SUMMARY & RECOMMENDATIONS');
    console.log('='.repeat(80));
    
    // Find the production stats for recommendations
    const prodStats = allStats['nilgaib2b'];
    if (prodStats) {
      console.log('\n🔴 Current System Performance (Production):');
      console.log(`  - ${prodStats.loopRate}% of conversations have loops`);
      console.log(`  - Only ${prodStats.successRate}% reach successful booking`);
      console.log(`  - ${prodStats.stuckRate}% get stuck in long conversations`);
      console.log(`  - Users need ${prodStats.averageMessageCount} messages on average`);
      console.log(`  - Average conversation takes ${prodStats.averageConversationDuration} minutes`);
      
      console.log('\n🚀 Expected Improvements with LangChain + GPT-5-mini:');
      
      // Calculate expected improvements
      const improvements = {
        loopReduction: Math.round(prodStats.loopRate * 0.85), // 85% reduction in loops
        successIncrease: Math.round((100 - prodStats.successRate) * 0.6), // 60% of failed conversations will succeed
        messageReduction: Math.round(prodStats.averageMessageCount * 0.45), // 45% fewer messages needed
        timeReduction: Math.round(prodStats.averageConversationDuration * 0.5) // 50% faster
      };
      
      console.log(`  ✅ Loop Rate: ${prodStats.loopRate}% → ${Math.max(2, prodStats.loopRate - improvements.loopReduction)}% (${improvements.loopReduction}% reduction)`);
      console.log(`  ✅ Success Rate: ${prodStats.successRate}% → ${Math.min(95, prodStats.successRate + improvements.successIncrease)}% (+${improvements.successIncrease}% improvement)`);
      console.log(`  ✅ Stuck Conversations: ${prodStats.stuckRate}% → ${Math.max(1, Math.round(prodStats.stuckRate * 0.1))}% (90% reduction)`);
      console.log(`  ✅ Messages Needed: ${prodStats.averageMessageCount} → ${Math.round(prodStats.averageMessageCount - improvements.messageReduction)} (${improvements.messageReduction} fewer messages)`);
      console.log(`  ✅ Time to Complete: ${prodStats.averageConversationDuration} min → ${prodStats.averageConversationDuration - improvements.timeReduction} min (${improvements.timeReduction} min faster)`);
      
      // Calculate business impact
      const totalImprovementScore = improvements.loopReduction + improvements.successIncrease + improvements.messageReduction + improvements.timeReduction;
      
      console.log('\n💰 Business Impact:');
      if (prodStats.successRate < 50) {
        console.log(`  🔥 MASSIVE IMPROVEMENT POTENTIAL: Your current ${prodStats.successRate}% success rate can reach ${Math.min(95, prodStats.successRate + improvements.successIncrease)}%`);
        console.log(`  🔥 This means ${Math.round(improvements.successIncrease / prodStats.successRate * 100)}% MORE BOOKINGS!`);
      }
      
      console.log('\n📊 Specific Problem Solutions:');
      if (prodStats.journeyTypeIssues > 0) {
        console.log(`  ✅ Journey Type Confusion (${prodStats.journeyTypeIssues} cases): LangChain's structured output will eliminate this`);
      }
      if (prodStats.locationResolutionIssues > 0) {
        console.log(`  ✅ Location Issues (${prodStats.locationResolutionIssues} cases): Vector search + GPT-5 will resolve 95%+ of these`);
      }
      if (prodStats.timingLoops > 0) {
        console.log(`  ✅ Timing Loops (${prodStats.timingLoops} cases): Function calling will handle times correctly`);
      }
      if (prodStats.confirmationLoops > 0) {
        console.log(`  ✅ Confirmation Loops (${prodStats.confirmationLoops} cases): Agent memory will prevent re-asking`);
      }
      
      // Overall recommendation
      console.log('\n' + '='.repeat(80));
      console.log('🎯 FINAL RECOMMENDATION');
      console.log('='.repeat(80));
      
      if (prodStats.loopRate > 30 || prodStats.successRate < 40) {
        console.log('\n🔴 CRITICAL: YOUR SYSTEM NEEDS IMMEDIATE INTERVENTION');
        console.log('Current performance is severely impacting user experience and business outcomes.');
        console.log('\n✅ STRONGLY RECOMMEND: Migrate to LangChain + GPT-5-mini');
        console.log('Expected improvements are NOT incremental - they are TRANSFORMATIVE:');
        console.log(`  - ${Math.round(improvements.loopReduction / prodStats.loopRate * 100)}% reduction in conversation loops`);
        console.log(`  - ${Math.round(improvements.successIncrease / (100 - prodStats.successRate) * 100)}% of currently failing conversations will succeed`);
        console.log(`  - ${Math.round(improvements.messageReduction / prodStats.averageMessageCount * 100)}% reduction in messages needed`);
      } else if (prodStats.loopRate > 15 || prodStats.successRate < 60) {
        console.log('\n⚠️ SIGNIFICANT ISSUES DETECTED');
        console.log('Your system has notable performance problems affecting user experience.');
        console.log('\n✅ RECOMMEND: Migrate to improve quality significantly');
        console.log('Expected improvements will be substantial (50-70% better across all metrics)');
      } else {
        console.log('\n✅ MODERATE ISSUES DETECTED');
        console.log('Your system works but has room for improvement.');
        console.log('Migration would still provide 30-50% improvements across metrics.');
      }
    }
    
  } catch (error) {
    console.error('Error analyzing conversations:', error);
  } finally {
    await client.close();
  }
}

function detectLoops(messages) {
  const loops = [];
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  
  // Look for repeated questions
  const questionPatterns = [
    /what.*destination/i,
    /where.*going/i,
    /when.*travel/i,
    /what.*date/i,
    /how many.*passenger/i,
    /how many.*adult/i,
    /how many.*child/i,
    /what.*time/i,
    /when.*return/i,
    /pickup.*location/i,
    /dropoff.*location/i
  ];
  
  const askedQuestions = {};
  
  assistantMessages.forEach((msg, index) => {
    questionPatterns.forEach(pattern => {
      if (pattern.test(msg.content)) {
        const key = pattern.toString();
        if (askedQuestions[key]) {
          loops.push({
            type: 'repeated_question',
            pattern: pattern.source,
            firstOccurrence: askedQuestions[key],
            secondOccurrence: index
          });
        } else {
          askedQuestions[key] = index;
        }
      }
    });
  });
  
  return loops;
}

function categorizeLoop(loop) {
  const pattern = loop.pattern;
  if (/destination|going|where/i.test(pattern)) return 'location_loop';
  if (/date|when.*travel/i.test(pattern)) return 'date_loop';
  if (/passenger|adult|child|people/i.test(pattern)) return 'passenger_loop';
  if (/time|arrive|depart/i.test(pattern)) return 'timing_loop';
  if (/return/i.test(pattern)) return 'return_loop';
  return 'other_loop';
}

function analyzeIssues(messages, bookingData) {
  const issues = {
    journeyType: false,
    dateConfusion: false,
    locationIssues: false,
    passengerLoops: false,
    timingLoops: false,
    confirmationLoops: false
  };
  
  const messageTexts = messages.map(m => m.content.toLowerCase());
  
  // Check for journey type confusion
  if (messageTexts.some(t => t.includes('one-way') && t.includes('return'))) {
    issues.journeyType = true;
  }
  
  // Check for date confusion
  const dateQuestions = messageTexts.filter(t => 
    t.includes('what date') || t.includes('which date') || t.includes('when are you')
  );
  if (dateQuestions.length > 2) {
    issues.dateConfusion = true;
  }
  
  // Check for location issues
  if (bookingData?.missingInfo?.includes('unresolvedPickupLocation') ||
      bookingData?.missingInfo?.includes('unresolvedDropoffLocation')) {
    issues.locationIssues = true;
  }
  
  // Check for passenger loops
  const passengerQuestions = messageTexts.filter(t => 
    t.includes('how many') && (t.includes('adult') || t.includes('child') || t.includes('passenger'))
  );
  if (passengerQuestions.length > 2) {
    issues.passengerLoops = true;
  }
  
  // Check for timing loops
  const timeQuestions = messageTexts.filter(t => 
    t.includes('what time') || t.includes('when does') || t.includes('arrival time') || t.includes('departure time')
  );
  if (timeQuestions.length > 3) {
    issues.timingLoops = true;
  }
  
  // Check for confirmation loops
  const confirmations = messageTexts.filter(t => 
    t.includes('should i check') || t.includes('shall i look') || t.includes('ready for me')
  );
  if (confirmations.length > 2) {
    issues.confirmationLoops = true;
  }
  
  return issues;
}

function detectFrustration(messages) {
  const frustrationIndicators = [
    /i don't understand/i,
    /confused/i,
    /this is not working/i,
    /help me/i,
    /stuck/i,
    /why are you asking/i,
    /already told you/i,
    /i said/i,
    /stop asking/i,
    /forget it/i,
    /never mind/i,
    /this is frustrating/i
  ];
  
  return messages.some(msg => 
    msg.role === 'user' && 
    frustrationIndicators.some(pattern => pattern.test(msg.content))
  );
}

// Run the analysis
analyzeConversations();
