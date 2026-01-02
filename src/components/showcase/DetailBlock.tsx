import { DetailBlock as DetailBlockType } from "@/types/showcase";

interface DetailBlockProps {
  block: DetailBlockType;
}

const DetailBlock = ({ block }: DetailBlockProps) => {
  return (
    <div className="bg-secondary/30 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">{block.title}</h4>
      <dl className="space-y-2">
        {block.items.map((item, index) => (
          <div key={index} className="flex justify-between items-baseline gap-4">
            <dt className="text-xs text-muted-foreground shrink-0">{item.label}</dt>
            <dd className="text-sm text-foreground text-right">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default DetailBlock;
