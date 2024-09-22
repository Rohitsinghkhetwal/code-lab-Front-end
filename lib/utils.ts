import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// zod validation

export const authformSchema = (type: string) => z.object({
  email: z.string().email(),
  password: z.string().min(8),
  //optional fields
  username: type === 'sign-in' ? z.string().optional(): z.string().min(4)

}) 

