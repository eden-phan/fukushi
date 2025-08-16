'use client';

import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { AxiosResponse } from 'axios';
import http from '@/services/http';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください。' })
    .max(100, {
      message: 'メールアドレスは100文字を超えてはいけません。もう一度入力してください。',
    })
    .email('メールアドレスの形式が正しくありません。'),
});

type FormData = z.infer<typeof formSchema>;

export default function StoreLostPassword() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    setError,
    formState: { errors },
  } = form;

  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse = await http.post('/auth/forgot-password', data);

      setLoading(false);
      const { message } = response.data;
      if (message) {
        setEmailVerification(true);
      }
    } catch {
      setLoading(false);
      setError('email', {
        type: 'custom',
        message: 'このメールアドレスは登録されていません。',
      });
    }
  };

  return (
    // wrap
    <div className="store bg-gray-100 min-h-screen">
      <div className="store-wrap mx-auto px-4">
        {emailVerification ? (
          <div className="auto-wrap flex items-center justify-center min-h-screen flex-col py-6">
            <h1 className="text-center text-slate-700 font-semibold text-[28px] mb-7">
              パスワード再設定メールを
              <br />
              お送りしました
            </h1>
            <div className="w-full max-w-[530px] mx-auto bg-white md:px-10 px-4 md:py-12 py-6 border border-[#ccc] rounded-[6px]">
              <div className="form-error mb-10 text-center">
                30分以内にメールに記載されたURLを
                <br />
                クリックし、会員登録を完了させてください。
              </div>

              <div className="bg-[#f4f4f4] p-10">
                <h3 className="text-center mb-7 text-md font-semibold">メールが届かない場合</h3>
                <div>
                  ・@ドメインからのメールアドレスが受信拒否設定に含まれていないか、メールが迷惑フォルダに振り分けされていないかをご確認ください。
                  <br />
                  ・登録するメールアドレスを間違えた場合は、正しいメールアドレスでこちらからもう一度会員登録してください。
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="auto-wrap flex items-center justify-center min-h-screen flex-col py-6">
            <h1 className="text-center font-semibold text-[28px] mb-7 text-slate-700">
              パスワードを再設定
            </h1>
            <div className="w-full max-w-[530px] mx-auto bg-white md:px-10 px-4 md:py-12 py-6 border border-[#ccc] rounded-[6px]">
              <div className="form-error mb-10 text-center text-slate-700">
                ご登録のメールアドレス宛に
                <br />
                パスワード再設定メールをお送りします
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mb-[30px] gap-0">
                        <FormLabel className="mb-1 block text-md text-slate-700 data-[error=true]:text-slate-700">
                          メールアドレス
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.trim();
                              field.onChange(value);
                            }}
                            value={field.value}
                            className={`h-14 text-sm p-[14px] rounded-[10px] border focus-visible:ring-0 border-[${
                              errors.email ? '#FF1717' : '#ccc'
                            }]`}
                            placeholder="abc123@sample.com"
                          />
                        </FormControl>
                        {errors.email && (
                          <div className="mt-[3px] text-[14px] leading-6 text-[#FF1717]">
                            {errors.email.message}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="text-center">
                    <Button
                      className="rounded-3xl bg-sky-500 hover:bg-sky-600 text-white p-3 w-full cursor-pointer font-semibold h-13"
                      type="submit"
                    >
                      {!loading ? '認証メールを送信' : <Loader2 className="animate-spin size-6" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
