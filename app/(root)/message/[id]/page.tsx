import MessageCard from "@/components/cards/MessageCard";
import Comment from "@/components/forms/Comment";
import { fetchMessageById } from "@/lib/actions/message.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { userInfo } from "os";
const Page = async ({params}: {params: {id: string}}) => {

    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding')

    const message = await fetchMessageById(params.id);

    return(
  <section className="relative">

    <div>

    <MessageCard
            key={message._id}
            id={message._id}
            currentUserId={user?.id || ""}
            parentId={message.parentId}
            content={message.text}
            author={message.author}
            community={message.community}
            createdAt={message.createdAt}
            comments={message.children}

            />

            <div className="mt-7">
                <Comment 
                messageId = {message.id}
                currentUserImg = {userInfo.image}
                currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

    </div>
    <div className="mt-10">
     {message.children.map((childItem: any) => (
      <MessageCard
      key={childItem._id}
      id={childItem._id}
      currentUserId={user?.id || ""}
      parentId={childItem.parentId}
      content={childItem.text}
      author={childItem.author}
      community={childItem.community}
      createdAt={childItem.createdAt}
      comments={childItem.children}
      isComment

      />
     ))} 
    </div>

  </section>
    )
}

export default Page;