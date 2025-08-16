"use client";

import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { InputHTMLAttributes } from "react";

interface UIPosNumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

interface UITelephoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

interface UIPostalCodeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

interface UIFaxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export const UIFaxInput = ({
  onChange,
  onValueChange,
  ...props
}: UIFaxInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    onChange?.({
      ...e,
      target: {
        ...e.target,
        value,
      },
    });

    onValueChange?.(value);
  };

  return (
    <Input
      type="tel"
      inputMode="numeric"
      placeholder="03-1234-5678"
      {...props}
      onChange={handleChange}
    />
  );
};

export const UIPostalCodeInput = ({
  onChange,
  onValueChange,
  ...props
}: UIPostalCodeInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");

    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    onChange?.({
      ...e,
      target: {
        ...e.target,
        value,
      },
    });
    onValueChange?.(value);
  };

  return (
    <Input
      type="tel"
      inputMode="numeric"
      pattern="\d{7}"
      maxLength={7}
      placeholder="123-4567"
      {...props}
      onChange={handleChange}
    />
  );
};

export const UITelephoneInput = ({
  onChange,
  onValueChange,
  ...props
}: UITelephoneInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    onChange?.({
      ...e,
      target: {
        ...e.target,
        value,
      },
    });

    onValueChange?.(value);
  };

  return (
    <Input
      type="tel"
      inputMode="numeric"
      placeholder="03-1234-5678"
      {...props}
      onChange={handleChange}
    />
  );
};

export const UIPosNumberInput = ({
  onChange,
  onValueChange,
  ...props
}: UIPosNumberInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/^0+/, "") || "0";
    const num = Number(value);

    if (num < 0) value = "0";

    onChange?.({
      ...e,
      target: {
        ...e.target,
        value,
      },
    });
    onValueChange?.(value);
  };
  return <Input type="number" {...props} onChange={handleChange} />;
};
