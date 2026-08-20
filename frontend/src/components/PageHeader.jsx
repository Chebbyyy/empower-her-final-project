function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="border-b border-line pb-10 mb-8 md:pb-14 md:mb-12">
      {eyebrow && (
        <p className="text-brass mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="text-forest">{title}</h1>
      {description && (
        <p className="mt-5 max-w-xl text-ink-muted">{description}</p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </header>
  );
}

export default PageHeader;
