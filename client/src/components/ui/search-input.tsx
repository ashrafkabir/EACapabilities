import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  className = ""
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  const handleSearchClick = () => {
    onSearch(inputValue);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    // Only clear the search if the input becomes empty
    if (newValue === '') {
      onSearch('');
    }
  };

  return (
    <div className={`relative flex ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-2"
        />
      </div>
      <Button
        onClick={handleSearchClick}
        variant="outline"
        size="sm"
        className="ml-2"
      >
        Search
      </Button>
    </div>
  );
}
