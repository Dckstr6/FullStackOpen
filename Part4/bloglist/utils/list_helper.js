const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((a,b) => a+b.likes,0);
}


// can use lodash library for the last 2 functions
// const favoriteBlog = (blogs) => {
//     const map = new Map();
//     for(let blog of blogs){
//         map.set(blog.author,map.has(blog.author)?map.get(blog.author)++:1);
//     }
//     const res= map.entries().reduce((a,e) => e[1] > a[1]? e : a);
//     return {"author":res[0],"blogs":res[1]};
// }

// const mostLikes = (blogs) => {
//     const map = new Map();
//     for(let blog of blogs){
//         map.set(blog.author,map.has(blog.author)?map.get(blog.author)+blog.likes:blog.likes);
//     }
//     const res = map.entries().reduce((a,e) => e[1] > a[1]? e : a);
//     return {"author":res[0],"likes":res[1]};
// }

module.exports = {dummy,totalLikes};