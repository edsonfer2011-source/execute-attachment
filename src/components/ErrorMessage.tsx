interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="mt-4 px-4 py-3 bg-[#C45A5A]/10 border border-[#C45A5A]/30 rounded-lg text-sm text-[#C45A5A]">
      {message}
    </div>
  );
}
