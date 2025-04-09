
import { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useRightPaneContext } from '@/context/RightPaneContext';
import { cn } from '@/lib/utils';

export const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { tasks } = useTaskContext();
  const { isRightPaneOpen } = useRightPaneContext();

  const { toggleTaskCompletion } = useTaskContext();
  
  const tasksForSelectedDate = tasks.filter(task => {
    if (!date || !task.scheduledDate) return false;
    const taskDate = new Date(task.scheduledDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });

  const handleToggleCompletion = (taskId: string) => {
    toggleTaskCompletion(taskId);
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
                    onChange={() => handleToggleCompletion(task.id)}
                    className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{task.title}</h4>
                    <div className="text-[10px] text-muted-foreground space-y-1">
                      {task.description && <p className="truncate">{task.description}</p>}
                      {task.review && <p className="truncate">Review: {task.review}</p>}
                      {task.timeRequired > 0 && <p>Time Required: {task.timeRequired}h</p>}
                      {task.scheduleFrom && <p>From: {new Date(task.scheduleFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                      {task.scheduleTo && <p>To: {new Date(task.scheduleTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                      <p className="font-medium">Priority: {task.priority}</p>
                      {task.tag && <p>Tag: {task.tag}</p>}
                    </div>
                    {(task.scheduleFrom || task.scheduleTo) && (
                      <div className="text-[11px] text-muted-foreground font-medium mt-1">
                        {task.scheduleFrom && new Date(task.scheduleFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {task.scheduleFrom && task.scheduleTo && ' - '}
                        {task.scheduleTo && new Date(task.scheduleTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1">
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
