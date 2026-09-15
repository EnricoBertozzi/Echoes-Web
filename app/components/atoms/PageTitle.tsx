interface PageTitleProps {
  title: string;
  description: string;
}

export function PageTitle({
  title,
  description,
}: PageTitleProps) {
  return (
    <header>
      <h1 className="text-4xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-xl text-slate-500">
        {description}
      </p>
    </header>
  );
}
