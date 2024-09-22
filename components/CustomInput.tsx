import React from "react";
import { z } from "zod";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Control ,FieldPath} from "react-hook-form";
import { Input } from "./ui/input";
import { authformSchema } from "@/lib/utils";


const formSchema = authformSchema("sign-up");

interface customInput {
  control: Control<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  name: FieldPath<z.infer<typeof formSchema>>;
}

const CustomInput = ({ control, label, placeholder, name }: customInput) => {
  return (
    <div className="flex flex-col w-full">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
              {label}
            </FormLabel>
            <div className="flex flex-col w-full">
              <FormControl>
                <Input
                  placeholder={placeholder}
                  className="text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 py-3 "
                  type={name === "password" ? "password" : "text"}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-12 text-red-500 mt-3" />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default CustomInput;
