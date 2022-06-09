import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import GlobalStateContext from "../global/GlobalStateContext";
import { goToPostDetailsPage } from "../routes/coordinator";
import { requestCreatePostLike } from "../services/requests";

const StyledPostCard = styled.div`
background-color: white;
width:50vw;
border-style: solid;
border-color: #ededeb;
border-radius: 10px;
font-size: x-small;
justify-content: center;

@media screen and (min-device-width: 320px) and (max-device-width: 480px){
 width: 100%;
}

img{
    width: 100%;
    height: 50vh;
}

button{
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 3vh;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
  border-radius: 4px;
  color: #3D3D3D;
  background: white;
  box-shadow: 0px 0.5px 1px rgba( #D6D6E7);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

button:focus {
  box-shadow: 0px 0.5px 1px rgba( #D6D6E7), 0px 0px 0px 3.5px rgba( #D6D6E7);
  outline: 0;
}
`

export function PostCard(props) {
    const navigate = useNavigate();
    const { setters, getters } = useContext(GlobalStateContext);
    const [isDownVoted, setIsDownVoted] = useState(false);
    const [isUpVoted, setIsUpVoted] = useState(false);
    const { setPost } = setters;
    const { getPosts } = getters;
    const { id, userId, title, body, createdAt, voteSum, commentCount, userVote } = props.post;

    const date = createdAt && format(new Date(createdAt), "dd/MM/yyyy");

    useEffect(() => {
        if (userVote) {
            userVote === 1 ? setIsUpVoted(true) : setIsDownVoted(true);
        };
    }, [userVote]);

    const goToComments = () => {
        setPost(props.post);
        goToPostDetailsPage(navigate, id);
    };
    const chooseVote = (typeVote) => {
        if (typeVote === "up") {
            if (isDownVoted) {
                requestCreatePostLike(id, 1, getPosts);
                setIsUpVoted(true);
                setIsDownVoted(false);
            } else {
                requestCreatePostLike(id, 1, getPosts);
                setIsUpVoted(true);
            };
        } else {
            if (isUpVoted) {
                requestCreatePostLike(id, -1, getPosts);
                setIsDownVoted(true);
                setIsUpVoted(false);
            } else {
                requestCreatePostLike(id, -1, getPosts);
                setIsDownVoted(true);
            };
        };
    };
    const removeVote = (typeVote) => {
        requestCreatePostLike(id, getPosts);
        typeVote === "up" ? setIsUpVoted(false) : setIsDownVoted(false);
    };
    const showVoteButtons = props.isFeed && (
        <>
            {userVote && isDownVoted ?
                <button onClick={() => removeVote("down")}>Remover voto "Não Gostei"</button>
                : <button onClick={() => chooseVote("down")}>
                    {isUpVoted ? `Mudar voto para "Não Gostei"` : `Votar em "Não Gostei"`}
                </button>
            }
            <br />
            {userVote && isUpVoted ?
                <button onClick={() => removeVote("up")}>Remover voto "Gostei"</button>
                : <button onClick={() => chooseVote("up")}>
                    {isDownVoted ? `Mudar voto para "Gostei"` : `Votar em "Gostei"`}
                </button>
            }
        </>
    );

    return (
        <StyledPostCard>
        <article>
            <h3>{title}</h3>
            <span><b>Autor: </b>{userId}</span>
            <p>Criado em {date}</p>
            <img src={"https://picsum.photos/200/300?random=" + id} alt="Imagem aleatória do post" />
            <p><b>Descrição: </b>{body}</p>
            <p>Votos: {voteSum ? voteSum : 0}</p>
            {showVoteButtons}
            <p>Comentários: {commentCount ? commentCount : 0}</p>
            {props.isFeed && <button onClick={goToComments}>Ver comentários</button>}

        </article>
        </StyledPostCard>
    );
};
export default PostCard;