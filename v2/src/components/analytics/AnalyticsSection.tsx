
import React from "react";
import { useTaskContext, TagType } from "@/context/TaskContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface AnalyticsSectionProps {
  className?: string;
}

const AnalyticsSection = ({ className }: AnalyticsSectionProps) => {
  const { tasks } = useTaskContext();
  
  // Calculate tag distribution
  const getTagDistribution = () => {
    const distribution: Record<string, number> = {};
    
    tasks.forEach((task) => {
      const tagName = task.tag || "other"; // Use "other" as fallback if tag is null
      if (distribution[tagName]) {
        distribution[tagName]++;
      } else {
        distribution[tagName] = 1;
      }
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };
  
  // Calculate completion rate
  const getCompletionRate = () => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    
    return [
      { name: "Completed", value: completedTasks },
      { name: "Pending", value: totalTasks - completedTasks },
    ];
  };
  
  // Get priority distribution
  const getPriorityDistribution = () => {
    const distribution: Record<string, number> = { low: 0, medium: 0, high: 0 };
    
    tasks.forEach((task) => {
      distribution[task.priority]++;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value 
    }));
  };
  
  // Mock time allocation data (to be replaced with real data in a full implementation)
  const timeAllocationData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.2 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 4.0 },
    { day: "Fri", hours: 2.0 },
    { day: "Sat", hours: 1.0 },
    { day: "Sun", hours: 0.5 },
  ];
  
  // Mock trend data (to be replaced with real data in a full implementation)
  const trendData = [
    { week: "Week 1", tasks: 12, completed: 8 },
    { week: "Week 2", tasks: 15, completed: 10 },
    { week: "Week 3", tasks: 18, completed: 14 },
    { week: "Week 4", tasks: 14, completed: 12 },
  ];
  
  // Colors for charts
  const COLORS = ["#007AFF", "#34C759", "#5856D6", "#FF9500", "#FF2D55", "#AF52DE", "#FF3B30", "#5AC8FA"];
  
  const tagDistribution = getTagDistribution();
  const completionRate = getCompletionRate();
  const priorityDistribution = getPriorityDistribution();

  return (
    <div className={cn("space-y-8 p-6", className)}>
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Completion Rate */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-lg font-medium mb-4">Task Completion Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionRate}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {completionRate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#34C759" : "#FF3B30"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Tag Distribution */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-lg font-medium mb-4">Tasks by Tag</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tagDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {tagDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Priority Distribution */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-lg font-medium mb-4">Priority Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#5856D6">
                  {priorityDistribution.map((entry, index) => {
                    const colors = {
                      Low: "#34C759",
                      Medium: "#FF9500",
                      High: "#FF3B30"
                    };
                    // @ts-ignore - Type issues with dynamic property access
                    return <Cell key={`cell-${index}`} fill={colors[entry.name]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
