function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="border-b border-line pb-8 mb-12">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-3">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl text-forest tracking-tight md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-xl text-ink-muted leading-relaxed">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
}

export default PageHeader;
