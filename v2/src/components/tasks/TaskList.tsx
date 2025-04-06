import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/tasks/TaskCard";
import { cn } from "@/lib/utils";
import { PriorityType, TagType } from "@/context/TaskContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  console.log("All tasks in context:", allTasks);
  const tasks = getFilteredTasks(
    completed,
    dateFilter,
    priorityFilter,
    tagFilter,
  );
  console.log("Filtered tasks:", tasks, {
    completed,
    dateFilter,
    priorityFilter,
    tagFilter,
  });
  const [rightPaneOpen, setRightPaneOpen] = useState(true);

  // Listen for the custom event from RightPane
  useEffect(() => {
    const handleRightPaneToggle = (event: CustomEvent<{ isOpen: boolean }>) => {
      setRightPaneOpen(event.detail.isOpen);
    };

    // Add event listener with type assertion
    window.addEventListener(
      "rightpane-toggle",
      handleRightPaneToggle as EventListener,
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "rightpane-toggle",
        handleRightPaneToggle as EventListener,
      );
    };
  }, []);

  // Add error boundary to safely render tasks even if some have issues
  const safeRenderTasks = () => {
    try {
      return tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={{
            ...task,
            tag: task.tag || "other", // Ensure tag is never null
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

  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const generateSummary = () => {
    const tagTasks = tasks.filter(task => 
      selectedTag === "all" ? true : task.tag === selectedTag
    );
    
    const summaryText = `
      Total Tasks: ${tagTasks.length}
      Completed: ${tagTasks.filter(t => t.completed).length}
      High Priority: ${tagTasks.filter(t => t.priority === 'high').length}
      Medium Priority: ${tagTasks.filter(t => t.priority === 'medium').length}
      Low Priority: ${tagTasks.filter(t => t.priority === 'low').length}
    `;
    
    setSummary(summaryText);
    setShowSummary(true);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tag for summary" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {Array.from(new Set(tasks.map(t => t.tag))).map(tag => (
              <SelectItem key={tag} value={tag || 'other'}>{tag || 'other'}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={generateSummary}>Generate Summary</Button>
      </div>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Summary for {selectedTag}</DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </DialogContent>
      </Dialog>

      <div
        className={cn(
          "space-y-4 transition-all duration-300",
        rightPaneOpen ? "pr-[380px] md:pr-[380px]" : "pr-0",
        className,
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
  );
};

export default TaskList;
