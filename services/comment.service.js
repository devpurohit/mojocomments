import { commentsRef } from '../utilities/firebaseUtil.js'
import asyncForEach from '../utilities/asyncForEach.js';

/*
    Function to call Firestore DB for commentx collection
*/
class CommentService {

         async getComments() {
            const snapshot = await commentsRef
                .where("lvl", "==", 0)
                .get();
            const rootComments =  snapshot.docs.map(doc => new Object({id: doc.id, ...doc.data()}));
            //rootComments.map(async comment=> await this.getReplies(comment.replies));
            return rootComments;
        }

        async getComment(id) {
            const snapshot = await commentsRef
                .doc(id)
                .get();
            const rootComment = snapshot.data();
            return rootComment;
        }

        async getReplies(replies) {
            if(!replies) return;
            await asyncForEach(replies, async (comment, index) => {
                console.log(comment)
                
                    let commentRef = await comment.get();
                    comment = { id: commentRef.id, ...commentRef.data()} 
                    replies[index] = comment;
                    await this.getReplies(comment.replies);
                });            
            }

        async addComment(comment) {
           const commentRef = await commentsRef
                    .add({
                        author: comment.author,
                        content: comment.content,
                        createdAt: comment.createdAt,
                        replies: comment.replies,
                        lvl: comment.lvl
                    });
            return commentRef;
        }

        deleteComment(commentId) {
          return commentsRef
                    .doc(`${commentId}`)
                    .delete();
                  
        }

        updateCommentContent(commentId, content) {
            return commentsRef
                    .doc(`${commentId}`)
                    .update({
                        content
                    });
        }

        updateCommentReplies(commentId, replies) {
            return commentsRef
                    .doc(`${commentId}`)
                    .update({
                        replies
                    });
        }

        
}

export const commentService = new CommentService;

