import { commentService } from '../services/comment.service.js';
import asyncForEach from './asyncForEach.js';


/*
    Contains functions to modify comments on DOM
*/
export class CommentUtil {

    addRootCommentDom(comment) {
        const commentsDiv = document.querySelector('#comments');
        let customStyle = `border-left: 1px dashed white;padding-left: ${(comment.lvl+1) *30}px;`;
        const commHtml = `
        <div id="${comment.id}">
            <div class="comment">
                <p class="author">${comment.author}</p>
                <p class="date">${comment.createdAt}</p>
                <p class="content">
                    ${comment.content}    
                </p>
            </div>
            <textarea class="editor edit" rows="3">${comment.content}</textarea>
                <div class="btnarea readmodebtns">
                    <button class="editbtn">Edit</button>
                    <button class="replybtn">Reply</button>
                    <button class="delbtn">Delete</button>
                </div>
                <div class="btnarea editmodebtns">
                    <button class="cancelbtn">Cancel</button>
                    <button class="savebtn">Save</button>
                </div>
        </div>
        <div data-parentId="${comment.id}"  data-lvl="${comment.lvl}" style="${customStyle}">
                    <textarea class="editor reply" rows="3" placeholder="Reply!!!"></textarea>
                    <div class="btnarea replybtns">
                        <button class="cancelReplybtn">Cancel</button>
                        <button class="addReplybtn">Save</button>
                    </div>
                    
            </div>
    `;
        commentsDiv.innerHTML+= commHtml;
        document.querySelector('#rootcontent').value = ``;
    }

    addReplyCommentDom(commentWrapper, comment) {
        let customStyle = `border-left: 1px dashed white;padding-left: ${(comment.lvl+1) *30}px;`;
        const commHtml = `
        <div id="${comment.id}">
            <div class="comment">
                <p class="author">${comment.author}</p>
                <p class="date">${comment.createdAt}</p>
                <p class="content">
                    ${comment.content}    
                </p>
            </div>
            <textarea class="editor edit" rows="3">${comment.content}</textarea>
                <div class="btnarea readmodebtns">
                    <button class="editbtn">Edit</button>
                    <button class="replybtn">Reply</button>
                    <button class="delbtn">Delete</button>
                </div>
                <div class="btnarea editmodebtns">
                    <button class="cancelbtn">Cancel</button>
                    <button class="savebtn">Save</button>
                </div>
        </div>
        <div data-parentId="${comment.id}"  data-lvl="${comment.lvl}" style="${customStyle}">
                    <textarea class="editor reply" rows="3" placeholder="Reply!!!"></textarea>
                    <div class="btnarea replybtns">
                        <button class="cancelReplybtn">Cancel</button>
                        <button class="addReplybtn">Save</button>
                    </div>
                    
            </div>
    `;
        commentWrapper.innerHTML+= commHtml;
        commentWrapper.querySelector('.reply').value = ``;
    }

    // Paints all comments on the DOM when webpage opened
    async paintRoots(comments) {
        const commentsDiv = document.querySelector('#comments');
        let commHtml = await this.getHTMLforPaint(comments,0);
        commentsDiv.innerHTML+= commHtml;
    }

    async getHTMLforPaint(comments, lvl) {
      if(!comments) return "";
        let commHtml = ``;
        let customStyle = `border-left: 1px dashed white;padding-left: ${(lvl+1) *30}px;`;
        
        await asyncForEach(comments, async comment => {
            if(lvl>0) {
                let commentRef = await comment.get();
                comment = { id: commentRef.id, ...commentRef.data()} 
            }
           let rootHtml = `
            <div  id="${comment.id}">
            <div class="comment">
                <p class="author">${comment.author}</p>
                <p class="date">${comment.createdAt}</p>
                <p class="content">
                    ${comment.content}    
                </p>
            </div>
            <textarea class="editor edit" rows="3">${comment.content}</textarea>
                <div class="btnarea readmodebtns">
                    <button class="editbtn">Edit</button>
                    <button class="replybtn">Reply</button>
                    <button class="delbtn">Delete</button>
                </div>
                <div class="btnarea editmodebtns">
                    <button class="cancelbtn">Cancel</button>
                    <button class="savebtn">Save</button>
                </div>
        </div>
            `;
            let repliesHtml = `
            <div data-parentId="${comment.id}" data-lvl="${comment.lvl}" style="${customStyle}">
                    <textarea class="editor reply" rows="3" placeholder="Reply!!!"></textarea>
                    <div class="btnarea replybtns">
                        <button class="cancelReplybtn">Cancel</button>
                        <button class="addReplybtn">Save</button>
                    </div>
                    ${await this.getHTMLforPaint(comment.replies, lvl+1)}
            </div>
            `;
            commHtml += rootHtml + repliesHtml;
            
        });
        return commHtml;
    }
    
