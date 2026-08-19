function FormMessage({ type = 'error', children }) {
  const styles =
    type === 'success'
      ? 'border-forest/30 bg-forest/5 text-forest'
      : 'border-red-200 bg-red-50 text-red-800';

  return (
    <p
      className={`border px-4 py-3 text-sm ${styles}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}

export default FormMessage;
