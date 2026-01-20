// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import 'raf/polyfill';

import React, { Component } from 'react';
import './App.css';
import './Poker.css';

import Spinner from './Spinner';
import WinScreen from './WinScreen'
import SocialSection from './components/social/SocialSection';
import EmoticonModal from './components/emoticons/EmoticonModal';
import Chat from './components/chat/Chat';

import Player from "./components/players/Player";
import ShowdownPlayer from "./components/players/ShowdownPlayer";
import Card from "./components/cards/Card";

import { 
  generateDeckOfCards, 
  shuffle, 
  dealPrivateCards,
} from './utils/cards.js';

import { 
  generateTable, 
  beginNextRound,
  checkWin
} from './utils/players.js';

import { 
  determineBlindIndices, 
  anteUpBlinds, 
  determineMinBet,
  handleBet,
  handleFold, 
} from './utils/bet.js';

import {
  handleAI as handleAIUtil
} from './utils/ai.js';

import {
  renderShowdownMessages,
  renderActionButtonText,
  renderNetPlayerEarnings,
  renderActionMenu
} from './utils/ui.js';

import { cloneDeep } from 'lodash';

class App extends Component {
  state = {
    loading: true,
    winnerFound: null,
    players: null,
    numPlayersActive: null,
    numPlayersFolded: null,
    numPlayersAllIn: null,
    activePlayerIndex: null,
    dealerIndex: null,
    blindIndex: null,
    deck: null,
    communityCards: [],
    pot: null,
    highBet: null,
    betInputValue: null,
    sidePots: [],
    minBet: 20,
    phase: 'loading',
    playerHierarchy: [],
    showDownMessages: [],
    playActionMessages: [],
    playerAnimationSwitchboard: {
      0: {isAnimating: false, content: null},
      1: {isAnimating: false, content: null},
      2: {isAnimating: false, content: null},
      3: {isAnimating: false, content: null},
      4: {isAnimating: false, content: null},
      5: {isAnimating: false, content: null}
    },
    displayedPlayerName: null,
    currentUserEmoticon: null,
    isEmoticonModalOpen: false
  }

  cardAnimationDelay = 0;
  
  loadTable = () => {

  }

