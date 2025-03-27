import React, { useState } from "react";
import { useTaskContext, TagType, PriorityType } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusCircle, X, Plus, Bell, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskFormMini = () => {
  const { addTask, availableTags, session } = useTaskContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as PriorityType,
    tag: "work" as TagType,
    timeSlot: "",
    duration: "",
    links: "",
    deadline: "",
    scheduledDate: "",
    notificationsEnabled: false,
    emailNotification: session?.user?.email || "",
    notificationTime: "09:00"
  });
  
  const [customTag, setCustomTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleTagSelect = (tag: TagType) => {
    setFormData(prev => ({
      ...prev,
      tag
    }));
  };
  
  const handleAddCustomTag = () => {
    if (!customTag.trim()) {
      return;
    }
    
    const normalizedTag = customTag.toLowerCase().trim() as TagType;
    
    setFormData(prev => ({
      ...prev,
      tag: normalizedTag
    }));
    
    setCustomTag("");
    setShowTagInput(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please log in to add tasks");
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    await addTask(formData);
    
    toast.success("Task added successfully!");
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      tag: "work",
      timeSlot: "",
      duration: "",
      links: "",
      deadline: "",
      scheduledDate: "",
      notificationsEnabled: false,
      emailNotification: session?.user?.email || "",
      notificationTime: "09:00"
    });
  };

  if (!session) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Please sign in to add tasks</p>
      </div>
    );
  }

  return (
    <div className="p-2 h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
        <PlusCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Quick Add Task</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2 text-sm">
        <div>
          <Label htmlFor="mini-title" className="text-xs">Title</Label>
          <Input
            id="mini-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task title"
            className="h-8 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="mini-priority" className="text-xs">Priority</Label>
            <select
              id="mini-priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="mini-scheduledDate" className="text-xs">Scheduled Date</Label>
            <Input
              id="mini-scheduledDate"
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="mini-tag" className="text-xs">Tag</Label>
          <div className="space-y-1">
            {!showTagInput ? (
              <Select
                value={formData.tag}
                onValueChange={(value: string) => {
                  if (value === "custom") {
                    setShowTagInput(true);
                  } else if (value) {
                    handleTagSelect(value as TagType);
                  }
                }}
              >
                <SelectTrigger className="h-6 text-xs">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag} className="text-xs">
                      {tag}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-xs">+ Add custom tag</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Enter custom tag"
                  className="flex-1 h-6 rounded-md border border-input bg-background px-2 py-0.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  onClick={handleAddCustomTag}
                  disabled={!customTag}
                  className="h-6 w-6"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  onClick={() => {
                    setShowTagInput(false);
                    setCustomTag("");
                  }}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="mini-links" className="text-xs">Links and Resources</Label>
          <div className="relative">
            <Link className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              id="mini-links"
              name="links"
              value={formData.links}
              onChange={handleInputChange}
              placeholder="Resources or URLs"
              className="h-8 text-sm pl-7"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="mini-timeSlot" className="text-xs">Time Slot</Label>
            <Input
              id="mini-timeSlot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              placeholder="e.g. 14:00-15:30"
              className="h-8 text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="mini-deadline" className="text-xs">Deadline</Label>
            <Input
              id="mini-deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="pt-1 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Bell className="h-3 w-3 text-muted-foreground" />
              <Label className="text-xs">Notifications</Label>
            </div>
            <Switch
              id="mini-notificationsEnabled"
              checked={formData.notificationsEnabled}
              onCheckedChange={(checked) => 
                handleCheckboxChange("notificationsEnabled", checked)
              }
              className="scale-75"
            />
          </div>
          
          {formData.notificationsEnabled && (
            <div className="grid grid-cols-2 gap-2 mt-2 animate-in slide-in-from-top duration-300">
              <div>
                <Label htmlFor="mini-emailNotification" className="text-xs">Email</Label>
                <Input
                  id="mini-emailNotification"
                  type="email"
                  name="emailNotification"
                  value={formData.emailNotification}
                  onChange={handleInputChange}
                  className="h-8 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="mini-notificationTime" className="text-xs">Time</Label>
                <Input
                  id="mini-notificationTime"
                  type="time"
                  name="notificationTime"
                  value={formData.notificationTime}
                  onChange={handleInputChange}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full h-8 text-sm mt-2">Add Task</Button>
      </form>
    </div>
  );
};

export default TaskFormMini;
