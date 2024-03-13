import { createCommentOnNovel } from "@/lib/actions";
import { Label } from "../shadcn/label";
import { Textarea } from "../shadcn/textarea";
import { DialogClose } from "../shadcn/dialog";
import { Button } from "../shadcn/button";

type AddCommentFormProps = {
    novelId: string;
};

export default function AddCommentForm(props: AddCommentFormProps) {
    const handleAddCommentWithId = createCommentOnNovel.bind(
        null,
        props.novelId
    );

    return (
        <form action={handleAddCommentWithId}>
            <h2 className="text-2xl font-semibold">Add Comment</h2>
            <div className="w-96 py-2 -px-4">
                <Textarea
                    name="content"
                    className="resize-none w-full"
                />
            </div>
            <DialogClose asChild>
                <Button
                    type="submit"
                    className="w-full"
                >
                    Add
                </Button>
            </DialogClose>
        </form>
    );
}
