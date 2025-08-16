"use client";

import { HeadingPage } from "@/components/ui/heading-page";
import RichTextEditor from "@/components/rich-text-editor";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequiredCharacter } from "@/components/customs/required-character";
import {
  UISubmitButton,
  UIReturnButton,
  UIEditButton,
} from "@/components/customs/ui-button";
import { useEffect, useState } from "react";
import http from "@/services/http";
import { createSuccessToast, updateSuccessToast } from "@/lib/message";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Permission } from "@/components/auth/Permission";

const formSchema = z.object({
  content: z.string().nonempty("このフィールドは必須です。"),
});

const DocumentFinancialPolicy = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [data, setData] = useState<DocumentFinancialPolicyProps>();

  const fetchData = async () => {
    try {
      const response = await http.get(`/document-financial-policy`);
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch document financial policy", error);
    }
  };

  const handleEdit = () => {
    if (data) {
      form.reset({ content: data.content });
    }
    setIsEditMode(true);
  };

  const handleTurnBack = () => {
    form.reset();
    setIsEditMode(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const payload = {
      ...submitData,
    };
    const message = data ? updateSuccessToast : createSuccessToast;
    const method = data ? http.put : http.post;
    const url = data
      ? `document-financial-policy/${data.document_id}`
      : "document-financial-policy";
    await method(url, payload);
    fetchData();
    handleTurnBack();
    toast.success(message);
  }

  return (
    <>
      <HeadingPage title="金銭管理規程" />

      <div className="mt-6">
        <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white min-h-[420px]">
          <Permission role={["staff"]} strict>
            {data?.content ? (
              <div className="px-6 pb-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              </div>
            ) : (
              <div className="px-6 pb-6 flex items-center justify-center min-h-[420px]">
                <div className="">(空白)</div>
              </div>
            )}
          </Permission>
          <Permission role={["admin", "manager"]}>
            <div className="px-6 pb-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex justify-end gap-2">
                    {isEditMode ? (
                      <>
                        <UIReturnButton
                          className="min-w-[110px]"
                          onClick={handleTurnBack}
                        >
                          キャンセル
                        </UIReturnButton>
                        <UISubmitButton className="min-w-[110px]">
                          保存
                        </UISubmitButton>
                      </>
                    ) : (
                      <UIEditButton
                        className="min-w-[110px]"
                        onClick={handleEdit}
                      >
                        {data ? "更新" : "新規追加"}
                      </UIEditButton>
                    )}
                  </div>
                  <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            内容
                            <RequiredCharacter />
                          </FormLabel>
                          {isEditMode ? (
                            <>
                              <FormControl>
                                <RichTextEditor
                                  content={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </>
                          ) : data?.content ? (
                            <div
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: data.content,
                              }}
                            />
                          ) : (
                            <Textarea
                              placeholder=""
                              className="h-[246px]"
                              disabled
                            />
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          </Permission>
        </div>
      </div>
    </>
  );
};

export default DocumentFinancialPolicy;
