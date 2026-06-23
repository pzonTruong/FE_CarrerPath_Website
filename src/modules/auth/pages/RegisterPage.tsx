import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { OtpInput } from '@/shared/components/ui/otp-input';

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onRegisterSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      await authApi.register({ email: values.email, password: values.password });
      setEmail(values.email);
      setStep('verify');
      toast.success('OTP sent to your email.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  });

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await authApi.verifyRegisterOtp(email, otp);
      toast.success('Account verified! You can login now.');
      navigate('/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Invalid OTP');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleThirdPartySignUp = (provider: string) => {
    toast.info(`Sign up with ${provider} is placeholder. Ready for backend integration.`);
  };

  if (step === 'verify') {
    return (
      <div className="py-10 max-w-md mx-auto">
        <div className="border-2 border-foreground bg-card text-card-foreground p-8 rounded-[4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,0.15)] space-y-6">
          <div className="space-y-2 border-b-2 border-foreground pb-4 text-center">
            <h1 className="text-2xl font-black uppercase font-mono tracking-tight">Confirm OTP</h1>
            <p className="text-xs text-muted-foreground font-sans">
              Enter the 6-digit code sent to <span className="font-semibold text-foreground font-mono">{email}</span>
            </p>
          </div>
          <form className="space-y-5" onSubmit={onVerifySubmit}>
            <div className="flex justify-center py-2">
              <OtpInput value={otp} onChange={setOtp} />
            </div>
            <button
              type="submit"
              disabled={otp.length !== 6 || loading}
              className="w-full py-3 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:opacity-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(250,250,250,1)] rounded-[2px] cursor-pointer disabled:opacity-50"
            >
              {loading ? 'CONFIRMING...' : 'VERIFY OTP'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('register'); setOtp(''); }}
              className="block w-full text-center text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:underline uppercase transition-colors"
            >
              Back to register
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="border-2 border-foreground bg-card text-card-foreground p-8 rounded-[4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,0.15)] space-y-6">
        {/* Title */}
        <div className="space-y-2 border-b-2 border-foreground pb-4 text-center">
          <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary border border-foreground px-2 py-0.5 rounded-[2px] uppercase tracking-widest">
            Registration
          </span>
          <h1 className="text-2xl font-black uppercase font-mono tracking-tight mt-2">
            Create Account
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Sign up to track and save your developer roadmaps.
          </p>
        </div>

        {/* Credentials Form */}
        <form className="space-y-4" onSubmit={onRegisterSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-mono font-bold uppercase tracking-wider block">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="NAME@EXAMPLE.COM"
              {...register('email')}
              className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase"
            />
            {errors.email && <p className="text-xs font-mono text-destructive uppercase">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-mono font-bold uppercase tracking-wider block">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="CREATE AT LEAST 6 CHARS"
              {...register('password')}
              className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50"
            />
            {errors.password && <p className="text-xs font-mono text-destructive uppercase">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:opacity-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(250,250,250,1)] rounded-[2px] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'REGISTERING...' : 'REGISTER & SEND OTP'}
          </button>
        </form>

        {/* Third Party Signup Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-foreground"></div>
          <span className="flex-shrink mx-3 text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground">OR CONNECT WITH</span>
          <div className="flex-grow border-t border-foreground"></div>
        </div>

        {/* Third Party Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleThirdPartySignUp('GitHub')}
            className="py-2 border-2 border-foreground bg-background hover:bg-muted font-mono font-bold text-xs uppercase tracking-wider transition-all rounded-[2px] cursor-pointer"
          >
            GitHub
          </button>
          <button
            type="button"
            onClick={() => handleThirdPartySignUp('Google')}
            className="py-2 border-2 border-foreground bg-background hover:bg-muted font-mono font-bold text-xs uppercase tracking-wider transition-all rounded-[2px] cursor-pointer"
          >
            Google
          </button>
        </div>

        {/* Redirect */}
        <p className="text-center text-xs font-mono text-muted-foreground mt-4 uppercase">
          Already registered?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In Instead
          </Link>
        </p>
      </div>
    </div>
  );
};
