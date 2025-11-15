import styled from "styled-components";
import bgImage from "../../img/bg_2.jpg";

export const StyledTetrisWrapper = styled.div`
    background: url(${bgImage}) #000;
    background-color: rgba(0, 0, 0, 0.3); /* dim layer */
    background-blend-mode: darken; /* or multiply */
    background-size: cover;
    overflow: hidden;
    width: 100%;
    height: 100vh;
`;

export const StyledTetris = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 15px;
    margin: 0 auto;
    max-width: 900px; 
    
    aside{
        width: 100%;
        max-width: 200px;
        display: block;
        padding: 0 20px;
    }
`;
