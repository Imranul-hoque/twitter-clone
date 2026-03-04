type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {children}
    </div>
  );
};

export default AuthLayout;
