import { cn } from '@/lib/utils';
import React from 'react'

type items = {
    label: string;
    value: string;
    className?: string
}

const Item = ({ label, value, className }: items) => (
  <div className="grid grid-cols-[160px_1fr]">
    <p className="font-semibold">{label}</p>
    <p className={cn("font-semibold", className)}>{value}</p>
  </div>
)


export default Item