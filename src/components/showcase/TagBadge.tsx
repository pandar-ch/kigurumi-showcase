interface TagBadgeProps {
  tag: string;
}

const TagBadge = ({ tag }: TagBadgeProps) => {
  return (
    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full">
      {tag}
    </span>
  );
};

export default TagBadge;
