
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskContext } from "@/context/TaskContext";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags = [], onTagsChange }: TagSelectorProps) {
  const { availableTags } = useTaskContext();
  
  const handleTagChange = (value: string) => {
    onTagsChange([value]);
  };

  return (
    <Select 
      value={selectedTags[0] || ''} 
      onValueChange={handleTagChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a tag..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tags</SelectItem>
        {availableTags.map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
