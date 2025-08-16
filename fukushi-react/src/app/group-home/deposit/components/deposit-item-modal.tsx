"use client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { UISubmitButton, UICancelButton } from "@/components/customs/ui-button";
import { useForm } from "react-hook-form";
import { TextArea } from "@/components/ui/text-area";
import http from "@/services/http";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

type DepositItemModalProps = {
  selectId?: string
  onRefresh: () => void;
  open: boolean
  setOpen: (open: boolean) => void
  edit?: boolean
  detailData?: DepositItemProps;
  loadingDetail: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "記録種別を選択してください。",
  }),
  amount: z.string(),
  deposit_date: z
    .string()
    .min(1, {
      message: "開催日を入力してください。",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "有効な日付を入力してください。",
    }),
  return_address: z.string().min(1, {
    message: "記録種別を選択してください。",
  }),
  note: z.string()
});


const DepositItemModal = ({ selectId, onRefresh, open, setOpen, edit = false, detailData, loadingDetail }: DepositItemModalProps) => {
  const params = useParams();
  const formId = params?.id as string;

  console.log(selectId)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
    {
      name: "",
      amount: "",
      deposit_date: "",
      return_address: "",
      note: ""
    },
  });

  useEffect(() => {
    if (edit && detailData) {
      form.reset({
        name: detailData.name || "",
        amount: String(detailData.amount) || "",
        deposit_date: detailData.deposit_date || "",
        return_address: detailData.return_address || "",
        note: detailData.note || ""
      });
    } else if (!edit) {
      form.reset({
        name: "",
        amount: "",
        deposit_date: "",
        return_address: "",
        note: ""
      });
    }
  }, [edit, detailData, form, open]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (edit && selectId) {
      http.put(`/deposit/deposit-items/${selectId}`, values)
        .then((res) => {
          console.log("Cập nhật thành công:", res.data);
          onRefresh();
          setOpen(false);
        })
    } else {
      http.post(`/deposit/create/${formId}`, values)
        .then((res) => {
          console.log("Tạo mới thành công:", res.data);
          onRefresh();
          setOpen(false);
        })
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {edit ? "収支の編集" : "収支の新規追加"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>預かり品名 *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>数量 *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deposit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>預かり日 *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="return_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>返却先 *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <TextArea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">キャンセル</Button>
              </DialogClose>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <Loader2 className="animate-spin w-12 h-12 text-sky-500" />
        </div>
      )}
    </Dialog>

  )
}

export default DepositItemModal