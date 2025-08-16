"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { UISubmitButton } from "@/components/customs/ui-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppContext } from "@/components/app-provider";
import { RequiredCharacter } from "@/components/customs/required-character";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UIPosNumberInput } from "@/components/customs/ui-input";
import { livingStatusOptions } from "@/lib/selections";

const formSchema = z.object({
  name: z.string().nonempty("このフィールドは必須です。"),
  age: z
    .string()
    .nonempty("このフィールドは必須です。")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: "年齢は1歳以上の数値でなければなりません",
      }
    ),
  relationship: z.string().nonempty("このフィールドは必須です。"),
  occupation: z.string().nonempty("このフィールドは必須です。"),
  living_status: z.string().nonempty("このフィールドは必須です。"),
  note: z.string().nonempty("このフィールドは必須です。"),
});

interface FormFamilyMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMemberProps[]>>;
  isEditMode?: boolean;
  setIsEditMode: (value: boolean) => void;
  data?: FamilyMemberProps;
}

export default function FormFamilyMemberDialog({
  open,
  onOpenChange,
  setFamilyMembers,
  isEditMode,
  setIsEditMode,
  data,
}: FormFamilyMemberDialogProps) {
  const { userContext } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "0",
      relationship: "",
      occupation: "",
      note: "",
      living_status: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: isEditMode && data ? data.name : "",
        age: isEditMode && data ? String(data.age) : "0",
        relationship: isEditMode && data ? data.relationship : "",
        occupation: isEditMode && data ? data.occupation : "",
        living_status: isEditMode && data ? String(data.living_status) : "0",
        note: isEditMode && data ? data.note : "",
      });
    }
  }, [data, form, isEditMode]);

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    if (isEditMode && data?.id) {
      setFamilyMembers((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                ...formData,
                id: data.id,
                created_by: item.created_by ?? userContext?.id ?? null,
              }
            : item
        )
      );
      setIsEditMode(false);
    } else {
      const newMember = {
        ...formData,
        id: Date.now() + Math.floor(Math.random() * 1000),
        age: formData.age ?? 0,
        living_status: formData.living_status ?? 0,
        created_by: userContext?.id ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setFamilyMembers((prev) => [...prev, newMember]);
    }
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm">家族構成メンバー追加</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    氏名
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    年齢
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <UIPosNumberInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    続柄
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    職業
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="living_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    同居区分
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value) || undefined}
                      className="flex flex-col"
                    >
                      {livingStatusOptions.map((status, index) => {
                        return (
                          <FormItem
                            key={index}
                            className="flex items-center gap-3"
                          >
                            <FormControl>
                              <RadioGroupItem value={String(status.value)} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {status.label}
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    特記事項
                    <RequiredCharacter />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  setIsEditMode(false);
                }}
                className="bg-gray-400 hover:bg-gray-500 rounded-[4px] cursor-pointer"
              >
                キャンセル
              </Button>
              <UISubmitButton>追加</UISubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
