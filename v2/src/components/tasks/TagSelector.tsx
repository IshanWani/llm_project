
import React, { useEffect, useState } from 'react';
import { MultiSelect } from "@/components/ui/multi-select";
import { useTaskContext } from "@/context/TaskContext";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const { availableTags } = useTaskContext();
  
  const tagOptions = availableTags.map(tag => ({
    value: tag,
    label: tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
  }));

  return (
    <MultiSelect
      options={tagOptions}
      value={selectedTags}
      onChange={onTagsChange}
      placeholder="Select tags..."
    />
  );
}
