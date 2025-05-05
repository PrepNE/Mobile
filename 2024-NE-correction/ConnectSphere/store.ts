import { atom } from "recoil";
import { Post } from "./types";

export const usernameState = atom({
    key: 'usernameState',
    default: ''
});

export const bookmarksState = atom<Post[]>({
    key: 'BookmarksState',
    default: []
});