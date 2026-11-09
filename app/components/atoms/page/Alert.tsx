export interface AlertProps {
  message: string;
  type: "success" | "error" | "muted";
}

export function Alert({ message, type }: AlertProps) {
  const styles = {
    success: "border-green-500 bg-emerald-50 text-green-500",
    error: "border-red-500 bg-red-50 text-red-500",
    muted: "border-stone-500 bg-stone-50 text-stone-500"
  };

  return (
    <p className={`min-w-0 w-full p-4 border rounded-xl text-xl font-bold ${styles[type]}`}>
      {message}
    </p>
  );
}
