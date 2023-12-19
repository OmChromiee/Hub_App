import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import MessageCard from "../cards/MessageCard";

interface Props{
    currentUserId: string;
    accountId: string;
    accountType: string;
}


const MessagesTab = async ({
    currentUserId, accountId, accountType
}: Props) => {

    let result = await fetchUserPosts(accountId);

    if(!result) redirect('/')

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.messages.map((message: any) => (
                <MessageCard
                key={message._id}
                id={message._id}
                currentUserId={currentUserId}
                parentId={message.parentId}
                content={message.text}
                author={
                    accountType === 'User'
                    ? {name: result.name, image: result.image, id: result.id}
                    : {name: message.author.name, image: message.author.image,
                    id: message.author.id}
                    

            } 
            // todo (update)
                community={message.community} // todo (update)
                createdAt={message.createdAt}
                comments={message.children}
    
                />
            ))}
        </section>
    )
}


export default MessagesTab;