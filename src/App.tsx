import "nes.css/css/nes.min.css";
import React, { useEffect, useState } from "react";
import api, { POKEMON } from "./api";
import { Pokemon } from "./types";
import { Image, Button, Container, Input } from '@chakra-ui/react'
import styles from './App.module.css';

function App() {

  const [pokemon, setPokemon] = useState<Pokemon>({
    image: "",
    name: "",
    id: 0
  });
  const [answered, setAnswered] = useState<Boolean>(false)
  const [loading, setLoading] = useState<Boolean>(true)
  const [answer, setAnswer] = useState<string>("")
  const [result, setResult] = useState("")
  const [wins, setWins] = useState(
    // @ts-ignore
    JSON.parse(localStorage.getItem("wins") || 0)
  )
  const [loses, setLoses] = useState(
    // @ts-ignore
    JSON.parse(localStorage.getItem("loses") || 0)
  )
  const [pokelist, setPokelist] = useState<string[]>()
  const [hidePokelist, setHidePokelist] = useState<Boolean>(false)

  const getPokemon = async () => {
    setLoading(true);
    console.log(pokemon)
    const res = await api.random();
    setPokemon(res);
    setLoading(false);
  };

  useEffect(() => {
    getPokemon();
  }, [])

  useEffect(() => {
    if (typeof wins) {
      localStorage.setItem('wins', JSON.stringify(wins))
    }
  }, [wins])

  useEffect(() => {
    localStorage.setItem('loses', "" + JSON.stringify(loses))
  }, [loses])


  const verifyPokemon = () => {
    if (answer === pokemon.name || answer.toLocaleLowerCase() === pokemon.name.toLocaleLowerCase() || answer.replace(/\s/g, '') === pokemon.name.replace(/\s/g, '') || answer.toLocaleLowerCase().replace(/\s/g, '') === pokemon.name.toLocaleLowerCase().replace(/\s/g, '') || answer.split(".").join("") === pokemon.name.split(".").join("") || pokemon.name.split(".").join("").toLocaleLowerCase().replace(/\s/g, '') === answer.split(".").join("").toLocaleLowerCase().replace(/\s/g, '')) {
      setResult("You won!")
      let newWins = wins + 1
      setWins(newWins)

    } else {
      setResult("Good luck next time!")
      let newLoses = loses + 1
      setLoses(newLoses)
    }
    setAnswered(true)
    setAnswer("")
  }

  const getUserGuess = (e: any) => {
    setAnswer(e.target.value)
    setPokelist(POKEMON.filter(poke => poke.startsWith(e.target.value)))
    setHidePokelist(false)
  }

  const playAgain = () => {
    getPokemon()
    setAnswer("")
    setAnswered(false)
    setResult("")
  }
  const handlePokeSelect = (poke: string) => {
    setAnswer(poke)
    setHidePokelist(true)
  }


  return (
    <div className={styles.web}>
      <h1 className="nes-text is-warning">Can you guess the pokemon?</h1>
      <div className={styles.container}>
        <Image className={styles.imagen} src={pokemon.image} alt={pokemon.name} boxSize='250px' filter='auto' brightness={answered ? '100%' : '0%'} />
        <div>
          <div className={styles.utility}>
            <Input value={answer} onChange={getUserGuess} className="nes-input is-success" type="text" />

            <Button disabled={answered ? true : false} className="nes-btn is-primary" onClick={() => verifyPokemon()}>GO</Button>
          </div>
          <div className={styles.answersListContainer}>
            {hidePokelist ? <></> :
              <>
                {answer.length > 0 ?
                  <ul className={styles.answersList}>
                    {pokelist ? pokelist.map((poke, index) => {
                      return (
                        <li className="nes-pointer" onClick={() => handlePokeSelect(poke)} key={index}>{poke}</li>
                      )
                    }) : ""}
                  </ul>
                  :
                  <div></div>
                }</>}
          </div>
        </div>
        <div className={styles.playAgain}>
          {result}
          {answered ? <div style={result === "You won!" ? { color: "green" } : { color: "red" }}>It was {pokemon.name}</div> : ""}
          {answered ? <Button onClick={() => playAgain()} className="nes-btn is-success">Play Again!</Button> : ""}
        </div>

        <div className={styles.wins}>
          <p>Total wins:{wins}</p>
          <p>Total loses:{loses}</p>
        </div>
      </div >
    </div>
  )

}

export default App;
