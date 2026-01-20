import React, { Component } from 'react';
import './Chat.css';
import { chatService } from '../../services/chatService';

class Chat extends Component {
  state = {
    messages: [],
    inputValue: '',
    isConnected: false
  };

  componentDidMount() {
    // Subscribe to chat messages
    chatService.subscribe((message) => {
      this.setState(prevState => ({
        messages: [...prevState.messages, message]
      }));
      // Auto-scroll to bottom
      this.scrollToBottom();
    });

    // Check connection status
    chatService.onConnectionChange((isConnected) => {
      this.setState({ isConnected });
    });

    // Initialize connection
    chatService.connect();
  }

  componentWillUnmount() {
    chatService.unsubscribe();
  }

  scrollToBottom = () => {
    const messagesContainer = this.messagesEndRef?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSendMessage = (e) => {
    e.preventDefault();
    const { inputValue } = this.state;
    const { currentPlayerName } = this.props;

    if (inputValue.trim() && currentPlayerName) {
      chatService.sendMessage({
        playerName: currentPlayerName,
        message: inputValue.trim(),
        timestamp: new Date()
      });
      this.setState({ inputValue: '' });
    }
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage(e);
    }
  };

  formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  render() {
    const { messages, inputValue, isConnected } = this.state;
    const { currentPlayerName } = this.props;

    return (
      <div className="chat-container">
        <div className="chat-header">
          <h3 className="chat-title">Group Chat</h3>
          <div className={`chat-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="chat-status-dot"></span>
            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
        <div className="chat-messages" ref={(el) => { this.messagesEndRef = el; }}>
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.playerName === currentPlayerName ? 'own-message' : ''}`}
              >
                <div className="chat-message-header">
                  <span className="chat-message-author">{msg.playerName}</span>
                  <span className="chat-message-time">{this.formatTime(msg.timestamp)}</span>
                </div>
                <div className="chat-message-content">{msg.message}</div>
              </div>
            ))
          )}
          <div ref={(el) => { this.messagesEndRef = el; }} />
        </div>
        <form className="chat-input-form" onSubmit={this.handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder={currentPlayerName ? "Type a message..." : "Enter your name to chat"}
            value={inputValue}
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            disabled={!currentPlayerName || !isConnected}
          />
          <button 
            type="submit" 
            className="chat-send-button"
            disabled={!inputValue.trim() || !currentPlayerName || !isConnected}
          >
            Send
          </button>
        </form>
      </div>
    );
  }
}

export default Chat;

