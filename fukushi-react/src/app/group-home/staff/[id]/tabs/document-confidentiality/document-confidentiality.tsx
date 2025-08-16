import * as React from "react";
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
import {
  UISubmitButton,
  UIEditButton,
  UIUnSubmitButton,
} from "@/components/customs/ui-button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RequiredCharacter } from "@/components/customs/required-character";
import http from "@/services/http";
import { useState, useEffect } from "react";
import { formatJapaneseDate } from "@/lib/format";
import { UIFileUpload } from "@/components/customs/ui-file-upload";
import { updateSuccessToast, createSuccessToast } from "@/lib/message";

type DocumentConfidentialityTabProps = {
  data: StaffProps | undefined;
  documentConfidentiality: DocumentConfidentialityProps | undefined;
  onChangeDocumentConfidentiality: (
    value: DocumentConfidentialityProps
  ) => void;
};

const formSchema = z.object({
  document_date: z.date({
    required_error: "契約締結日を選択してください",
    invalid_type_error: "この項目は無効です",
  }),
  file: z.number().nullable().optional(),
});

const DocumentConfidentialityTab = ({
  data,
  documentConfidentiality,
  onChangeDocumentConfidentiality,
}: DocumentConfidentialityTabProps) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_date: undefined,
      file: null,
    },
  });

  useEffect(() => {
    if (documentConfidentiality) {
      form.reset({
        document_date: new Date(documentConfidentiality.document_date),
        file: documentConfidentiality.file || null,
      });
    }
  }, [isEditMode, documentConfidentiality, form]);

  async function onSubmit(submitData: z.infer<typeof formSchema>) {
    const payloadData: Record<string, unknown> = {
      ...submitData,
      document_date: submitData.document_date
        ? format(submitData.document_date, "yyyy-MM-dd")
        : null,
      file: submitData.file || null,
    };

    if (!isEditMode || !documentConfidentiality) {
      payloadData.staff_id = data ? data.id : null;
    }

    const message = documentConfidentiality
      ? updateSuccessToast
      : createSuccessToast;
    const method = documentConfidentiality ? http.put : http.post;
    const url = documentConfidentiality
      ? `document-confidentiality/${documentConfidentiality?.id}`
      : "document-confidentiality";

    const response = await method(url, payloadData);

    onChangeDocumentConfidentiality(response.data.data);
    setIsEditMode(false);
    toast.success(message);
  }

  return (
    <div className="my-6 p-6 rounded-[10px] border border-gray-200 shadow-sm bg-white">
      <div className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-end gap-2">
              {documentConfidentiality && !isEditMode ? (
                <UIEditButton
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                >
                  更新
                </UIEditButton>
              ) : (
                <>
                  {isEditMode && (
                    <UIUnSubmitButton onClick={() => setIsEditMode(false)}>
                      キャンセル
                    </UIUnSubmitButton>
                  )}
                  <UISubmitButton>保存</UISubmitButton>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="document_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        契約締結日
                        <RequiredCharacter />
                      </FormLabel>

                      {documentConfidentiality && !isEditMode ? (
                        <p className="mt-2 text-sm text-gray-700">
                          {formatJapaneseDate(
                            documentConfidentiality.document_date
                          )}
                        </p>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ja })
                                ) : (
                                  <span>YYYY年MM月DD日</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                              captionLayout="label"
                              locale={ja}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      契約書アップロード
                    </FormLabel>
                    <FormControl>
                      <UIFileUpload
                        onFileUpload={(mediaId) => {
                          field.onChange(mediaId);
                        }}
                        onError={(error) => {
                          toast.error(error);
                        }}
                        mediaId={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DocumentConfidentialityTab;
