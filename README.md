# mojocomments

This is a vanilla JS solution for a multi-tiered comments system.

## Database used
 I am using Firebase's Firestore as a data storage.

 Why Firestore?
 - I have a loose schema definition
 - I wanted to serve this project on GH Pages and needed a free-tier data storage service with a great UI at backend.
 - For sometime, I've been meaning to learn and work on Firestore.

 ## Current Schema Design

 id: Autogen
 author: String
 content: String
 lvl: Number    `This holds the horizontal depth of the comment`
 replies: Array<DocumentReference>



