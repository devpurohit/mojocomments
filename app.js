import { commentUtil } from './utilities/CommentUtil.js';
import { commentService } from './services/comment.service.js';

(async () => {

// Fetch data from DB and add to dom
const comments = await commentService.getComments();
console.log(comments)
commentUtil.paintRoots(comments);

// Add Event Listeners
document.body.addEventListener( 'click', function (event ) {
    if( event.srcElement.id == 'submitroot' ) {
        addRootComment();
      };
    if([...event.srcElement.classList].includes('editbtn') ) {
        commentUtil.openEditor(event);
    };
    if([...event.srcElement.classList].includes('cancelbtn') ) {
        commentUtil.closeEditor(event);
    };
    if([...event.srcElement.classList].includes('delbtn') ) {
        commentUtil.deleteComment(event,comments);
    };
    if([...event.srcElement.classList].includes('savebtn') ) {
        commentUtil.updateComment(event);
    };
    if([...event.srcElement.classList].includes('replybtn') ) {
        commentUtil.openReplyEditor(event);
    };
    if([...event.srcElement.classList].includes('cancelReplybtn') ) {
        commentUtil.closeReplyEditor(event);
    };
    if([...event.srcElement.classList].includes('addReplybtn') ) {
        commentUtil.closeReplyEditor(event);
        addReply(event);
    };
  });


 
async function addRootComment() {
    const content = document.querySelector('#rootcontent').value;
    const author = 'Rahul';
    const commentData = { content, author, replies: [], createdAt: (new Date()).toDateString(),lvl: 0};
    const savedComment = await commentService.addComment(commentData);
    commentUtil.addRootCommentDom({ ...commentData,id: savedComment.id});
    comments.push({commentData, id: savedComment.id});
}

async function addReply(e) {
    const replyWrapper = e.target.parentElement.parentElement;
    const parentCommentId = replyWrapper.dataset.parentid;
    const parentLvl = replyWrapper.dataset.lvl;
    const content = replyWrapper.querySelector('.reply').value;
    const author = 'Rahul';
    const commentData = { content, author, replies: [], createdAt: (new Date()).toDateString(),lvl: +parentLvl+1};
    const savedComment = await commentService.addComment(commentData);
    const parentComment = await commentService.getComment(parentCommentId);
    parentComment.replies.push(savedComment);
    commentService.updateCommentReplies(parentCommentId, parentComment.replies);
    const savedCommentData = await savedComment.get()
    commentUtil.addReplyCommentDom(replyWrapper, {...savedCommentData.data(), id: savedCommentData.id})
}

})();