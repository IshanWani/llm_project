
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TagType, PriorityType, tagColors } from "@/context/TaskContext";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: {
    dateFilter: string;
    priorityFilter: PriorityType | "all";
    tagFilter: TagType | "all";
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    dateFilter: string;
    priorityFilter: PriorityType | "all";
    tagFilter: TagType | "all";
  }>>;
}

const TabNavigation = ({ 
  activeTab, 
  setActiveTab, 
  filters, 
  setFilters 
}: TabNavigationProps) => {
  const tabs = [
    { id: "todo", label: "To be done" },
    { id: "done", label: "Done" },
    { id: "analytics", label: "Analytics" },
  ];

  const dateFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "next_day", label: "Next Day" },
    { value: "next_week", label: "Next Week" },
    { value: "next_month", label: "Next Month" },
    { value: "next_six_months", label: "Next 6 Months" },
    { value: "past_week", label: "Past Week" },
    { value: "past_month", label: "Past Month" },
    { value: "all_past", label: "All Past" },
  ];

  const priorityOptions: Array<{ value: PriorityType | "all"; label: string }> = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  const tagOptions: Array<{ value: TagType | "all"; label: string }> = [
    { value: "all", label: "All Tags" },
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "health", label: "Health" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "social", label: "Social" },
    { value: "home", label: "Home" },
    { value: "other", label: "Other" },
  ];

  const handleDateFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, dateFilter: value }));
  };

  const handlePriorityFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, priorityFilter: value as PriorityType | "all" }));
  };

  const handleTagFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, tagFilter: value as TagType | "all" }));
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="glass-panel rounded-full p-1.5 flex justify-between items-center max-w-md mx-auto">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute inset-0 bg-primary rounded-full animate-in fade-in" />
              )}
            </button>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-white shadow-md"
              aria-label="Filter tasks"
            >
              <Filter className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
                By Date
              </DropdownMenuLabel>
              <Select value={filters.dateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
                By Priority
              </DropdownMenuLabel>
              <Select value={filters.priorityFilter} onValueChange={handlePriorityFilterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
                By Tag
              </DropdownMenuLabel>
              <Select value={filters.tagFilter} onValueChange={handleTagFilterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  {tagOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TabNavigation;
