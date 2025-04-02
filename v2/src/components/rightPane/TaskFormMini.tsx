import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { TagType, PriorityType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TaskFormMini = () => {
  const { addTask, availableTags } = useTaskContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    review: "",
    priority: "medium" as PriorityType,
    status: false,
    tag: "" as TagType,
    links: "",
    timeRequired: "",
    scheduledDate: "",
    scheduleFrom: "",
    scheduleTo: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask({
        title: formData.title,
        description: formData.description || "",
        priority: formData.priority || "medium",
        completed: false,
        tag: formData.tag || "other",
        links: formData.links || "",
        review: formData.review || "",
        scheduleFrom: formData.scheduleFrom || null,
        scheduleTo: null,
        timeRequired: formData.timeRequired || null,
        scheduledDate: formData.scheduledDate || null,
      });

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        review: "",
        priority: "medium",
        status: false,
        tag: "",
        links: "",
        timeRequired: "",
        scheduledDate: "",
        scheduleFrom: "",
        scheduleTo: ""
      });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <ScrollArea className="h-[500px] w-[300px] rounded-md border p-2">
      <div className="px-2">
        <div className="flex items-center justify-between mb-2 border-b pb-2">
          <div className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Quick Add Task</h3>
          </div>
          <Button size="sm" onClick={handleSubmit} className="h-7 px-2">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        <form className="space-y-2">
          <div>
            <Label className="text-xs" htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="review">Review</Label>
            <Input
              id="review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs" htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value.toUpperCase() }))}
              className="h-7 text-xs uppercase"
              placeholder="Enter tag"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="links">Links</Label>
            <Input
              id="links"
              name="links"
              value={formData.links}
              onChange={handleInputChange}
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="timeRequired">Time Required (hh:mm)</Label>
            <Input
              id="timeRequired"
              name="timeRequired"
              type="time"
              value={formData.timeRequired}
              onChange={handleInputChange}
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="scheduledDate">Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="text"
                  value={formData.scheduledDate ? format(new Date(formData.scheduledDate), 'dd/MM/yyyy') : ''}
                  onChange={handleInputChange}
                  className="h-7 text-xs"
                  readOnly
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.scheduledDate ? new Date(formData.scheduledDate) : undefined}
                  onSelect={(date) => date && setFormData(prev => ({...prev, scheduledDate: date.toLocaleDateString()}))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div>
              <Label className="text-xs" htmlFor="scheduleFrom">From</Label>
              <Input
                id="scheduleFrom"
                name="scheduleFrom"
                type="time"
                value={formData.scheduleFrom}
                onChange={handleInputChange}
                className="h-7 text-xs w-full"
              />
            </div>
            <div>
              <Label className="text-xs" htmlFor="scheduleTo">To</Label>
              <Input
                id="scheduleTo"
                name="scheduleTo"
                type="time"
                value={formData.scheduleTo}
                onChange={handleInputChange}
                className="h-7 text-xs w-full"
              />
            </div>
          </div>
        </form>
      </div>
    </ScrollArea>
  );
};

export default TaskFormMini;