  async componentDidMount() {
    const players = await generateTable();
    const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
    const blindIndicies = determineBlindIndices(dealerIndex, players.length);
    const playersBoughtIn = anteUpBlinds(players, blindIndicies, this.state.minBet);
    
    const imageLoaderRequest = new XMLHttpRequest();

imageLoaderRequest.addEventListener("load", e => {
    console.log(`${e.type}`);
    console.log(e);
    console.log("Image Loaded!");
    this.setState({
      loading: false,
    })
});

imageLoaderRequest.addEventListener("error", e => {
    console.log(`${e.type}`);
    console.log(e);
});


imageLoaderRequest.addEventListener("loadstart", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.addEventListener("loadend", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.addEventListener("abort", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.addEventListener("progress", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.open("GET", "./assets/table-nobg-svg-01.svg");
imageLoaderRequest.send();

    this.setState(prevState => ({
      // loading: false,
      players: playersBoughtIn,
      numPlayersActive: players.length,
      numPlayersFolded: 0,
      numPlayersAllIn: 0,
      activePlayerIndex: dealerIndex,
      dealerIndex,
      blindIndex: {
        big: blindIndicies.bigBlindIndex,
        small: blindIndicies.smallBlindIndex,
      },
      deck: shuffle(generateDeckOfCards()),
      pot: 0,
      highBet: prevState.minBet,
      betInputValue: prevState.minBet,
      phase: 'initialDeal',
    }))
    this.runGameLoop();
  }

  handleBetInputChange = (val, min, max) => {
    if (val === '') val = min
    if (val > max) val = max
      this.setState({
        betInputValue: parseInt(val, 10),
      });
  }
  
  changeSliderInput = (val) => {
    this.setState({
      betInputValue: val[0]
    })
  }

  pushAnimationState = (index, content) => {
    const newAnimationSwitchboard = Object.assign(
      {}, 
      this.state.playerAnimationSwitchboard,
      {[index]: {isAnimating: true, content}}     
    )
    this.setState({playerAnimationSwitchboard: newAnimationSwitchboard});
  }

  popAnimationState = (index) => {
    const persistContent = this.state.playerAnimationSwitchboard[index].content;
    const newAnimationSwitchboard = Object.assign(
      {}, 
      this.state.playerAnimationSwitchboard,
      {[index]: {isAnimating: false, content: persistContent}}     
    )
    this.setState({playerAnimationSwitchboard: newAnimationSwitchboard});
  }

  handleBetInputSubmit = (bet, min, max) => {
    const {playerAnimationSwitchboard, ...appState} = this.state;
    const { activePlayerIndex } = appState;
    this.pushAnimationState(activePlayerIndex, `${renderActionButtonText(this.state.highBet, this.state.betInputValue, this.state.players[this.state.activePlayerIndex])} ${(bet > this.state.players[this.state.activePlayerIndex].bet) ? (bet) : ""}`);
    const newState = handleBet(cloneDeep(appState), parseInt(bet, 10), parseInt(min, 10), parseInt(max, 10));
      this.setState(newState, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => {
          
            this.handleAI()
          }, 1200)
        }
      });
  }

  handleFold = () => {
    const {playerAnimationSwitchboard, ...appState} = this.state
    const newState = handleFold(cloneDeep(appState));
      this.setState(newState, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => {
          
            this.handleAI()
          }, 1200)
        }
      })
  }

  handleAI = () => {
    const {playerAnimationSwitchboard, ...appState} = this.state;
    const newState = handleAIUtil(cloneDeep(appState), this.pushAnimationState)

      this.setState({
            ...newState,
            betInputValue: newState.minBet
      }, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => {
          
            this.handleAI()
          }, 1200)
        }
      })
  }

  handleAvatarClick = (playerIndex) => {
    const player = this.state.players[playerIndex];
    // Check if it's the current user (robot: false)
    if (!player.robot) {
      // Open emoticon modal for current user
      this.setState({ isEmoticonModalOpen: true });
    } else {
      // Display name for other players
      this.setState({ displayedPlayerName: playerIndex });
      // Hide after 3 seconds
      setTimeout(() => {
        this.setState({ displayedPlayerName: null });
      }, 3000);
    }
  }

  handleEmoticonSelect = (emoticon) => {
    this.setState({ 
      currentUserEmoticon: emoticon,
      isEmoticonModalOpen: false 
    });
    // Hide emoticon after 5 seconds
    setTimeout(() => {
      this.setState({ currentUserEmoticon: null });
    }, 5000);
  }

  handleCloseEmoticonModal = () => {
    this.setState({ isEmoticonModalOpen: false });
  }

  renderBoard = () => {
    const { 
      players,
      activePlayerIndex,
      dealerIndex,
      clearCards,
      phase,
      playerAnimationSwitchboard
    } = this.state;
    // Reverse Players Array for the sake of taking turns counter-clockwise.
    const reversedPlayers = players.reduce((result, player, index) => {
      
      const isActive = (index === activePlayerIndex);
      const hasDealerChip = (index === dealerIndex);


      result.unshift(
          <Player
            key={index}
            arrayIndex={index}
            isActive={isActive}
            hasDealerChip={hasDealerChip}
            player={player}
            clearCards={clearCards}
            phase={phase}
            playerAnimationSwitchboard={playerAnimationSwitchboard}      
            endTransition={this.popAnimationState}
            onAvatarClick={this.handleAvatarClick}
            displayedPlayerName={this.state.displayedPlayerName === index ? player.name : null}
            currentUserEmoticon={!player.robot ? this.state.currentUserEmoticon : null}
          />
      )
      return result
    }, []);
    return reversedPlayers.map(component => component);
  }

  renderCommunityCards = (purgeAnimation) => {
    return this.state.communityCards.map((card, index) => {
      let cardData = {...card};
      if (purgeAnimation) {
        cardData.animationDelay = 0;
      }
      return(
        <Card key={index} cardData={cardData}/>
      );
    });
  }

  runGameLoop = () => {
    const newState = dealPrivateCards(cloneDeep(this.state))
    this.setState(newState, () => {
      if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
        setTimeout(() => {
          this.handleAI()
        }, 1200)
      }
    })
  }

  renderRankTie = (rankSnapshot) => {
    return rankSnapshot.map(player => {
      return this.renderRankWinner(player);
    })
  }

  renderRankWinner = (player) => {
    const { name, bestHand, handRank } = player;
    const playerStateData = this.state.players.find(statePlayer => statePlayer.name === name);
    return (
      <div className="showdown-player--entity" key={name}>
        <ShowdownPlayer
          name={name}
          avatarURL={playerStateData.avatarURL}
          cards={playerStateData.cards}
          roundEndChips={playerStateData.roundEndChips}
          roundStartChips={playerStateData.roundStartChips}
        />
        <div className="showdown-player--besthand--container">
          <h5 className="showdown-player--besthand--heading">
            Best Hand
          </h5>
          <div className='showdown-player--besthand--cards' style={{alignItems: 'center'}}>
            {
              bestHand.map((card, index) => {
                // Reset Animation Delay
                const cardData = {...card, animationDelay: 0}
                return <Card key={index} cardData={cardData}/>
              })
            }
          </div>
        </div>
        <div className="showdown--handrank">
          {handRank}
        </div>
        {renderNetPlayerEarnings(playerStateData.roundEndChips, playerStateData.roundStartChips)}
      </div>
    )
  }

  renderBestHands = () => {
    const { playerHierarchy } = this.state;

    return playerHierarchy.map(rankSnapshot => {
      const tie = Array.isArray(rankSnapshot);
      return tie ? this.renderRankTie(rankSnapshot) : this.renderRankWinner(rankSnapshot);
    })
  }

  handleNextRound = () => {
    this.setState({clearCards: true})
    const newState = beginNextRound(cloneDeep(this.state))
    // Check win condition
    if(checkWin(newState.players)) {
      this.setState({ winnerFound: true })
      return;
    }
      this.setState(newState, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => this.handleAI(), 1200)
        }
      })
  }

  renderActionButtons = () => {
    const { highBet, players, activePlayerIndex, phase, betInputValue } = this.state
    const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet)
    const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet
    return ((players[activePlayerIndex].robot) || (phase === 'showdown')) ? null : (
      <React.Fragment>
        <button className='action-button' onClick={() => this.handleBetInputSubmit(betInputValue, min, max)}>
          {renderActionButtonText(highBet, betInputValue, players[activePlayerIndex])}
        </button>
        <button className='fold-button' onClick={() => this.handleFold()}>
          Fold
        </button>
      </React.Fragment>
      )
  }

  renderShowdown = () => {
    return(
      <div className='showdown-container--wrapper'>
        <h5 className="showdown-container--title">
          Round Complete!
        </h5>
        <div className="showdown-container--messages">
          { renderShowdownMessages(this.state.showDownMessages)}
        </div>
        <h5 className="showdown-container--community-card-label">
          Community Cards
        </h5>
        <div className='showdown-container--community-cards'>
          { this.renderCommunityCards(true) }
        </div>
        <button className="showdown--nextRound--button" onClick={() => this.handleNextRound()}> Next Round </button>
          { this.renderBestHands() }
      </div>
    )
  }

  renderGame = () => {
    const { highBet, players, activePlayerIndex, phase } = this.state;
    return (
      <div className='poker-app--background'>
        <div className="poker-table--container">
          <img className="poker-table--table-image" src={"./assets/table-nobg-svg-01.svg"} alt="Poker Table" />
          { this.renderBoard() }
          <div className='community-card-container' >
            { this.renderCommunityCards() }
          </div>
          <div className='pot-container'>
            <img style={{height: 55, width: 55}} src={'./assets/pot.svg'} alt="Pot Value"/>
            <h4> {`${this.state.pot}`} </h4>
          </div>
        </div>
        { (this.state.phase === 'showdown') && this.renderShowdown() } 
        <div className='game-action-bar' >
          <div className='action-buttons'>
              { this.renderActionButtons() }
          </div>
          <div className='slider-boi'>
            { (!this.state.loading)  && renderActionMenu(highBet, players, activePlayerIndex, phase, this.handleBetInputChange)}
          </div>
        </div>
      </div>
    )
  }
  getCurrentPlayerName = () => {
    if (!this.state.players) return null;
    const currentPlayer = this.state.players.find(player => !player.robot);
    return currentPlayer ? currentPlayer.name : null;
  }

  render() {
    const currentPlayerName = this.getCurrentPlayerName();
    
    return (
      <div className="App">
        <SocialSection />
        <EmoticonModal
          isOpen={this.state.isEmoticonModalOpen}
          onClose={this.handleCloseEmoticonModal}
          onSelectEmoticon={this.handleEmoticonSelect}
        />
        <div className='poker-game--layout'>
          <div className='poker-table--wrapper'> 
            { 
              (this.state.loading) ? <Spinner/> : 
              (this.state.winnerFound) ? <WinScreen /> : 
              this.renderGame()
            }
          </div>
          {!this.state.loading && !this.state.winnerFound && (
            <Chat currentPlayerName={currentPlayerName} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
