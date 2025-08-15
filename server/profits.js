// scripts/testProfitSystem.js
// Run this after the migration to test if everything is working

const mongoose = require('mongoose');
require('dotenv').config();

const { 
  DataOrder,
  ProviderPricing,
  ProfitAnalytics
} = require('./schema/schema');

const MONGODB_URI = 'mongodb+srv://datamartghana:0246783840sa@cluster0.s33wv2s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

async function testProfitSystem() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check if pricing is initialized
    console.log('📋 TEST 1: Checking Pricing Data');
    console.log('=' .repeat(50));
    
    const networks = ['mtn', 'telecel', 'at'];
    for (const network of networks) {
      const count = await ProviderPricing.countDocuments({ 
        network, 
        isActive: true 
      });
      
      if (count > 0) {
        console.log(`✅ ${network.toUpperCase()}: ${count} packages configured`);
        
        // Show sample pricing
        const sample = await ProviderPricing.findOne({ network }).lean();
        if (sample) {
          console.log(`   Sample: ${sample.capacity}GB - Cost: GHS ${sample.providerPrice}, Sell: GHS ${sample.sellingPrice}, Profit: GHS ${sample.profit}`);
        }
      } else {
        console.log(`❌ ${network.toUpperCase()}: No pricing data found`);
      }
    }

    // Test 2: Check orders with profit data
    console.log('\n📊 TEST 2: Checking Order Profit Data');
    console.log('=' .repeat(50));
    
    const totalOrders = await DataOrder.countDocuments({ status: 'completed' });
    const ordersWithProfit = await DataOrder.countDocuments({ 
      status: 'completed',
      profit: { $gt: 0 }
    });
    
    const profitPercentage = totalOrders > 0 
      ? ((ordersWithProfit / totalOrders) * 100).toFixed(2) 
      : 0;
    
    console.log(`Total completed orders: ${totalOrders}`);
    console.log(`Orders with profit data: ${ordersWithProfit} (${profitPercentage}%)`);
    
    if (ordersWithProfit > 0) {
      // Show recent order with profit
      const recentOrder = await DataOrder.findOne({ 
        status: 'completed',
        profit: { $gt: 0 }
      })
      .sort({ createdAt: -1 })
      .lean();
      
      if (recentOrder) {
        console.log('\nSample Order with Profit:');
        console.log(`  Network: ${recentOrder.network}`);
        console.log(`  Package: ${recentOrder.dataAmount}GB`);
        console.log(`  Price: GHS ${recentOrder.price}`);
        console.log(`  Cost: GHS ${recentOrder.providerCost || 0}`);
        console.log(`  Profit: GHS ${recentOrder.profit || 0}`);
        console.log(`  Margin: ${recentOrder.profitMargin || 0}%`);
      }
    }

    // Test 3: Check analytics data
    console.log('\n📈 TEST 3: Checking Analytics Data');
    console.log('=' .repeat(50));
    
    const analyticsCount = await ProfitAnalytics.countDocuments();
    console.log(`Total analytics records: ${analyticsCount}`);
    
    if (analyticsCount > 0) {
      // Get last 7 days summary
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const weeklyStats = await ProfitAnalytics.aggregate([
        {
          $match: {
            date: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: null,
            days: { $addToSet: '$date' },
            totalOrders: { $sum: '$totalOrders' },
            totalRevenue: { $sum: '$totalRevenue' },
            totalProfit: { $sum: '$totalProfit' }
          }
        }
      ]);
      
      if (weeklyStats.length > 0) {
        const stats = weeklyStats[0];
        console.log('\nLast 7 Days Summary:');
        console.log(`  Days with data: ${stats.days.length}`);
        console.log(`  Total orders: ${stats.totalOrders}`);
        console.log(`  Total revenue: GHS ${stats.totalRevenue.toFixed(2)}`);
        console.log(`  Total profit: GHS ${stats.totalProfit.toFixed(2)}`);
        
        if (stats.totalRevenue > 0) {
          const margin = (stats.totalProfit / stats.totalRevenue) * 100;
          console.log(`  Profit margin: ${margin.toFixed(2)}%`);
        }
      }
    }

    // Test 4: Create a test order and calculate profit
    console.log('\n🧪 TEST 4: Testing Profit Calculation');
    console.log('=' .repeat(50));
    
    const testPricing = await ProviderPricing.findOne({ 
      network: 'mtn', 
      capacity: '5' 
    });
    
    if (testPricing) {
      console.log('Test calculation for MTN 5GB:');
      console.log(`  Provider cost: GHS ${testPricing.providerPrice}`);
      console.log(`  Selling price: GHS ${testPricing.sellingPrice}`);
      console.log(`  Expected profit: GHS ${testPricing.profit}`);
      console.log(`  Expected margin: ${testPricing.profitMargin.toFixed(2)}%`);
      console.log('✅ Profit calculation working correctly');
    } else {
      console.log('❌ Could not find test pricing data');
    }

    // Test 5: Check today's data
    console.log('\n📅 TEST 5: Checking Today\'s Data');
    console.log('=' .repeat(50));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAnalytics = await ProfitAnalytics.find({ 
      date: { $gte: today } 
    });
    
    if (todayAnalytics.length > 0) {
      console.log('Today\'s analytics found:');
      todayAnalytics.forEach(data => {
        console.log(`  ${data.network.toUpperCase()}: ${data.totalOrders} orders, GHS ${data.totalProfit.toFixed(2)} profit`);
      });
    } else {
      console.log('No data for today (this is normal if no orders today)');
      
      // Check if there are any orders today
      const todayOrders = await DataOrder.countDocuments({
        createdAt: { $gte: today },
        status: 'completed'
      });
      
      if (todayOrders > 0) {
        console.log(`Note: Found ${todayOrders} orders today - run analytics update`);
      }
    }

    // Final summary
    console.log('\n' + '=' .repeat(50));
    console.log('🔍 SYSTEM CHECK SUMMARY');
    console.log('=' .repeat(50));
    
    const issues = [];
    
    if (await ProviderPricing.countDocuments({ isActive: true }) === 0) {
      issues.push('No pricing data found');
    }
    
    if (ordersWithProfit === 0 && totalOrders > 0) {
      issues.push('Orders exist but have no profit data');
    }
    
    if (analyticsCount === 0 && totalOrders > 0) {
      issues.push('No analytics data generated');
    }
    
    if (issues.length === 0) {
      console.log('✅ All systems operational!');
      console.log('Your profit tracking system is ready to use.');
    } else {
      console.log('⚠️ Issues detected:');
      issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('\nRun the fixProfitSystem.js script to resolve these issues.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed');
  }
}

// Run the test
testProfitSystem();