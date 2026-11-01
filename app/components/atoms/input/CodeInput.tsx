import { useEffect, useRef, useState } from "react";

export interface CodeInputProps {
  length: number;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: (code: string) => void;
}

export function CodeInput({
  length,
  value,
  error,
  onChange,
  onSubmit,
}: CodeInputProps) {
  const [code, setCode] = useState<string[]>(
    value ? value.split("") : new Array(length).fill(""),
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value !== undefined) {
      setCode(
        value
          .split("")
          .concat(new Array(Math.max(0, length - value.length)).fill("")),
      );
    }
  }, [value, length]);

  const handleChange = (inputValue: string, index: number) => {
    const digit = inputValue.replace(/[^0-9]/g, "").slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newCode.join("");

    onChange?.(fullCode);

    if (fullCode.length === length) {
      onSubmit(fullCode);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      const newCode = [...code];

      if (!code[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      } else if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
        onChange?.(newCode.join(""));
      }
    }
  };

  const setInputRef = (el: HTMLInputElement | null, index: number) => {
    inputRefs.current[index] = el;
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);

    if (index > 0 && !code[index - 1]) {
      inputRefs.current[code.indexOf("")]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (!pastedData) return;

    const digits = pastedData.slice(0, length).split("");
    const newCode = [...code];

    digits.forEach((digit, i) => {
      newCode[i] = digit;
    });

    setCode(newCode);
    onChange?.(newCode.join(""));

    const nextIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    const fullCode = newCode.join("");
    if (fullCode.length === length) {
      onSubmit(fullCode);
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {code.map((val, index) => {
          return (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              ref={(el) => setInputRef(el, index)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleClick(index)}
              onPaste={handlePaste}
              className={`size-12 text-center text-lg border text-slate-700 border-black rounded 
                        ${error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-slate-500"}`}
            />
          );
        })}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
