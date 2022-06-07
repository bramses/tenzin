'use strict';
const snoowrap = require('snoowrap');
const dotenv = require('dotenv');
dotenv.config();
const getUrlTitle = require("get-url-title")


const userAgent = process.env.USER_AGENT;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const subreddit = process.env.SUBREDDIT;

const requester = new snoowrap({
  userAgent,
  clientId,
  clientSecret,
  username,
  password
});

const postToReddit = async (subreddit, title, text) => {
    try {
        const res = await requester.getSubreddit(subreddit).submitLink({
            title,
            url: text,
            sendReplies: true
        });
        return res;
    } catch (err) {
        console.log(err);
        return err;
    }
}

const fetchTitle = async (url) => {
    try {
        return await getUrlTitle(url);
    } catch (err) {
        console.log(err);
    }       
}

const generateRedditCommentsLink = (submission) => {
    try {
        return `https://www.reddit.com/r/${subreddit}/comments/${submission.name.split('_')[1]}`;
    } catch (err) {
        console.log(err);
    }
}

const strWrapperForURL = (str) => {
    return `<CenterChild>\n\t**[Discuss this post on Reddit](${str})**\n</CenterChild>`
}

const main = async (url) => {
    try {
        const title = await fetchTitle(url);
        const res = await postToReddit(subreddit, title, url);
        console.log(strWrapperForURL(generateRedditCommentsLink(res)));
    } catch (err) {
        console.log(err);
    }
}

main(process.argv[2]);