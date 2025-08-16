import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import http from "@/services/http";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { RequiredCharacter } from "@/components/customs/required-character";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { UIFileUpload } from "@/components/customs/ui-file-upload";
import { Checkbox } from "@/components/ui/checkbox";
// import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  edit: React.Dispatch<React.SetStateAction<boolean>>;
  contract?: DocumentProps;
  onfresh: () => void;
};

const formSchema = z.object({
  document_type: z.string().min(1, "書類の種類は必須項目です"),
  status: z.string().min(1, "ステータスは必須項目です"),
  start_date: z.date({
    required_error: "開始日は必須項目です",
  }),
  end_date: z.date({
    required_error: "終了日は必須項目です",
  }),
  permanent_contract: z.boolean().nullable().optional(),
  file: z.number().nullable().optional(),

})
  .refine((data) => data.end_date > data.start_date, {
    message: "終了日は開始日より後の日付を選択してください",
    path: ["end_date"],
  });

const FormContract = ({ contract, edit, onfresh }: Props) => {
  const params = useParams();
  const staffId = params?.id;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: contract
      ? {
        document_type: contract.document_type?.toString() || "",
        status: contract.status?.toString() || "",
        start_date: contract?.start_date ? new Date(contract.start_date) : undefined,
        end_date: contract?.end_date ? new Date(contract.end_date) : undefined,
        file: contract?.file || undefined,
        permanent_contract: Boolean(contract?.permanent_contract),
      }
      : {
        document_type: "",
        status: "",
        start_date: undefined,
        end_date: undefined,
        file: undefined,
        permanent_contract: false,
      },
  });
  const permanentContractValue = form.watch("permanent_contract");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      document_type: values.document_type,
      status: values.status,
      permanent_contract: values.permanent_contract ? 1 : 0,
      start_date: values.start_date.toISOString().split('T')[0],
      end_date: values.end_date.toISOString().split('T')[0],
    };
    if (contract && contract.id) {
      http
        .put(`/document/${contract.id}`, payload)
        .then((res) => {
          console.log("Cập nhật profile thành công:", res.data);
          toast.success('更新に成功しました')
        })
        .catch((err) => {
          console.error("Lỗi khi cập nhật profile:", err);
        })
        .finally(() => {
          edit(false);
          onfresh()
        });
    } else {
      http
        .post(`/document/${staffId}`, payload)
        .then((res) => {
          console.log("Cập nhật profile thành công:", res.data);
          toast.success('新規追加に成功しました')
        })
        .catch((err) => {
          console.error("Lỗi khi cập nhật profile:", err);
        })
        .finally(() => {
          edit(false);
          onfresh()
        });
    }
  };
  return (
    <div className="px-6 pb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-end gap-2">
            <Button variant="cancel" onClick={() => edit(false)}>
              キャンセル
            </Button>
            <Button variant="formSubmit">登録する</Button>
          </div>
          <div className="grid grid-cols-2 gap-3 gap-y-7">
            <FormField
              control={form.control}
              name="document_type"
              render={({ field }) => (
                <FormItem className="max-h-[60px]">
                  <FormLabel>
                    契約タイプ
                    <RequiredCharacter />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">労働契約</SelectItem>
                      <SelectItem value="1">情報保護契約</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="max-h-[60px]">
                  <FormLabel>
                    ステータス
                    <RequiredCharacter />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="有効・満了・更新予定" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">利用中</SelectItem>
                      <SelectItem value="1">利用終了</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="max-h-[60px]">
                  <FormLabel>
                    契約開始日
                    <RequiredCharacter />
                  </FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="max-h-[60px]">
                  <FormLabel>
                    契約満了日
                    <RequiredCharacter />
                  </FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!!permanentContractValue}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="permanent_contract"
            render={({ field }) => (
              <FormItem className="max-h-[60px] flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true ? true : false)
                    }}
                  />
                </FormControl>
                <FormLabel>無期契約</FormLabel>
              </FormItem>
            )}
          />
          <div className="text-center w-1/2">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロファイル写真</FormLabel>
                  <FormControl>
                    <UIFileUpload
                      onFileUpload={(mediaId) => {
                        field.onChange(mediaId)
                      }}
                      onError={(error) => {
                        toast.error(error)
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
  );
};

export default FormContract;
