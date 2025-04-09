
import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/tasks/TaskCard";
import { cn } from "@/lib/utils";
import { PriorityType, TagType } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TaskListProps {
  completed: boolean;
  className?: string;
  dateFilter: string;
  priorityFilter: PriorityType | "all";
  tagFilter: TagType | "all";
}

const TaskList = ({
  completed,
  className,
  dateFilter,
  priorityFilter,
  tagFilter,
}: TaskListProps) => {
  const {
    getFilteredTasks,
    toggleTaskCompletion,
    tasks: allTasks,
  } = useTaskContext();

  const tasks = getFilteredTasks(completed, dateFilter, priorityFilter, tagFilter);
  const [rightPaneOpen, setRightPaneOpen] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const handleRightPaneToggle = (event: CustomEvent<{ isOpen: boolean }>) => {
      setRightPaneOpen(event.detail.isOpen);
    };

    window.addEventListener(
      "rightpane-toggle",
      handleRightPaneToggle as EventListener,
    );

    return () => {
      window.removeEventListener(
        "rightpane-toggle",
        handleRightPaneToggle as EventListener,
      );
    };
  }, []);

  const safeRenderTasks = () => {
    try {
      return tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={{
            ...task,
            tag: task.tag || "other",
          }}
          onToggleCompletion={toggleTaskCompletion}
        />
      ));
    } catch (error) {
      console.error("Error rendering tasks:", error);
      return (
        <div className="col-span-2 text-center py-10">
          <p className="text-red-500">
            Error displaying tasks. Please try refreshing the page.
          </p>
        </div>
      );
    }
  };

  const generateSummary = async () => {
    if (tasks.length === 0) {
      toast("No tasks found to summarize.");
      return;
    }
    
    const taskDetails = tasks.map(task => ({
      title: task.title,
      description: task.description || '',
      review: task.review || '',
      priority: task.priority,
      tag: task.tag,
      completed: task.completed,
      scheduledDate: task.scheduledDate
    }));

    const { data, error } = await supabase.functions.invoke('gemini-task-assistant', {
      body: {
        messages: [{
          role: 'user',
          content: `Please provide a comprehensive analysis of these tasks: ${JSON.stringify(taskDetails)}`
        }],
        systemPrompt: "You are a task analyzer. Generate a detailed summary including: 1) Total tasks and completion status 2) Distribution across different tags 3) Priority patterns 4) Common themes in descriptions and reviews 5) Upcoming deadlines and scheduled tasks"
      }
    });

    if (error) {
      toast(`Error generating summary: ${error.message}`, { type: 'error' });
      console.error("Error generating summary:", error);
      return;
    }

    setSummary(data.generatedText);
    setShowSummary(true);
    toast("Summary generated successfully!");
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <Button onClick={generateSummary}>Generate Tasks Summary</Button>
      </div>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tasks Summary</DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </DialogContent>
      </Dialog>

      <div
        className={cn(
          "space-y-4 transition-all duration-300",
          rightPaneOpen ? "pr-[380px] md:pr-[380px]" : "pr-0",
          className
        )}
      >
        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {completed
                ? "No completed tasks found with the selected filters."
                : "No pending tasks found with the selected filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
            {safeRenderTasks()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
