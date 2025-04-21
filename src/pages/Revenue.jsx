import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';

export function Revenue() {
  const [revenueSummary] = useState({
    totalRevenue: 156750.00,
    currentMonth: 24500.00,
    lastMonth: 22300.00,
    percentChange: 9.87,
    revenueByMonth: [
      { month: 'Jan', amount: 18200 },
      { month: 'Feb', amount: 19500 },
      { month: 'Mar', amount: 21000 },
      { month: 'Apr', amount: 20100 },
      { month: 'May', amount: 22300 },
      { month: 'Jun', amount: 24500 },
    ],
    topCourses: [
      { name: 'Advanced Piano', revenue: 6200, students: 23 },
      { name: 'Music Theory Fundamentals', revenue: 5800, students: 42 },
      { name: 'Guitar for Beginners', revenue: 4900, students: 35 },
      { name: 'Violin Mastery', revenue: 4500, students: 18 },
      { name: 'Vocal Training', revenue: 3100, students: 15 },
    ],
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Revenue</h1>
          <p className="text-muted-foreground">Financial performance and analysis</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('week')}
          >
            Week
          </Button>
          <Button 
            variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('month')}
          >
            Month
          </Button>
          <Button 
            variant={selectedTimeframe === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('year')}
          >
            Year
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueSummary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueSummary.currentMonth)}</div>
            <div className="flex items-center">
              <span className={`text-xs ${revenueSummary.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {revenueSummary.percentChange >= 0 ? '+' : ''}{revenueSummary.percentChange.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">138</div>
            <p className="text-xs text-muted-foreground">Monthly subscribers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(178)}</div>
            <p className="text-xs text-muted-foreground">Per student</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex flex-col justify-center items-center space-y-2 text-muted-foreground">
                <p>Revenue Chart Visualization</p>
                <p className="text-sm">(Chart component would display here)</p>
                <div className="flex h-40 w-full items-end gap-2 justify-center">
                  {revenueSummary.revenueByMonth.map((item, index) => (
                    <div key={index} className="relative w-12">
                      <div 
                        className="bg-primary/90 rounded-t-md w-full" 
                        style={{ 
                          height: `${(item.amount / revenueSummary.currentMonth) * 100}px`,
                          maxHeight: '130px',
                          minHeight: '30px'
                        }}
                      />
                      <span className="text-xs mt-1 block text-center">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueSummary.topCourses.map((course, index) => (
                  <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.students} students</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(course.revenue)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 