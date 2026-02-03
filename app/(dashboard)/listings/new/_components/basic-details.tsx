import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ListingFormValues } from '@/types/listings/index'
import { UseFormReturn } from 'react-hook-form'
import {
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  SIZE_OPTIONS,
} from './form-constants'

interface Props {
  form: UseFormReturn<ListingFormValues>
}
const BasicDetailsForm = ({ form }: Props) => {
  const selectedColor = form.watch('colour')
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Name */}
      <FormField
        control={form.control}
        name="dressName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="eg. Classic Tee" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Brand */}
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <FormControl>
              <Input placeholder="eg. Acme Co." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Size (Select) */}
      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Size</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SIZE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Color */}
      <FormField
        control={form.control}
        name="colour"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <div
                      style={{ backgroundColor: selectedColor }}
                      className={cn('h-5 w-5  rounded-md mr-3')}
                    />{' '}
                    Pick a color
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <ColorPicker
                    initialColor={field.value}
                    onChange={field.onChange}
                    label="Choose a color"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Condition (Select) */}
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condition</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select condition"
                    className="text-black"
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONDITION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category (Select) */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default BasicDetailsForm