    // The comment editor
    openEditor(e) {
        this.closeAllEdits();
        const replyWrapper = e.target.parentElement.parentElement;
        replyWrapper.querySelector('.comment').style.display = "none";
        replyWrapper.querySelector('.edit').style.display = "block";  
        
        replyWrapper.querySelector('.readmodebtns').style.display = "none";
        replyWrapper.querySelector('.editmodebtns').style.display = "block";
    }

    closeEditor(e) {
        const replyWrapper = e.target.parentElement.parentElement;
        replyWrapper.querySelector('.comment').style.display = "block";
        replyWrapper.querySelector('.edit').style.display = "none";  
        replyWrapper.querySelector('.edit').value = (replyWrapper.querySelector('.content').innerHTML).trim(); 
        replyWrapper.querySelector('.readmodebtns').style.display = "block";
        replyWrapper.querySelector('.editmodebtns').style.display = "none";
    }

    // We're closing any editor, if open before opening another
    closeAllEdits() {
        [...document.querySelectorAll('.editor')].map(item => item.style.display = "none"); 
        [...document.querySelectorAll('.editmodebtns')].map(item => item.style.display = "none");
        [...document.querySelectorAll('.replybtns')].map(item => item.style.display = "none");
    }

    // The reply editor
    openReplyEditor(e) {
        this.closeAllEdits();
        const replyWrapper = e.target.parentElement.parentElement.nextElementSibling;
        replyWrapper.querySelector('.reply').style.display = "block";  
        replyWrapper.querySelector('.replybtns').style.display = "block";
    }

    closeReplyEditor(e) {
        const replyWrapper = e.target.parentElement.parentElement;
        replyWrapper.querySelector('.reply').style.display = "none";  
        replyWrapper.querySelector('.replybtns').style.display = "none";
    }

    async deleteComment(e, comments) {
        const replyWrapper = e.target.parentElement.parentElement;
        const parentCommentId = replyWrapper.parentElement.dataset.parentid;

        // Deleting self and child comments from DOM
        replyWrapper.parentElement.removeChild(replyWrapper.nextElementSibling);
        replyWrapper.parentElement.removeChild(replyWrapper);

        if(parentCommentId === 'root') {
           commentService.deleteComment(replyWrapper.id);
            return;
        }

        const parentComment = this.findParentComment(comments,parentCommentId);
        const childIndex = parentComment.replies.findIndex(item => item.id === replyWrapper.id);
        parentComment.replies.splice(childIndex,1);

        // For reply, removing the same from it's parent's replies array
        commentService.updateCommentReplies(parentCommentId, parentComment.replies);
        commentService.deleteComment(replyWrapper.id);
                
    }

    // Recursively find parent comment for any comment
    findParentComment(comments, parentCommentId) {
        if(!comments) return null;
        let foundComment = null;
        comments.every(comment => {
            if(comment.id === parentCommentId)  foundComment = comment;
            const checkInReplies = this.findParentComment(comment.replies, parentCommentId);
            if(checkInReplies) foundComment= checkInReplies;
            
        });
        return foundComment;
    }

    updateComment(e) {
        const replyWrapper = e.target.parentElement.parentElement;
        const newContent = replyWrapper.querySelector('.editor').value;
        replyWrapper.querySelector('.content').innerHTML = newContent;
        commentService.updateCommentContent(replyWrapper.id, newContent);
        this.closeEditor(e);
    }

}

export const commentUtil = new CommentUtil;
