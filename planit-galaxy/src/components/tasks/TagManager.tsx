
import React, { useState } from "react";
import { useTaskContext, TagType } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import TagBadge from "./TagBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface TagManagerProps {
  selectedTag: TagType;
  onTagSelect: (tag: TagType) => void;
}

const TagManager = ({ selectedTag, onTagSelect }: TagManagerProps) => {
  const { availableTags, addCustomTag, removeTag } = useTaskContext();
  const [newTag, setNewTag] = useState("");
  const [showTagManager, setShowTagManager] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<TagType | null>(null);

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    const normalizedTag = newTag.toLowerCase().trim() as TagType;

    if (availableTags.includes(normalizedTag)) {
      toast.info("This tag already exists");
      setNewTag("");
      return;
    }

    await addCustomTag(normalizedTag);
    toast.success(`Tag "${normalizedTag}" added`);
    setNewTag("");
  };

  const handleDeleteTag = async (tag: TagType) => {
    await removeTag(tag);
    toast.success(`Tag "${tag}" deleted`);
    setShowConfirmDelete(null);
    
    // If the deleted tag was selected, switch to "other"
    if (selectedTag === tag) {
      onTagSelect("other");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-3">
        {availableTags.map((tag) => (
          <div
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`cursor-pointer transition-all ${
              selectedTag === tag ? "scale-110 ring-2 ring-primary" : ""
            }`}
          >
            <TagBadge tag={tag} />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTagManager(true)}
          className="px-2 h-6"
        >
          <Plus className="h-3 w-3 mr-1" /> Manage
        </Button>
      </div>

      <Dialog open={showTagManager} onOpenChange={setShowTagManager}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Add new tag */}
            <div className="flex items-center gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag name"
                className="flex-1"
              />
              <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {/* Tag list */}
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
              <h3 className="text-sm font-medium mb-2">Available Tags</h3>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center justify-between py-1">
                    <TagBadge tag={tag} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmDelete(tag)}
                      className="h-6 w-6 p-0"
                      disabled={tag === "other"} // Cannot delete the "other" tag
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagManager(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete dialog */}
      {showConfirmDelete && (
        <Dialog open={!!showConfirmDelete} onOpenChange={() => setShowConfirmDelete(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Tag</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete the tag "{showConfirmDelete}"?
                Tasks with this tag will be moved to "other".
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTag(showConfirmDelete)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TagManager;
