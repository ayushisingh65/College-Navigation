// Get the server IP from environment variable or use the local network IP
const getServerUrl = () => {
    // In development, you can set this in your .env file
    if (process.env.REACT_APP_SERVER_URL) {
        return process.env.REACT_APP_SERVER_URL;
    }
    
    // For local development network access
    const hostname = window.location.hostname;
    return `http://${hostname}:8000`;
};

const getWebSocketUrl = () => {
    // In development, you can set this in your .env file
    if (process.env.REACT_APP_WS_URL) {
        return process.env.REACT_APP_WS_URL;
    }
    
    // For local development network access
    const hostname = window.location.hostname;
    return `ws://${hostname}:8000`;
};

export const config = {
    serverUrl: getServerUrl(),
    wsUrl: getWebSocketUrl(),
}; 