import { ASSETS_URL } from "@/config/env";
import type { CommentType } from "@/types/global";

const Comment = ({ comments }: { comments: CommentType[] }) => {
  return (
    <section>
      <h2 className="text-base font-medium mb-4">
        Izohlar
        <span className="ml-2 text-sm text-muted-foreground font-normal">
          ({comments.length})
        </span>
      </h2>
      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c._id}
            className="flex gap-3 p-4 rounded-xl bg-muted/40 border border-border/50"
          >
            <img
              src={ASSETS_URL + c.user.photo}
              alt={c.user.name}
              className="size-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium">{c.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("uz-UZ")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{c.message}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>👍 {c.likesCount?.countLike ?? 0}</span>
                <span>👎 {c.likesCount?.countDislike ?? 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Comment;
