import React, { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name: string;
}

const Select: React.FC<CustomSelectProps> = ({ options, defaultValue, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((option) => option.value === defaultValue) || null
  );

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);

    if (onChange) {
      // Create a synthetic event to mimic React.ChangeEvent<HTMLInputElement>
      const event = {
        target: {
          name,
          value: option.value,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onChange(event);
    }
  };

  return (
    <div className="w-full relative inline-block min-w-44">
      {/* Selected Option */}
      <div
        className="outline-none rounded-md bg-background border-2 border-border p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h1 className="font-bold text-text text-sm">
          {selectedOption ? selectedOption.label : placeholder ? placeholder : "Select an Option"}
        </h1>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-background rounded-md shadow-md border-2 border-border">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-foreground whitespace-nowrap text-textAlt text-sm hover:text-text duration-500 ${index === options.length - 1 ? "" : "border-b border-b-border"
                }`}
              onClick={() => handleOptionClick(option)}
            >
              <h1 className="font-bold">{option.label}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
