interface AuthDividerProps {
  text?: string;
}

export const AuthDivider = ({ text = 'Or' }: AuthDividerProps) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-white" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="rounded-full bg-white px-2 text-black">{text}</span>
    </div>
  </div>
);
