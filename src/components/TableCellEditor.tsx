import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDefinition } from '@/types/types';
import { Textarea } from './ui/textarea';

interface TableCellEditorProps {
  value: any;
  column: ColumnDefinition;
  onSave: (value: any) => void;
}

export function TableCellEditor({ value, column, onSave }: TableCellEditorProps) {
    const handleChange = (newValue: any) => {
        onSave(newValue);
      };

  const renderEditor = () => {
    switch (column.type) {
      case 'string':
        return (
          <Input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            autoFocus
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
            autoFocus
          />
        );

      case 'boolean':
        return (
          <Checkbox
            checked={value}
            onCheckedChange={(checked) => handleChange(checked)}
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(value: string) => handleChange(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
               {(column.options || []).map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                    </SelectItem>     
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {value ? format(value, "PPP") : "Pick a date"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => handleChange(date)}
              />
            </PopoverContent>
          </Popover>
        );
      case 'json':
        return (
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 0)}
            onChange={(e) => {
              try {
                handleChange(JSON.parse(e.target.value));
              } catch {
                handleChange(e.target.value);
              }
            }}
            onFocus={(e) => {
              e.target.value = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {renderEditor()}
    </div>
  );
}