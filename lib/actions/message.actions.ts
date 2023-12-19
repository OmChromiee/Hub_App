"use server"

import { revalidatePath } from "next/cache";
import Message from "../models/message.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createMessage({text, author, communityId, path}: Params) {
    try{

        connectToDB();

        const createdMessage = await Message.create({
            text,
            author,
            community: null,
        });
    
        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: {messages: createdMessage._id }
        })
    
        revalidatePath(path);
    } catch(error: any){
        throw new Error(`Error creating message: ${error.message}`)
    }
    
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculate the no of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents (top-level messages...)
    const postsQuery = Message.find({parentId: {$in: [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: User})
    .populate({
        path: 'children',
        populate:{
            path: 'author',
            model: 'User',
            select: "_id name parentId image"
        }

    })

    const totalPostsCount = await Message.countDocuments({parentId: {$in: [null, undefined]}})

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return {posts, isNext}


}

export async function fetchMessageById(id:string) {
    connectToDB();

    try{

        //TODO: Populate Community

        const message = await Message.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: 'children',
                    model: Message,
                    populate:{
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec();

        return message;
    } catch(error:any){
        throw new Error(`Error fetching message: ${error.message}`)
    }
}

export async function addCommentToMessage(
    messageId: string,
    commentText: string,
    userId: string,
    path: string,
    ) {
        connectToDB();

        try{
            const originalMessage = await Message.findById(messageId);

            if(!originalMessage){
                throw new Error("Message not found")
            }

            const commentMessage = new Message({
                text: commentText,
                author: userId,
                parentId: messageId,
            })

            const savedCommentMessage = await commentMessage.save();

            originalMessage.children.push(savedCommentMessage._id);

            await originalMessage.save();
            
            revalidatePath(path);

        }catch(error: any){
            throw new Error(`Error adding comment to message: ${error.message}`)
        }
    }