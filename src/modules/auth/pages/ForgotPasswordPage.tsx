import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';

const requestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

const resetSchema = z.object({
  email: z.string().optional(),
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type RequestValues = z.infer<typeof requestSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
  });
  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
  });

  const onRequestToken = requestForm.handleSubmit(async (values) => {
    try {
      await authApi.forgotPassword(values.email);
      setEmail(values.email);
      setStep('reset');
      toast.success('Reset token sent to your email.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Something went wrong');
    }
  });

  const onResetPassword = resetForm.handleSubmit(async (values) => {
    try {
      await authApi.resetPassword(email || values.email || '', values.token, values.newPassword);
      toast.success('Password reset successful. You can login now.');
      setStep('request');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Something went wrong');
    }
  });

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="border-2 border-foreground bg-card text-card-foreground p-8 rounded-[4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,0.15)] space-y-6">
        {/* Title */}
        <div className="space-y-2 border-b-2 border-foreground pb-4 text-center">
          <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary border border-foreground px-2 py-0.5 rounded-[2px] uppercase tracking-widest">
            Recovery
          </span>
          <h1 className="text-2xl font-black uppercase font-mono tracking-tight mt-2">
            {step === 'request' ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            {step === 'request'
              ? 'Enter your email to receive a recovery token.'
              : `Enter the token sent to ${email} and set your new password.`}
          </p>
        </div>

        {step === 'request' ? (
          <form className="space-y-4" onSubmit={onRequestToken}>
            <div className="space-y-1.5">
              <label htmlFor="request-email" className="text-xs font-mono font-bold uppercase tracking-wider block">
                Email Address
              </label>
              <input
                id="request-email"
                type="email"
                placeholder="NAME@EXAMPLE.COM"
                {...requestForm.register('email')}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase"
              />
              {requestForm.formState.errors.email && (
                <p className="text-xs font-mono text-destructive uppercase">{requestForm.formState.errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:opacity-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(250,250,250,1)] rounded-[2px] cursor-pointer"
            >
              SEND RESET TOKEN
            </button>
            <p className="text-center text-xs font-mono text-muted-foreground mt-4 uppercase">
              Remembered your credentials?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onResetPassword}>
            <div className="space-y-1.5">
              <label htmlFor="token" className="text-xs font-mono font-bold uppercase tracking-wider block">
                Reset Token
              </label>
              <input
                id="token"
                type="text"
                placeholder="PASTE TOKEN FROM EMAIL"
                {...resetForm.register('token')}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase"
              />
              {resetForm.formState.errors.token && (
                <p className="text-xs font-mono text-destructive uppercase">{resetForm.formState.errors.token.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="text-xs font-mono font-bold uppercase tracking-wider block">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="AT LEAST 6 CHARACTERS"
                {...resetForm.register('newPassword')}
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
              {resetForm.formState.errors.newPassword && (
                <p className="text-xs font-mono text-destructive uppercase">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:opacity-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(250,250,250,1)] rounded-[2px] cursor-pointer"
            >
              RESET PASSWORD
            </button>
            <button
              type="button"
              onClick={() => setStep('request')}
              className="block w-full text-center text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:underline uppercase transition-colors"
            >
              Back to request token
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
