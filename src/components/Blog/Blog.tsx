import React from 'react'
import { Navigation } from "../Navigation/Navigation";
import { useThemeState, themes } from "utils";
import "./style.scss";

const { LIGHT } = themes;

export default function Blog() {
    document.title = "Dallas Carraher | Blog";
    const { theme } = useThemeState();
    return (
        <Navigation>
            <h2 className={theme === LIGHT ? "light" : "dark"}>Hello, welcome to my blog page. I'm going to do something here soon.</h2>
        </Navigation>
    )
}
