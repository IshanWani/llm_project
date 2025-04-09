
import React, { useState } from "react";
import { useTaskContext, TagType } from "@/context/TaskContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsSectionProps {
  className?: string;
}

const AnalyticsSection = ({ className }: AnalyticsSectionProps) => {
  const { tasks, availableTags } = useTaskContext();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const getTagDistribution = () => {
    const distribution: Record<string, number> = {};
    tasks.forEach((task) => {
      const tagName = task.tag || "other";
      distribution[tagName] = (distribution[tagName] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };
  
  const getCompletionRate = () => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    return [
      { name: "Completed", value: completedTasks },
      { name: "Pending", value: totalTasks - completedTasks },
    ];
  };
  
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

  const generateTaskSummary = async () => {
    if (!selectedTags.length) {
      setSummary("Please select at least one tag");
      return;
    }

    setIsGenerating(true);
    const filteredTasks = tasks.filter(task => 
      selectedTags.includes(task.tag || 'other') &&
      new Date(task.createdAt).toDateString() === selectedDate?.toDateString()
    );

    const taskDetails = filteredTasks.map(task => ({
      title: task.title,
      status: task.completed ? 'completed' : 'pending',
      review: task.review || 'No review available',
    }));

    try {
      const { data, error } = await supabase.functions.invoke('gemini-task-assistant', {
        body: {
          messages: [{
            role: 'user',
            content: `Please provide a summary of these tasks: ${JSON.stringify(taskDetails)}`
          }],
          systemPrompt: "You are a task analyzer. Provide a concise summary of the tasks, highlighting completion status and key points from reviews when available."
        }
      });

      if (error) throw error;
      setSummary(data.generatedText);
    } catch (error) {
      setSummary("Error generating summary");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const COLORS = ["#007AFF", "#34C759", "#5856D6", "#FF9500", "#FF2D55"];

  return (
    <div className={cn("space-y-8 p-6", className)}>
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Left side - Task Summary */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Task Summary Generator</h3>
            <div className="space-y-4">
              <Select 
                value={selectedTags[0] || ""} 
                onValueChange={(value) => setSelectedTags([value])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tag for analysis" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">All Tags</SelectItem>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <Button 
                onClick={generateTaskSummary}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Summary"}
              </Button>
              {summary && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Completion Rate */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-lg font-medium mb-4">Task Completion Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCompletionRate()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getCompletionRate().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#34C759" : "#FF3B30"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-8">
        {/* Tag Distribution */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-lg font-medium mb-4">Tasks by Tag</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getTagDistribution()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getTagDistribution().map((_, index) => (
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
              <BarChart data={getPriorityDistribution()} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#5856D6">
                  {getPriorityDistribution().map((entry, index) => {
                    const colors = {
                      Low: "#34C759",
                      Medium: "#FF9500",
                      High: "#FF3B30"
                    };
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
