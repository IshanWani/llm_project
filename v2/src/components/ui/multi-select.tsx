
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options?: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options = [], value = [], onChange, placeholder }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const selectedLabels = (value || []).map(
    v => options.find(opt => opt.value === v)?.label || v
  );

  return (
    <div className="flex flex-col gap-2">
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-background">
          {selectedLabels.map(label => (
            <Badge
              key={label}
              variant="secondary"
              className="mr-1"
              onClick={() => {
                onChange(value.filter(v => options.find(opt => opt.value === v)?.label !== label));
              }}
            >
              {label}
              <X className="ml-1 h-3 w-3 cursor-pointer" />
            </Badge>
          ))}
        </div>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="text-muted-foreground">
              {selectedLabels.length === 0 ? placeholder : `${selectedLabels.length} selected`}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className="w-full">
            <CommandInput 
              placeholder="Search..." 
              value={inputValue} 
              onValueChange={setInputValue}
            />
            <CommandEmpty>No option found.</CommandEmpty>
            <ScrollArea className="h-[200px]">
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(
                        value.includes(option.value)
                          ? value.filter(v => v !== option.value)
                          : [...value, option.value]
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
