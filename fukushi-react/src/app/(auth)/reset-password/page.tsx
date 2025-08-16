'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, Suspense } from "react"
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import http from '@/services/http';
import Link from 'next/link';
import {AxiosError} from "axios";

const formSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(1, '新しいパスワードを入力してください。')
      .min(8, 'パスワードの強度が不十分です。半角英数記号を含む、8~15桁でなければなりません。')
      .max(15, 'パスワードの強度が不十分です。半角英数記号を含む、8~15桁でなければなりません。')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_+=<>?{}[\]\\|:;"',./]+$/,
        'パスワードの強度が不十分です。半角英数記号を含む、8~15桁でなければなりません。',
      ),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'パスワードが間違っています。',
    path: ['password_confirmation'],
  });

type FormData = z.infer<typeof formSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [errorMessage, setErrorMessage] = useState<string>('')

  function isTokenExpired(token: string | null): boolean {
    if (token === null) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return now >= exp;
    } catch {
      return true;
    }
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: token!,
      password: '',
      password_confirmation: '',
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const {
    formState: { errors },
  } = form;

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      setLoading(true);

      await http.post('/auth/reset-password', data);
      setLoading(false);
      setResetPassword(true);
      setErrorMessage('');
    } catch (error: unknown) {
      setLoading(false);
      const axiosError = error as AxiosError<{ message?: string }>;
      setErrorMessage(axiosError.response?.data?.message || '無効なトークン.');
    }
  };

  const resendMail = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = {
        email: email,
      };
      await http.post('/auth/forgot-password', data);
      setLoading(false);
      setResent(true);
      setErrorMessage('');
    } catch {
      setLoading(false);
    }
  };

  const [resent, setResent] = useState<boolean>(false);

  return token && isTokenExpired(token) ? (
    <div className="store bg-gray-100 min-h-screen">
      <div className="store-wrap mx-auto px-4">
        <div className="auto-wrap flex items-center justify-center min-h-screen flex-col py-6">
          <h1 className="text-center text-slate-700 font-semibold text-[28px] mb-7">
            パスワード再設定メールを
            <br />
            お送りしました
          </h1>
          <div className="w-full max-w-[530px] mx-auto bg-white md:px-10 px-4 md:py-12 py-6 border border-[#ccc] rounded-[6px]">
            {!resent && (
              <div className="form-error text-md font-semibold mb-8 text-center text-[#FF1717]">
                パスワード再設定リンクの
                <br />
                有効期限が切れています。
              </div>
            )}

            {resent && (
              <div className="form-error font-light mb-8 text-center">
                再度認証メールを送信し、
                <br /> 30分以内にメールに記載されたURLを
                <br />
                クリックして会員登録を完了させてください。
              </div>
            )}

            {!resent && (
              <div className="text-center mt-4 mb-10">
                <div
                  onClick={resendMail}
                  className="flex items-center justify-center rounded-3xl bg-primary text-white p-3 w-full cursor-pointer text-[15px] font-semibold text-center"
                >
                  {!loading ? '認証メールを送信' : <Loader2 className="animate-spin size-6" />}
                </div>
              </div>
            )}
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
      </div>
    </div>
  ) : resetPassword ? (
    <div className="store bg-gray-100 min-h-screen">
      <div className="store-wrap mx-auto px-4">
        <div className="auto-wrap flex items-center justify-center min-h-screen flex-col py-6">
          <h1 className="text-center text-slate-700 font-semibold text-[28px] mb-7">
            パスワード再設定が完了しました
          </h1>
          <div className="w-full max-w-[530px] mx-auto bg-white md:px-10 px-4 md:py-12 py-6 border border-[#ccc] rounded-[6px]">
            <div className="form-error text-slate-700 mb-8 text-center">
              新しいパスワードを設定しました。
              <br />
              下のボタンよりログイン画面へ戻り、
              <br />
              新しいパスワードでログインしてください。
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="block rounded-3xl bg-sky-500 hover:bg-sky-600 text-white p-3 w-full cursor-pointer text-[15px] font-semibold"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="store bg-gray-100 min-h-screen">
      <div className="store-wrap mx-auto px-4">
        <div className="auto-wrap flex items-center justify-center min-h-screen flex-col py-6">
          <h1 className="text-center text-slate-700 font-semibold text-[28px] mb-7">
            パスワード再設定
          </h1>

          <div className="w-full max-w-[530px] mx-auto bg-white md:px-10 px-4 md:py-12 py-6 border border-[#ccc] rounded-[6px]">
            {errorMessage && (
              <div className="form-error text-md font-semibold mb-8 text-center text-[#FF1717]">
                {errorMessage}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-[30px] gap-0">
                      <FormLabel className="mb-1 block text-md text-slate-700 data-[error=true]:text-slate-700">
                        新しいパスワード*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.trim())}
                          type="password"
                          className={`h-14 text-sm p-[14px] rounded-[10px] border focus-visible:ring-0 border-[${errors.password ? '#FF1717' : '#ccc'}]`}
                          placeholder="半角英数記号8~15桁"
                          autoComplete="off"
                        />
                      </FormControl>
                      {errors.password ? (
                        <div className="mt-[3px] text-[14px] leading-6 text-[#FF1717]">
                          パスワードの強度が不十分です。
                          <br />
                          半角英数記号を含む、8~15桁でなければなりません
                        </div>
                      ) : (
                        <div className="mt-[2px] text-[14px] leading-6 text-gray-500">
                          パスワードは、半角英数字を組み合わせ
                          <br />
                          た8文字以上で入力してください。
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem className="mb-[30px] gap-0">
                      <FormLabel className="mb-1 block text-md text-slate-700 data-[error=true]:text-slate-700">
                        新しいパスワード（確認用）*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className={`h-14 text-sm p-[14px] rounded-[10px] border focus-visible:ring-0 border-[${errors.password_confirmation ? '#FF1717' : '#ccc'}]`}
                          placeholder="確認のためもう一度入力してください"
                          autoComplete="off"
                        />
                      </FormControl>
                      {errors.password_confirmation && (
                        <div className="mt-[3px] text-[14px] leading-6 text-[#FF1717]">
                          {String(errors.password_confirmation.message)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <div className="text-center">
                  <Button
                    className="rounded-3xl hover:bg-sky-600 bg-sky-500 text-white p-3 w-full cursor-pointer font-semibold h-13"
                    type="submit"
                  >
                    {!loading ? '完了' : <Loader2 className="animate-spin size-6" />}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoreResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
