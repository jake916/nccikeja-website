"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

type SelectControlProps = {
  /** Form field name; omit for a standalone control such as a filter */
  name?: string;
  /** Accessible name when there is no visible <label> pointing at the control */
  label?: string;
  options: SelectOption[];
  placeholder: string;
  /** Controlled value; leave out to let the control track its own choice */
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  /** Trigger styles for the field look */
  className: string;
  placeholderClassName: string;
  /** Dropdown card and option styles for the field look */
  menuClassName: string;
  optionClassName: string;
  chevron: { src: string; width: number; height: number; className: string };
};

/**
 * Custom dropdown. Inside a form it keeps a hidden native select in sync, so
 * submission and `required` validation work exactly as before.
 */
export function SelectControl({
  name,
  label,
  options,
  placeholder,
  value: controlledValue,
  onValueChange,
  required,
  error,
  className,
  placeholderClassName,
  menuClassName,
  optionClassName,
  chevron,
}: SelectControlProps) {
  const [ownValue, setOwnValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const triggerId = name ?? `${listId}-trigger`;

  const value = controlledValue ?? ownValue;
  const setValue = (next: string) => {
    if (controlledValue === undefined) setOwnValue(next);
    onValueChange?.(next);
  };

  const selected = options.find((option) => option.value === value);

  // Close when clicking anywhere outside the field.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Clear the choice when the form resets (React resets forms after an action).
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => setOwnValue("");
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  // Keep the highlighted option in view while navigating with the keyboard.
  useEffect(() => {
    if (open && active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function openMenu() {
    setActive(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  }

  function choose(option: SelectOption) {
    setValue(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(options.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (options[active]) choose(options[active]);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-label={label}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(className, "flex cursor-pointer items-center pr-11 text-left", !selected && placeholderClassName)}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
      </button>
      <Image
        src={chevron.src}
        alt=""
        width={chevron.width}
        height={chevron.height}
        className={cn("pointer-events-none absolute  duration-200", chevron.className, open && "rotate-180 -top-1")}
      />

      {/* Native select carries the value for FormData and browser validation. */}
      {name && (
        <select
          name={name}
          value={value}
          required={required}
          onChange={(event) => setValue(event.target.value)}
          onInvalid={() => triggerRef.current?.focus()}
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-px opacity-0"
        >
          <option value="" />
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={triggerId}
          className={cn(
            "absolute top-[calc(100%+6px)] left-0 z-30 max-h-64 min-w-full overflow-y-auto border bg-surface-bright py-1.5 shadow-[0_12px_32px_-8px_rgb(0_0_0/0.18)]",
            menuClassName,
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 select-none",
                  optionClassName,
                  index === active && "bg-navy/5",
                  isSelected && "font-medium text-navy",
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <svg viewBox="0 0 16 16" aria-hidden className="size-4 shrink-0 fill-none stroke-current stroke-2">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
