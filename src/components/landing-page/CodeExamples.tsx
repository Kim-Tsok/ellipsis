'use client';

import { motion } from 'framer-motion';

const codeExamples = [
  {
    title: 'User Profile Display',
    description:
      'Avatar component that displays user session data with fallback handling',
    code: `<DropdownMenuLabel>
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage src={session?.user?.image} />
      <AvatarFallback>
        {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <p className="text-sm font-medium">
        {session?.user?.name || 'User'}
      </p>
      <p className="text-xs text-muted-foreground">
        {session?.user?.email}
      </p>
    </div>
  </div>
</DropdownMenuLabel>`,
    size: 'normal',
  },
  {
    title: 'Reusable Button Component',
    description:
      'Styled button with variant and size props using Radix UI Slot pattern',
    code: `const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border bg-background",
        secondary: "bg-secondary",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
      },
    },
  }
);

function Button({ variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size }))} {...props} />
  );
}`,
    size: 'normal',
  },
  {
    title: 'OAuth Authentication Hooks',
    description:
      'Custom hooks for Google and GitHub sign-in with error handling and callbacks',
    code: `export const useGoogleAuth = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
        redirect: false,
      });

      if (result?.error) {
        onError?.(new Error(result.error));
      } else if (result?.ok) {
        onSuccess?.();
      }
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleGoogleSignIn };
};`,
    size: 'normal',
  },
  {
    title: 'Server-Side Protection',
    description:
      'Middleware route protection with Better Auth session validation and automatic redirects',
    code: `export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const sessionToken = request.cookies.get('better-auth.session_token');
  const isAuthenticated = !!sessionToken;

  const isProtectedRoute = 
    nextUrl.pathname.startsWith('/dashboard') || 
    nextUrl.pathname.startsWith('/settings');

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && (
    nextUrl.pathname === '/auth/login' || 
    nextUrl.pathname === '/auth/register'
  )) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
}`,
    size: 'wide',
  },
  {
    title: 'Email Verification API',
    description:
      'Resend verification email endpoint with token generation and Brevo integration',
    code: `export async function POST(req: Request) {
  const body = await req.json();
  const { email } = RequestBodySchema.parse(body);

  const user = await db.user.findUnique({ where: { email } });

  if (!user || user.emailVerified) {
    return NextResponse.json({ message: "..." }, { status: 400 });
  }

  const { token, hash } = await generateVerificationTokenAndHash();
  const expires = new Date(Date.now() + TOKEN_EXPIRATION_DURATION);

  await db.emailVerificationToken.create({
    data: { userId: user.id, token: hash, expires },
  });

  await sendVerificationEmail(email, token);

  return NextResponse.json({ message: "Verification email sent." });
}`,
    size: 'normal',
  },
];

export function CodeExamples() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="px-4 py-20 md:py-32">
      <motion.div
        className="container mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants} className="mb-20 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-bold text-balance md:text-5xl">
            Production-Ready Code
          </h2>
          <p className="text-foreground/60 mx-auto max-w-2xl text-lg">
            Clean, documented code. Copy, paste, ship. Everything you need to
            get started.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6"
          variants={containerVariants}
        >
          {codeExamples.slice(0, 3).map((example, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex min-w-0 flex-col"
            >
              {/* Code Card */}
              <div className="group relative flex h-96 flex-shrink-0 flex-col overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] md:h-[500px]">
                <div className="bg-card/80 border-border/50 shadow-card/20 flex h-full flex-col rounded-2xl border p-1 shadow-2xl backdrop-blur-xl">
                  <div className="bg-background/40 no-scrollbar flex h-full flex-col overflow-y-auto rounded-xl p-6 font-mono text-sm">
                    {/* Code Content */}
                    <pre className="text-foreground/90 h-full text-xs leading-relaxed md:text-sm">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>

                {/* Overlayed Text */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col p-2 md:p-4">
                  <div className="bg-secondary/60 border-border/50 rounded-lg border p-4 backdrop-blur-sm md:p-6">
                    <h3 className="text-foreground mb-2 text-xl font-semibold md:text-2xl">
                      {example.title}
                    </h3>
                    <p className="text-foreground/90 text-sm leading-relaxed md:text-base">
                      {example.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {codeExamples.slice(3).map((example, index) => {
            const isWide = example.size === 'wide';
            const colSpan = isWide ? 'md:col-span-2' : 'md:col-span-1';
            const heightClass = 'h-96 md:h-[500px]';

            return (
              <motion.div
                key={index + 3}
                variants={itemVariants}
                className={`${colSpan} flex min-w-0 flex-col`}
              >
                {/* Code Card */}
                <div
                  className={`group relative flex ${heightClass} flex-shrink-0 flex-col overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="bg-card/80 border-border/50 shadow-card/20 flex h-full flex-col rounded-2xl border p-1 shadow-2xl backdrop-blur-xl">
                    <div className="bg-background/40 no-scrollbar flex h-full flex-col overflow-y-auto rounded-xl p-6 font-mono text-sm">
                      {/* Code Content */}
                      <pre className="text-foreground/90 h-full text-xs leading-relaxed md:text-sm">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Overlayed Text */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col p-2 md:p-4">
                    <div className="bg-secondary/60 border-border/50 rounded-lg border p-4 backdrop-blur-sm md:p-6">
                      <h3 className="text-foreground mb-2 text-xl font-semibold md:text-2xl">
                        {example.title}
                      </h3>
                      <p className="text-foreground/90 text-sm leading-relaxed md:text-base">
                        {example.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
