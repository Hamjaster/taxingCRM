// app/api/admin/clients/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { requireAdmin } from '@/lib/middleware';
import { ChartDataType } from '@/types';

// Helper function to get month name
const getMonthName = (date: Date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
};

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const adminUser = requireAdmin(request);

    // Get current date and calculate date ranges
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get data for last 6 months
    const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
    
    // Fetch all clients for this admin
    const clients = await Client.find({
      assignedAdminId: adminUser.id,
      createdAt: { $gte: sixMonthsAgo }
    }).select('clientType createdAt status');

    // Initialize data structure for each month
    const monthlyData: { [key: string]: any } = {};
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const monthKey = getMonthName(monthDate);
      monthlyData[monthKey] = {
        totalAccounts: 0,
        businessClients: 0,
        individualClients: 0,
        entityFormation: 0,
      };
    }

    // Process clients and aggregate by month and type
    clients.forEach(client => {
      const monthKey = getMonthName(client.createdAt);
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].totalAccounts++;
        
        switch (client.clientType) {
          case 'Business':
            monthlyData[monthKey].businessClients++;
            break;
          case 'Individual':
            monthlyData[monthKey].individualClients++;
            break;
          case 'Entity':
            monthlyData[monthKey].entityFormation++;
            break;
        }
      }
    });

    // Convert to array format for charts
    const chartData : ChartDataType = {
      totalAccounts: [],
      businessClients: [],
      individualClients: [],
      entityFormation: [],
    };

    Object.keys(monthlyData).forEach(month => {
      chartData.totalAccounts.push({ month, value: monthlyData[month].totalAccounts });
      chartData.businessClients.push({ month, value: monthlyData[month].businessClients });
      chartData.individualClients.push({ month, value: monthlyData[month].individualClients });
      chartData.entityFormation.push({ month, value: monthlyData[month].entityFormation });
    });

    // Calculate current totals and changes
    const currentMonthKey = getMonthName(currentDate);
    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const previousMonthKey = getMonthName(previousMonthDate);

    // Get current month's data
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
    
    const currentMonthClients = await Client.find({
      assignedAdminId: adminUser.id,
      createdAt: { $gte: currentMonthStart, $lt: nextMonthStart }
    }).select('clientType');

    // Get previous month's data
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
    
    const previousMonthClients = await Client.find({
      assignedAdminId: adminUser.id,
      createdAt: { $gte: previousMonthStart, $lt: currentMonthStart }
    }).select('clientType');

    // Calculate current month stats
    const currentStats = {
      total: currentMonthClients.length,
      business: currentMonthClients.filter(c => c.clientType === 'Business').length,
      individual: currentMonthClients.filter(c => c.clientType === 'Individual').length,
      entity: currentMonthClients.filter(c => c.clientType === 'Entity').length,
    };

    // Calculate previous month stats
    const previousStats = {
      total: previousMonthClients.length,
      business: previousMonthClients.filter(c => c.clientType === 'Business').length,
      individual: previousMonthClients.filter(c => c.clientType === 'Individual').length,
      entity: previousMonthClients.filter(c => c.clientType === 'Entity').length,
    };

    // Get total counts for all time
    
    const stats = await Client.aggregate([
      {
        $group: {
          _id: "$clientType",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format results
    let result = {
      totalAccounts: 0,
      businessAccounts: 0,
      individualAccounts: 0,
      entityAccounts: 0
    };

    stats.forEach(item => {
      result.totalAccounts += item.count;
      if (item._id === "Business") result.businessAccounts = item.count;
      if (item._id === "Individual") result.individualAccounts = item.count;
      if (item._id === "Entity") result.entityAccounts = item.count;
    });


    // Calculate percentage changes
    const changes = {
      total: calculatePercentageChange(currentStats.total, previousStats.total),
      business: calculatePercentageChange(currentStats.business, previousStats.business),
      individual: calculatePercentageChange(currentStats.individual, previousStats.individual),
      entity: calculatePercentageChange(currentStats.entity, previousStats.entity),
    };

    // Prepare response
    const response = {
      success: true,
      data: {
        chartData,
        currentStats: {
          totalAccounts: {
            value: result.totalAccounts,
            change: changes.total,
            trend: changes.total >= 0 ? 'up' : 'down'
          },
          businessClients: {
            value: result.businessAccounts,
            change: changes.business,
            trend: changes.business >= 0 ? 'up' : 'down'
          },
          individualClients: {
            value: result.individualAccounts,
            change: changes.individual,
            trend: changes.individual >= 0 ? 'up' : 'down'
          },
          entityFormation: {
            value: result.entityAccounts,
            change: changes.entity,
            trend: changes.entity >= 0 ? 'up' : 'down'
          },
          // Placeholder data for registered agent and publication
          registeredAgent: {
            value: 0,
            change: 0,
            trend: 'up'
          },
          publication: {
            value: 0,
            change: 0,
            trend: 'up'
          }
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get client stats error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}