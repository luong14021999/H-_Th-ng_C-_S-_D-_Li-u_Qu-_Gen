import { twemojiUrl } from "@/lib/twemoji";

interface Props {
  emoji: string;
  size?: number;
  className?: string;
}

export default function Twemoji({ emoji, size = 18, className = "" }: Props) {
  return (
    <img
      src={twemojiUrl(emoji)}
      alt={emoji}
      width={size}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
