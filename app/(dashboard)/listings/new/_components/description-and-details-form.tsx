import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { ListingFormValues } from "@/types/listings/index";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<ListingFormValues>;
}

const DescriptionAndDetailsForm = ({ form }: Props) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the dress (style, fit, special details...)"
                className="resize-none"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Material */}
      <FormField
        control={form.control}
        name="material"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Material</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Silk, Cotton, Polyester" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Care Instructions */}
      <FormField
        control={form.control}
        name="careInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Care Instructions</FormLabel>
            <Select
              value={field.value || ""} // ✅ controlled
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select care instructions" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Dry Clean Only">Dry Clean Only</SelectItem>
                <SelectItem value="Hand Wash">Hand Wash</SelectItem>
                <SelectItem value="Machine Wash">Machine Wash</SelectItem>
                <SelectItem value="Delicate Wash">Delicate Wash</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pickupOption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pickup Option</FormLabel>
            <Select
              value={field.value || ""} // ✅ controlled
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Local">Local</SelectItem>
                <SelectItem value="Australia-wide">Australia-wide</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DescriptionAndDetailsForm;
