
import { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useRightPaneContext } from '@/context/RightPaneContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from "lucide-react";

export const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { tasks, deleteTask, toggleTaskCompletion } = useTaskContext();
  const { isRightPaneOpen } = useRightPaneContext();

  const tasksForSelectedDate = tasks.filter(task => {
    if (!date || !task.scheduledDate) return false;
    const taskDate = new Date(task.scheduledDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });

  const handleEdit = (task: any) => {
    const event = new CustomEvent('edit-task', { 
      detail: {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        tag: task.tag,
        links: task.links,
        scheduledDate: task.scheduledDate,
        timeRequired: task.timeRequired,
        scheduleFrom: task.scheduleFrom,
        scheduleTo: task.scheduleTo,
        review: task.review
      } 
    });
    window.dispatchEvent(event);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    try {
      const time = new Date(`1970-01-01T${timeString}`);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <div className="bg-card rounded-lg p-4 shadow w-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md w-[280px]"
          />
        </div>
        <div className={cn(
          "flex-1 transition-all duration-300",
          isRightPaneOpen ? "mr-[400px]" : ""
        )}>
          <h3 className="text-lg font-semibold mb-4">
            Tasks for {date?.toLocaleDateString()}
          </h3>
          <div className="space-y-2">
            {tasksForSelectedDate.map(task => (
              <Card key={task.id} className="p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium truncate">{task.title}</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground space-y-1">
                      {task.description && <p className="truncate">{task.description}</p>}
                      {task.review && <p className="truncate">Review: {task.review}</p>}
                      {task.timeRequired > 0 && <p>Time Required: {task.timeRequired}h</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                          {task.tag}
                        </span>
                      </div>
                      {(task.scheduleFrom || task.scheduleTo) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Time: {formatTime(task.scheduleFrom)} - {formatTime(task.scheduleTo)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {tasksForSelectedDate.length === 0 && (
              <p className="text-muted-foreground">No tasks scheduled for this date</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
